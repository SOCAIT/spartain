import React, { useState, useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import ArrowHeader from '../../components/ArrowHeader';
import { AuthContext } from '../../helpers/AuthContext';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AINutritionPlan = ({ navigation }) => {
//   const { user } = useAuth();
const [selectedDay, setSelectedDay] = useState('Mon');

  const [planName, setPlanName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [meals, setMeals] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { authState } = useContext(AuthContext);


  const generateNutritionPlan = async () => {
    if (!additionalInfo) {
      Alert.alert('Error', 'Please provide some details for the personalized plan.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${backend_url}api/generate-nutrition-plan`, {
        age: user.age,
        weight: user.weight,
        height: user.height,
        additionalInfo, // The detailed paragraph provided by the user
      });

      const generatedPlan = response.data.plan;
      setMeals(generatedPlan);
      Alert.alert('Success', 'Nutrition plan generated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate nutrition plan');
    } finally {
      setIsLoading(false);
    }
  };

  const saveNutritionPlan = async () => {
    if (!planName) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

    const dailyMealPlan = daysOfWeek.map(day => ({
      day: day,
      dailymealplandetailSet: meals[day] || [],
    }));

    const nutritionPlan = {
      name: planName,
      dailymealplanSet: dailyMealPlan,
    };

    try {
      const response = await axios.post(`${backend_url}graphql/`, {
        query: `
          mutation {
            createNutritionPlan(input: {
              name: "${nutritionPlan.name}",
              dailymealplanSet: ${JSON.stringify(nutritionPlan.dailymealplanSet).replace(/"([^"]+)":/g, '$1:')}
            }) {
              nutritionPlan {
                id
                name
              }
            }
          }
        `
      });

      if (response.data.errors) {
        Alert.alert('Error', 'Failed to create nutrition plan');
        console.error(response.data.errors);
      } else {
        Alert.alert('Success', 'Nutrition plan created successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create nutrition plan');
    }
  };

  return (
    <View style={styles.container}>
      <ArrowHeader navigation={navigation} title={"Create Nutrition Plan"} />

      <TextInput
        style={styles.input}
        placeholder="Plan Name"
        placeholderTextColor="#aaa"
        value={planName}
        onChangeText={setPlanName}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Please describe your goals, dietary preferences, and any other relevant information..."
        placeholderTextColor="#aaa"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateNutritionPlan}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Generating...' : 'Generate Nutrition Plan'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={meals[selectedDay] || []}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealDetails}>Calories: {item.calories} kcal</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.mealList}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveNutritionPlan}>
        <Text style={styles.buttonText}>Save Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealCard: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 15,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealDetails: {
    fontSize: 14,
    color: '#999',
  },
  mealList: {
    marginTop: 20,
  },
});

export default AINutritionPlan;

import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';
import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DaySelector from '../../components/DaySelector';

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CreateNutritionPlanScreen = ({ navigation }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0-6 for Monday-Sunday
  const [nutritionPlans, setNutritionPlans] = useState({ Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} });
  const [planName, setPlanName] = useState("");
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState({
    username: authState.username,
    id: authState.id
  });

  const updateNutritionPlan = (day, plan) => {
    setNutritionPlans({ ...nutritionPlans, [day]: plan });
  };

  const navigateToCreateNutrition = (day) => {
    const existingPlan = nutritionPlans[day];
    navigation.navigate('CreateNutritionScreen', { 
      day, 
      existingPlan, 
      updateNutritionPlan 
    });
  };

  const markAsRestDay = () => {
    updateNutritionPlan(dayNames[selectedDayIndex], { name: 'Rest Day', type: 'rest' });
  };

  const saveNutritionPlan = async () => {
    const formattedPlans = Object.keys(nutritionPlans).map((day, index) => {
      const plan = nutritionPlans[day];
      return plan.type === "nutrition"
        ? {
            name: plan.name,
            day: index,
            meals: plan.meals.map(meal => ({
              name: meal.name,
              calories: parseInt(meal.calories, 10),
              protein: parseInt(meal.protein, 10),
              carbs: parseInt(meal.carbs, 10),
              fats: parseInt(meal.fats, 10),
            })),
          }
        : {
            name: plan.name,
            day: index,
            meals: [],
          };
    }).filter(plan => plan !== null);

    if (formattedPlans.length === 7) {
      try {
        const response = await axios.post(
          backend_url + "graphql/",
          { 
            query: `mutation {
              createNutritionPlan(
                userId: ${user.id},
                name: "${planName}",
                description: "Nutrition Plan",
                plans: [
                  ${formattedPlans.map(plan => `
                    {
                      name: "${plan.name}",
                      day: ${plan.day},
                      meals: [
                        ${plan.meals.map(meal => `
                          {
                            name: "${meal.name}",
                            calories: ${meal.calories},
                            protein: ${meal.protein},
                            carbs: ${meal.carbs},
                            fats: ${meal.fats}
                          }
                        `).join(',')}
                      ]
                    }
                  `).join(',')}
                ]
              ) {
                nutritionPlan {
                  id
                  name
                  description
                  user {
                    id
                    username
                  }
                  nutritionSet {
                    day
                    mealSet {
                      name
                      calories
                      protein
                      carbs
                      fats
                    }
                  }
                }
              }
            }`
          }
        );

        if (response.data.errors) {
          console.error(response.data.errors);
          Alert.alert('Error', 'Failed to create nutrition plan');
        } else {
          Alert.alert('Success', 'Nutrition plan created successfully');
          setNutritionPlans({ Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} });
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to create nutrition plan');
      }
    } else {
      Alert.alert('Error', 'Please assign nutrition plans or rest days to all days');
    }
  };

  const renderNutritionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.nutritionItem}
      onPress={() => navigateToCreateNutrition(item.day)}
    >
      <View style={styles.nutritionItemContent}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayLabel}>{item.day}</Text>
          <Text style={styles.nutritionText}>{item.name || 'No Plan Set'}</Text>
        </View>
        {item.name ? (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigateToCreateNutrition(item.day)}
          >
            <MaterialIcons name="edit" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const nutritionListData = Object.keys(nutritionPlans).map(day => ({ day, ...nutritionPlans[day] }));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.gradient}>
        <ArrowHeaderNew navigation={navigation} title={"Create Nutrition Plan"} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nutrition Plan Name"
              placeholderTextColor="#aaa"
              value={planName}
              onChangeText={setPlanName}
            />

            <DaySelector 
              selectedDay={selectedDayIndex} 
              onDaySelect={setSelectedDayIndex}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.nutritionButton]} 
                onPress={() => navigateToCreateNutrition(dayNames[selectedDayIndex])}
              >
                <Text style={styles.buttonText}>Add/Edit Nutrition</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.restButton]} 
                onPress={markAsRestDay}
              >
                <Text style={styles.buttonText}>Rest Day</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={nutritionListData}
              renderItem={renderNutritionItem}
              keyExtractor={(item) => item.day}
              style={styles.nutritionList}
              scrollEnabled={false}
            />

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={saveNutritionPlan}
            >
              <Text style={styles.saveButtonText}>Save Nutrition Plan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'ios' ? 35 : 10,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  nutritionItem: {
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nutritionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayContainer: {
    flex: 1,
  },
  dayLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nutritionText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionButton: {
    backgroundColor: COLORS.darkOrange,
  },
  restButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 8,
    padding: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionList: {
    marginTop: 10,
  },
});

export default CreateNutritionPlanScreen; 
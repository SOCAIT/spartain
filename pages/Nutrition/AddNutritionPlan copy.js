import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import ArrowHeader from '../../components/ArrowHeader';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddNutritionPlan = ({ navigation }) => {
  const [planName, setPlanName] = useState('');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [meals, setMeals] = useState({});
  const [currentMeal, setCurrentMeal] = useState({ name: '', calories: '', carbs: '', proteins: '', fats: '', recipe: '', description: '' });
  const [mealSearchResults, setMealSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetNutrition, setTargetNutrition] = useState({ calories: 0, carbs: 0, proteins: 0, fats: 0 });

  // Fetch target nutrition from backend when component mounts or selectedDay changes
  useEffect(() => {
    const fetchTargetNutrition = async () => {
      try {
        const response = await axios.get(`${backend_url}get-target-nutrition`);
        setTargetNutrition(response.data);
      } catch (error) {
        console.error("Failed to fetch target nutrition", error);
        Alert.alert('Error', 'Failed to fetch target nutrition');
      }
    };
    fetchTargetNutrition();
  }, []);


  const saveNutritionPlan = async () => {
    if (!planName) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

    if (Object.keys(meals).length === 0) {
      Alert.alert('Error', 'Please add at least one meal');
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
  const searchMeals = (query) => {
    if (query.length > 2) {
      axios.get(`${backend_url}meal-search/?search=${query}`)
        .then((response) => {
          setMealSearchResults(response.data.results);
          setIsModalVisible(true);
        })
        .catch((error) => {
          console.error('Search error:', error);
          Alert.alert('Error', 'Failed to search meals. Please try again.');
        });
    } else {
      setMealSearchResults([]);
      setIsModalVisible(false);
    }
  };
  const addMeal = () => {
    if (!currentMeal.name || !currentMeal.calories) {
      Alert.alert('Error', 'Please fill out all meal details');
      return;
    }

    const updatedMeals = { ...meals };
    updatedMeals[selectedDay] = updatedMeals[selectedDay] ? [...updatedMeals[selectedDay], currentMeal] : [currentMeal];
    setMeals(updatedMeals);
    setCurrentMeal({ name: '', calories: '', carbs: '', proteins: '', fats: '', recipe: '', description: '' });
    setIsModalVisible(false);
  };

  const calculateTotalNutrition = () => {
    const mealsForDay = meals[selectedDay] || [];
    return mealsForDay.reduce((acc, meal) => {
      return {
        calories: acc.calories + parseFloat(meal.calories || 0),
        carbs: acc.carbs + parseFloat(meal.carbs || 0),
        proteins: acc.proteins + parseFloat(meal.proteins || 0),
        fats: acc.fats + parseFloat(meal.fats || 0),
      };
    }, { calories: 0, carbs: 0, proteins: 0, fats: 0 });
  };

  const totalNutrition = calculateTotalNutrition();

  const renderMealItem = ({ item, index }) => (
    <View style={styles.mealCard}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealDetails}>Calories: {item.calories} kcal</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeMeal(selectedDay, index)}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const removeMeal = (day, mealIndex) => {
    const updatedMeals = { ...meals };
    updatedMeals[day] = updatedMeals[day].filter((_, i) => i !== mealIndex);
    setMeals(updatedMeals);
  };

  const pressSearchItem = (item) => {
    setCurrentMeal({ ...currentMeal, name: item.name, id: item.id, calories: item.calories, carbs: item.carbs, proteins: item.proteins, fats: item.fats, recipe: item.recipe, description: item.description });
    setIsModalVisible(false);
  };

  const renderSearchMealItem = ({ item }) => (
    <TouchableOpacity style={styles.mealSearchItem} onPress={() => pressSearchItem(item)}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={{ color: "#fff" }}>{item.name}</Text>
        <Text style={styles.mealDetails}>Calories: {item.calories} kcal</Text>
      </View>
    </TouchableOpacity>
  );

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

      <View style={styles.daySelector}>
        {daysOfWeek.map(day => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.dayButton,
              { backgroundColor: selectedDay === day ? 'lightblue' : 'white' },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Meal Name"
          placeholderTextColor="#aaa"
          value={currentMeal.name}
          onChangeText={(text) => {
            setCurrentMeal({ ...currentMeal, name: text });
            searchMeals(text);
            // Implement your meal search logic here...
          }}
        />
        <TouchableOpacity style={styles.addButton} onPress={addMeal}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isModalVisible && (
        <View style={styles.modalContainer}>
          <FlatList
            data={mealSearchResults}
            renderItem={renderSearchMealItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.mealList}
          />
        </View>
      )}

      <FlatList
        data={meals[selectedDay] || []}
        renderItem={renderMealItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.mealList}
      />

      {/* Stylish compact nutrition vs target component */}
      <NutritionComparison totalNutrition={totalNutrition} targetNutrition={targetNutrition} />

      <TouchableOpacity style={styles.saveButton} onPress={saveNutritionPlan}>
        <Text style={styles.buttonText}>Save Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

// Compact component for total vs target nutrition
const NutritionComparison = ({ totalNutrition, targetNutrition }) => {
  return (
    <View style={styles.nutritionComparison}>
      <View style={styles.nutritionRow}>
        <Text style={styles.nutritionLabel}>Calories</Text>
        <Text style={styles.nutritionValue}>{totalNutrition.calories} / {targetNutrition.calories}</Text>
      </View>
      <View style={styles.nutritionRow}>
        <Text style={styles.nutritionLabel}>Carbs</Text>
        <Text style={styles.nutritionValue}>{totalNutrition.carbs}g / {targetNutrition.carbs}g</Text>
      </View>
      <View style={styles.nutritionRow}>
        <Text style={styles.nutritionLabel}>Proteins</Text>
        <Text style={styles.nutritionValue}>{totalNutrition.proteins}g / {targetNutrition.proteins}g</Text>
      </View>
      <View style={styles.nutritionRow}>
        <Text style={styles.nutritionLabel}>Fats</Text>
        <Text style={styles.nutritionValue}>{totalNutrition.fats}g / {targetNutrition.fats}g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  largeInput: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayButton: {
    padding: 10,
    borderRadius: 10,
  },
  mealList: {
    marginTop: 20,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  mealSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  mealInfo: {
    flex: 1,
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
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: '#2b2b2b',
    borderRadius: 5,
    padding: 10,
    maxHeight: 500,
    position: 'absolute',
    minHeight: 200,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nutritionComparison: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nutritionLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nutritionValue: {
    color: '#fff',
  },
});

export default AddNutritionPlan;

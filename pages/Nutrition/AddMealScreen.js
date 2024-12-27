import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image} from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import { COLORS } from '../../constants';

import axios from 'axios';
import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const MealPlanScreen = ({ route, navigation }) => {
  const { day, existingMeal,updateMeal } = route.params; // Get selected day from the route
  const [meals, setMeals] = useState(existingMeal || []);
  const [currentMeal, setCurrentMeal] = useState({ name: '', calories: '', carbs: '', proteins: '', fats: '' });
  const [mealSearchResults, setMealSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [targetNutrition, setTargetNutrition] = useState({ calories: 0, carbs: 0, proteins: 0, fats: 0 });

 // Function to calculate total nutritional values for the selected day
 const calculateTotalNutrition = () => {
    const mealsForDay = meals[day] || [];
    return meals.reduce((acc, meal) => {
      return {
        calories: acc.calories + (parseFloat(meal.calories) || 0),
        carbs: acc.carbs + (parseFloat(meal.carbs) || 0),
        proteins: acc.proteins + (parseFloat(meal.proteins) || 0),
        fats: acc.fats + (parseFloat(meal.fats) || 0),
      };
    }, { calories: 0, carbs: 0, proteins: 0, fats: 0 });
  };

  const totalNutrition = calculateTotalNutrition();

  const searchMeals = (query) => {
    if (query.length > 2) {
      axios.get(`${backend_url}meal-search/?search=${query}`)
        .then(response => {
          setMealSearchResults(response.data);
          setIsModalVisible(true);
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

    setMeals([...meals, currentMeal]);
    setCurrentMeal({ name: '', calories: '', carbs: '', proteins: '', fats: '' });
  };

  const removeMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
  };

  const pressSearchItem = (item) => {
    setCurrentMeal({ ...currentMeal, name: item.name, id: item.id, calories: item.calories, carbs: item.carbs, proteins: item.proteins, fats: item.fats, recipe: item.recipe, description: item.description });
    setIsModalVisible(false);
  };

  const renderMealItem = ({ item, index }) => (
    <View style={styles.mealCard}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealDetails}>Calories: {item.calories} kcal</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeMeal( index)}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchMealItem = ({ item }) => (
    <TouchableOpacity style={styles.mealSearchItem} onPress={() => pressSearchItem(item)}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={{ color: "#fff" }}>{item.name}</Text>
        <Text style={{ color: "#fff" }}>Calories: {item.calories} kcal</Text>
      </View>
    </TouchableOpacity>
  );

  const saveMealsAndGoBack = () => {
    if (meals.length > 0) {
      updateMeal(day, meals); // Pass all meals to the parent component
      navigation.goBack(); // Navigate back to the previous screen
    } else {
      Alert.alert('Error', 'Please add at least one meal');
    }
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={`Meal Plan for ${day}`} />

      {/* Total Nutrition Comparison */}
      <View style={styles.totalNutritionContainer}>
        <Text style={styles.totalTitle}>Total Nutrition for {day}</Text>
        <Text style={styles.totalInfo}>Calories: {totalNutrition.calories} kcal / Target: {targetNutrition.calories} kcal</Text>
        <Text style={styles.totalInfo}>Carbs: {totalNutrition.carbs} g / Target: {targetNutrition.carbs} g</Text>
        <Text style={styles.totalInfo}>Proteins: {totalNutrition.proteins} g / Target: {targetNutrition.proteins} g</Text>
        <Text style={styles.totalInfo}>Fats: {totalNutrition.fats} g / Target: {targetNutrition.fats} g</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Meal Name"
          placeholderTextColor="#aaa"
          value={currentMeal.name}
          onChangeText={(text) => {
            setCurrentMeal({ ...currentMeal, name: text })
            searchMeals(text)
        
          }
        }
        />
        {/* <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Calories"
          placeholderTextColor="#aaa"
          value={currentMeal.calories}
          keyboardType="numeric"
          onChangeText={(text) => setCurrentMeal({ ...currentMeal, calories: text })}
        /> */}
        {/* <TouchableOpacity style={styles.addButton} onPress={addMeal}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity> */}

        <IconButton name='add' onPress={addMeal} />
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
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item, index) => index.toString()}
      />

        <TouchableOpacity style={styles.saveButton} onPress={saveMealsAndGoBack}>
                <Text style={styles.buttonText}>Save Workout</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  targetNutritionContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#2b2b2b',
    borderRadius: 5,
  },
  totalNutritionContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#2b2b2b',
    borderRadius: 5,
  },
  targetTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  targetInfo: {
    fontSize: 14,
    color: '#fff',
  },
  totalInfo: {
    fontSize: 14,
    color: '#fff',
  },
  input: {
    backgroundColor: '#eee',
    color: '#333',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
  },
  largeInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  mealInfo: {
    flex: 1
  },

  mealDetails: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
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

  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default MealPlanScreen;

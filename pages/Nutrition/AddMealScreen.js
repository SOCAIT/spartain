import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image, Platform } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { COLORS } from '../../constants';
import axios from 'axios';
import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../helpers/AuthContext';
import { getTargetNutrition } from '../../helpers/useTargetNutrition';

// Using getTargetNutrition from useTargetNutrition helper

const AddMealScreen = ({ route, navigation }) => {
  const { day, existingMeal, updateMeal } = route.params;
  const { authState } = useContext(AuthContext);
  const [meals, setMeals] = useState(existingMeal || []);
  const [currentMeal, setCurrentMeal] = useState({ 
    name: '', 
    calories: '', 
    carbs: '', 
    proteins: '', 
    fats: '',
    recipe: '',
    description: ''
  });
  const [mealSearchResults, setMealSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const calculateTotalNutrition = () => {
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
  const targetNutrition = getTargetNutrition(authState.target_nutrition_data);

  const searchMeals = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`${backend_url}meal-search/?search=${query}`);
        setMealSearchResults(response.data.results);
        setIsModalVisible(true);
      } catch (error) {
        console.error('Error searching meals:', error);
        Alert.alert('Error', 'Failed to search meals');
      }
    } else {
      setMealSearchResults([]);
      setIsModalVisible(false);
    }
  };

  const addMeal = () => {
    if (!currentMeal.name || !currentMeal.calories) {
      Alert.alert('Error', 'Please select a meal from the search results');
      return;
    }

    setMeals(prevMeals => [...prevMeals, currentMeal]);
    setCurrentMeal({ 
      name: '', 
      calories: '', 
      carbs: '', 
      proteins: '', 
      fats: '',
      recipe: '',
      description: ''
    });
    setIsModalVisible(false);
  };

  const removeMeal = (index) => {
    Alert.alert(
      'Remove Meal',
      'Are you sure you want to remove this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setMeals(prevMeals => prevMeals.filter((_, i) => i !== index));
          }
        }
      ]
    );
  };

  const pressSearchItem = (item) => {
    setCurrentMeal({
      name: item.name,
      id: item.id,
      calories: item.calories || '0',
      carbs: item.carbs || '0',
      proteins: item.proteins || '0',
      fats: item.fats || '0',
      recipe: item.recipe || '',
      description: item.description || '',
      image: item.image
    });
    setIsModalVisible(false);
  };

  const renderMealItem = ({ item, index }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <View style={styles.nutritionInfo}>
        <Text style={styles.mealDetails}>Calories: {item.calories} kcal</Text>
          <Text style={styles.mealDetails}>Carbs: {item.carbs}g</Text>
          <Text style={styles.mealDetails}>Protein: {item.proteins}g</Text>
          <Text style={styles.mealDetails}>Fats: {item.fats}g</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => removeMeal(index)}
      >
        <MaterialIcons name="delete" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchMealItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.mealSearchItem} 
      onPress={() => pressSearchItem(item)}
    >
      <View style={styles.mealInfo}>
        <Text style={styles.searchMealName}>{item.name}</Text>
        <Text style={styles.searchMealDetails}>
          Calories: {item.calories} kcal | Carbs: {item.carbs}g | Protein: {item.proteins}g | Fats: {item.fats}g
        </Text>
      </View>
    </TouchableOpacity>
  );

  const saveMealsAndGoBack = () => {
    if (meals.length === 0) {
      Alert.alert('Error', 'Please add at least one meal');
      return;
    }
    updateMeal(day, meals);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={`Meal Plan for ${day}`} />

      <View style={styles.totalNutritionContainer}>
        <Text style={styles.totalTitle}>Total Nutrition for {day}</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.totalInfo}>Calories:</Text>
          <Text style={styles.totalValue}>{totalNutrition.calories} / {targetNutrition.calories} kcal</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.totalInfo}>Carbs:</Text>
          <Text style={styles.totalValue}>{totalNutrition.carbs} / {targetNutrition.carbs} g</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.totalInfo}>Proteins:</Text>
          <Text style={styles.totalValue}>{totalNutrition.proteins} / {targetNutrition.proteins} g</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.totalInfo}>Fats:</Text>
          <Text style={styles.totalValue}>{totalNutrition.fats} / {targetNutrition.fats} g</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for meals..."
          placeholderTextColor="#aaa"
          value={currentMeal.name}
          onChangeText={(text) => {
            setCurrentMeal(prev => ({ ...prev, name: text }));
            searchMeals(text);
          }}
        />
        <IconButton 
          name="add" 
          onPress={addMeal}
          style={styles.addButton}
          disabled={!currentMeal.name}
        />
      </View>

      {isModalVisible && (
        <View style={styles.modalContainer}>
          <FlatList
            data={mealSearchResults}
            renderItem={renderSearchMealItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.mealList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.mealList}
        contentContainerStyle={styles.mealListContent}
      />

      <TouchableOpacity 
        style={[styles.saveButton, isLoading && styles.disabledButton]} 
        onPress={saveMealsAndGoBack}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Saving...' : 'Save Meals'}
        </Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
  },
  totalNutritionContainer: {
    backgroundColor: COLORS.lightDark,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalInfo: {
    fontSize: 14,
    color: COLORS.white,
  },
  totalValue: {
    fontSize: 14,
    color: COLORS.darkOrange,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.lightDark,
    color: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    padding: 12,
  },
  modalContainer: {
    backgroundColor: COLORS.lightDark,
    borderRadius: 12,
    padding: 15,
    maxHeight: 300,
    position: 'absolute',
    left: 20,
    right: 20,
    top: 200,
    zIndex: 1000,
    elevation: 5,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightDark,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mealDetails: {
    fontSize: 12,
    color: COLORS.white,
    marginRight: 10,
    marginBottom: 2,
  },
  mealSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchMealName: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
    marginBottom: 4,
  },
  searchMealDetails: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.7,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 8,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealList: {
    flex: 1,
  },
  mealListContent: {
    paddingBottom: 20,
  },
});

export default AddMealScreen;

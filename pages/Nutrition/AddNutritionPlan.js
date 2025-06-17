import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import DaySelector from '../../components/DaySelector';
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';
import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const getTargetNutrition = (targetNutritionObj) => {
  const targetNutrition = {
    calories: targetNutritionObj.target_calories || 0,
    carbs: targetNutritionObj.target_carbs || 0,
    proteins: targetNutritionObj.target_protein || 0,
    fats: targetNutritionObj.target_fats || 0,
  };
  return targetNutrition;
};

const dayMapping = {
  "Mon": 0,
  "Tue": 1,
  "Wed": 2,
  "Thu": 3,
  "Fri": 4,
  "Sat": 5,
  "Sun": 6
};

const AddNutritionPlan = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [meals, setMeals] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
  const [planName, setPlanName] = useState("");
  const { authState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const targetNutrition = getTargetNutrition(authState.target_nutrition_data);

  const calculateTotalNutrition = () => {
    const mealsForDay = meals[selectedDay] || [];
    return mealsForDay.reduce((acc, meal) => {
      return {
        calories: acc.calories + (parseFloat(meal.calories) || 0),
        carbs: acc.carbs + (parseFloat(meal.carbs) || 0),
        proteins: acc.proteins + (parseFloat(meal.proteins) || 0),
        fats: acc.fats + (parseFloat(meal.fats) || 0),
      };
    }, { calories: 0, carbs: 0, proteins: 0, fats: 0 });
  };

  const totalNutrition = calculateTotalNutrition();

  const updateMeal = (day, meal) => {
    setMeals(prevMeals => ({
      ...prevMeals,
      [day]: meal,
    }));
  };

  const navigateToCreateMeal = (day) => {
    const existingMeal = meals[day];
    navigation.navigate('AddMealDayPlan', { 
      day, 
      existingMeal, 
      updateMeal,
    });
  };

  const transformMealsToGraphQLFormat = () => {
    const dailyMealPlans = [];
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    Object.entries(meals).forEach(([day, mealsByDay]) => {
      if (mealsByDay && mealsByDay.length > 0) {
        const formattedMeals = mealsByDay.map((meal, index) => ({
          meal: {
            name: meal.name,
            recipe: meal.recipe || "",
            description: meal.description || "",
            calories: parseFloat(meal.calories) || 0,
            proteins: parseFloat(meal.proteins) || 0,
            carbs: parseFloat(meal.carbs) || 0,
            fats: parseFloat(meal.fats) || 0,
          },
          sequence: index + 1
        }));

        dailyMealPlans.push({
          day: dayMapping[day],
          date: currentDate,
          dailymealplandetailSet: formattedMeals
        });
      }
    });

    return dailyMealPlans;
  };

  const saveNutritionPlan = async () => {
    if (!planName.trim()) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

    const allDaysHaveMeals = Object.keys(meals).every(day => meals[day].length > 0);
    if (!allDaysHaveMeals) {
      Alert.alert('Error', 'Please assign meals to all days');
      return;
    }

    setIsLoading(true);
    try {
      const dailyMealPlans = transformMealsToGraphQLFormat();
      const mutation = `
        mutation {
          createMealPlan(
            userId: ${authState.id},
            name: "${planName}",
            description: "Custom meal plan",
            startDate: "${new Date().toISOString().split('T')[0]}",
            endDate: "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}",
            goalType: "MG",
            dailyMealPlans: ${JSON.stringify(dailyMealPlans).replace(/"([^"]+)":/g, '$1:')}
          ) {
            weeklyMealPlan {
              id
              name
              description
            }
          }
        }
      `;

      const response = await axios.post(
        `${backend_url}graphql/`,
        { query: mutation }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      Alert.alert('Success', 'Nutrition plan created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      Alert.alert('Error', error.message || 'Failed to create nutrition plan');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMealItem = ({ item }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealItemContent}>
        <Text style={styles.dayLabel}>{item.day}</Text>
        <Text style={styles.mealText}>
          {item.dailyMeals.length > 0 ? `${item.dailyMeals.length} Meals Added` : 'No Meal Set'}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.editButton, !item.dailyMeals.length && styles.disabledButton]} 
        onPress={() => navigateToCreateMeal(item.day)}
        disabled={!item.dailyMeals.length}
      >
        <MaterialIcons name="edit" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  const mealListData = Object.keys(meals).map(day => ({ 
    day, 
    dailyMeals: meals[day] 
  }));

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="Create Nutrition Plan" />

      <TextInput
        style={styles.input}
        placeholder="Nutrition Plan Name"
        placeholderTextColor="#aaa"
        value={planName}
        onChangeText={setPlanName}
      />

      <View style={styles.totalNutritionContainer}>
        <Text style={styles.totalTitle}>Total Nutrition for {selectedDay || 'Select a day'}</Text>
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

      <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      <TouchableOpacity 
        style={[styles.addMealButton, !selectedDay && styles.disabledButton]} 
        onPress={() => selectedDay && navigateToCreateMeal(selectedDay)}
        disabled={!selectedDay}
      >
        <Text style={styles.buttonText}>Add Meal for {selectedDay || 'Select a day'}</Text>
      </TouchableOpacity>

      <FlatList
        data={mealListData}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.day}
        style={styles.mealList}
      />

      <TouchableOpacity 
        style={[styles.saveButton, isLoading && styles.disabledButton]} 
        onPress={saveNutritionPlan}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Saving...' : 'Save Nutrition Plan'}
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
  input: {
    backgroundColor: COLORS.lightDark,
    color: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
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
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightDark,
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  mealItemContent: {
    flex: 1,
  },
  dayLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  mealText: {
    color: COLORS.white,
    fontSize: 14,
  },
  editButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addMealButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealList: {
    flex: 1,
  },
});

export default AddNutritionPlan;

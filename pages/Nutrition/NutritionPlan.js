import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,  Image, Alert, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Dropdown from '../../components/Dropdown';
import IconHeader from '../../components/IconHeader';
import { COLORS } from '../../constants';
import { AuthContext } from '../../helpers/AuthContext';
import { getTargetNutrition } from '../../helpers/useTargetNutrition';
import axios from 'axios';
import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
import PlanDropdown from '../../components/PlanDropdown';
import CustomCarousel from '../../components/CustomCarousel';
import CardOverlay from '../../components/workouts/CardOverlay';
import MealCardOverlay from '../../components/nutrition/meals/MealCardOverlay';
import NutritionPlanDropdown from '../../components/NutritionPlanDropdown';
import SearchInput from '../../components/inputs/SearchInput';
import { set } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import OptionModal from '../../components/buttons/OptionModal';
import NutritionSummary from '../../components/nutrition/NutritionSummary';
import DaySelector from '../../components/DaySelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Removed local getTargetNutrition function - now using the one from useTargetNutrition helper

const NutritionPlan = ({ navigation, route }) => {
  // Initialize selectedDay to today's day
  const getCurrentDay = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    // Convert Sunday (0) to 6, and shift other days back by 1 to match our array
    const dayIndex = today === 0 ? 6 : today - 1;
    return days[dayIndex];
  };
  
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const { authState } = useContext(AuthContext);
  const [nutritionPlansData, setNutritionPlansData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetNutrition, setTargetNutrition] = useState(getTargetNutrition(authState.target_nutrition_data));

  const [mealSearchResults, setMealSearchResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const options = [
    {iconType: 'Ionicons', iconName: 'add-circle-outline', label: 'Add plan', onPress: () => navigation.navigate('AddModifyPlan') },
    { iconType: 'MaterialCommunityIcons',iconName: 'file-edit-outline', label: 'Update current plan',onPress:() => navigation.navigate('AddModifyPlan', { nutritionPlan: selectedPlan })},

    // TODO: add AI nutrition plan screen later
    //{ iconType: 'MaterialCommunityIcons',iconName: 'brain', label: 'ask AI for plan', onPress: () => navigation.navigate('AINutritionPlan') },
  ];

  // NEW: State for current nutrition (starts at 0 for a new day)
  const [currentNutrition, setCurrentNutrition] = useState({
    calories: 0,
    carbs: 0,
    proteins: 0,
    fats: 0,
  });
 
  // // NEW: Target nutrition values (could be dynamic)
  // const targetNutrition = {
  //   calories: 2558,
  //   carbs: 263,
  //   proteins: 185,
  //   fats: 85,
  // };

  
  const graphqlUserNutritionPlans = {
    query: `
      query {
        userWeeklyMealPlans(userId: ${authState.id}) {
          id
          name
          dailymealplanSet {
            day
            id
            dailymealplandetailSet {
              meal {
                id
                name
                carbs
                fats
                proteins
                recipe
                steps
                description
                calories
              }
            }
          }
        }
      }
    `
  }; 0

  const dummy_meals = [
    {
      name: 'Vegetables & Meat',
      image:  require('../../assets/images/oat.webp') ,
      description: 'Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time:7,
      nutrition: { carbs: 101, proteins: 24, fats: 12, sugars: 21, calories: 700 }},
      {
        name: 'Vegetables & Meat 2',
        image:  require('../../assets/images/oat.webp') ,
        description: 'Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        time:7,
        nutrition: { carbs: 101, proteins: 24, fats: 12, sugars: 21, calories: 700 }
      },
      {
        name: 'Vegetables & Meat 2',
        image:  require('../../assets/images/oat.webp') ,
        description: 'Instructions: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        time:7,
        nutrition: { carbs: 101, proteins: 24, fats: 12, sugars: 21,}
      }, 
    
  ]

  const renderMealCard = (meal, navigation) => {
      //console.log("render meal")
      return (
         <MealCardOverlay  meal={meal} navigation={navigation} onAddMeal={handleAddMeal} />
      )
  }

  // Add meal to daily intake handler
  const handleAddMeal = async (meal) => {
    try {
      const macros = {
        calories: parseFloat(meal.calories) || 0,
        carbs: parseFloat(meal.carbs) || 0,
        proteins: parseFloat(meal.proteins) || 0,
        fats: parseFloat(meal.fats) || 0,
      };
      setCurrentNutrition(prev => ({
        calories: prev.calories + macros.calories,
        carbs: prev.carbs + macros.carbs,
        proteins: prev.proteins + macros.proteins,
        fats: prev.fats + macros.fats,
      }));

      const todayStr = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(
        '@currentNutrition',
        JSON.stringify({ date: todayStr, nutrition: {
          calories: currentNutrition.calories + macros.calories,
          carbs: currentNutrition.carbs + macros.carbs,
          proteins: currentNutrition.proteins + macros.proteins,
          fats: currentNutrition.fats + macros.fats,
        }}),
      );
      Alert.alert('Added', 'Meal added to today\'s nutrition diary!');
    } catch (err) {
      console.error('Error adding meal', err);
      Alert.alert('Error', 'Could not add meal.');
    }
  };

  // Reset current nutrition to zero
  const resetCurrentNutrition = () => {
    Alert.alert(
      'Reset Nutrition',
      "Are you sure you want to reset today's nutrition data? This cannot be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: async () => {
            try {
              const zero = { calories: 0, carbs: 0, proteins: 0, fats: 0 };
              setCurrentNutrition(zero);
              const todayStr = new Date().toISOString().split('T')[0];
              await AsyncStorage.setItem(
                '@currentNutrition',
                JSON.stringify({ date: todayStr, nutrition: zero })
              );
              Alert.alert('Reset', "Today's nutrition has been reset.");
            } catch (err) {
              console.error('Error resetting nutrition', err);
              Alert.alert('Error', 'Could not reset nutrition.');
            }
        } },
      ]
    );
  };
 
  const fetchNutritionPlans = async (dayToSelect = selectedDay) => {
    try {
      const response = await axios.post(`${backend_url}graphql/`, graphqlUserNutritionPlans);
      //console.log(response.data.data.userWeeklyMealPlans)

      const plans = response.data.data.userWeeklyMealPlans.map((obj) => ({
        label: obj.name,
        value: obj.id,
        dailymealplanSet: obj.dailymealplanSet,
      }));

      console.log(nutritionPlansData)

      setNutritionPlansData(plans);
      setIsLoading(false);
      setIsRefreshing(false);

      if (plans.length > 0) {
        setSelectedPlan(plans[0]);
        console.log("rer0")
        // console.log(plans[0].dailymealplanSet)

        // Use the currently selected day instead of hardcoding Monday
        const currentDayIndex = daysOfWeek.indexOf(dayToSelect);
        setSelectedMealPlan(plans[0].dailymealplanSet.find(plan => plan.day === currentDayIndex));
      }
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      setIsLoading(false);
      setIsRefreshing(false);
      Alert.alert('Error', 'Failed to load nutrition plans.');
    }
  };
 
  useEffect(() => {
    fetchNutritionPlans(selectedDay);
    
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNutritionPlans(selectedDay);
  };

  useEffect(() => {
    console.log("useEffect triggered - selectedDay:", selectedDay)
    console.log("selectedPlan:", selectedPlan)
    console.log("daysOfWeek.indexOf(selectedDay):", daysOfWeek.indexOf(selectedDay))
    if (selectedPlan && nutritionPlansData.length > 0) {
      const currentPlan = nutritionPlansData.find(plan => plan.value === selectedPlan);
      console.log("Current Plan:", currentPlan);
      if (currentPlan) {
        const dayIndex = daysOfWeek.indexOf(selectedDay);
        console.log("Looking for day index:", dayIndex);
        console.log("Available days in plan:", currentPlan.dailymealplanSet.map(p => p.day));
        const mealForDay = currentPlan.dailymealplanSet.find(mealPlanDay => parseInt(mealPlanDay.day, 10) === dayIndex);
        setSelectedMealPlan(mealForDay);
        console.log("Meal for Selected Day:", mealForDay);
      }
    } 
  }, [selectedPlan, selectedDay, nutritionPlansData]);

  // NEW: Update currentNutrition when returning from MealInputScreen
  const appliedUpdateRef = useRef(false);
  useFocusEffect(
    React.useCallback(() => {
      if (route.params && route.params.updatedNutrition) {
        const update = route.params.updatedNutrition;
        const add = {
          calories: parseFloat(update.calories) || 0,
          carbs: parseFloat(update.carbs) || 0,
          proteins: parseFloat(update.proteins) || 0,
          fats: parseFloat(update.fats) || 0,
        };
        setCurrentNutrition(prev => ({
          calories: prev.calories + add.calories,
          carbs: prev.carbs + add.carbs,
          proteins: prev.proteins + add.proteins,
          fats: prev.fats + add.fats,
        }));
        // Mark that we applied an update so the other focus effect
        // will skip reloading storage once this cycle.
        appliedUpdateRef.current = true;
        navigation.setParams({ updatedNutrition: null });
      }
    }, [route.params])
  );

  
  // Helper to get today's date as a string in YYYY-MM-DD format
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper to load nutrition from storage and reset if new day
  const loadNutritionData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@currentNutrition');
        const todayStr = getTodayString();
        if (storedData) {
          const parsed = JSON.parse(storedData);
          // If the stored date is today, load the nutrition values
          if (parsed.date === todayStr) {
            setCurrentNutrition(parsed.nutrition);
          } else {
            // New day: Reset nutrition data to 0 and update storage
            const resetNutrition = { calories: 0, carbs: 0, proteins: 0, fats: 0 };
            setCurrentNutrition(resetNutrition);
            await AsyncStorage.setItem('@currentNutrition', JSON.stringify({ date: todayStr, nutrition: resetNutrition }));
          }
        } else {
          // No stored data yet, initialize it for today
          const resetNutrition = { calories: 0, carbs: 0, proteins: 0, fats: 0 };
          setCurrentNutrition(resetNutrition);
          await AsyncStorage.setItem('@currentNutrition', JSON.stringify({ date: todayStr, nutrition: resetNutrition }));
        }
      } catch (error) {
        console.error('Error loading nutrition data:', error);
        Alert.alert('Error', 'Could not load nutrition data.');
      }
    };

  // initial load
  useEffect(() => {
    loadNutritionData();
  }, []);

  // reload when screen gains focus (e.g., after Chatbot adds nutrition)
  useFocusEffect(
    useCallback(() => {
      // If we're returning with an update payload, let the other focus handler
      // apply it first to state and storage, and skip reloading to avoid
      // overwriting the in-memory addition with stale storage.
      if (route.params?.updatedNutrition) {
        return;
      }
      // If we just applied an update this focus cycle, skip one reload
      if (appliedUpdateRef.current) {
        appliedUpdateRef.current = false;
        return;
      }
      loadNutritionData();
    }, [route.params?.updatedNutrition]),
  );

  // Save nutrition data whenever currentNutrition state changes
  useEffect(() => {
    const saveNutritionData = async () => {
      const todayStr = getTodayString();
      try {
        await AsyncStorage.setItem('@currentNutrition', JSON.stringify({ date: todayStr, nutrition: currentNutrition }));
      } catch (error) {
        console.error('Error saving nutrition data:', error);
        Alert.alert('Error', 'Could not save nutrition data.');
      }
    };

    saveNutritionData();
  }, [currentNutrition]);
  const handleDayChange = (day) => {
    setSelectedDay(day);
    // Convert the selected day to the corresponding day of the week (0-6)
    const dayIndex = daysOfWeek.indexOf(day);
    
    if (selectedPlan && nutritionPlansData.length > 0) {
      const currentPlan = nutritionPlansData.find(plan => plan.value === selectedPlan);
      if (currentPlan) {
        const mealForDay = currentPlan.dailymealplanSet.find(mealPlanDay => parseInt(mealPlanDay.day, 10) === dayIndex);
        setSelectedMealPlan(mealForDay);
      }
    }
  };

  const handlePlanChange = (planValue) => {
    setSelectedPlan(planValue);
    


    console.log("Plan Selected:", planValue);
    setSelectedPlan(planValue); // Update selected plan
    const currentPlan = nutritionPlansData.find(plan => plan.value === planValue);
    console.log(currentPlan)
    if (currentPlan) {
      const mealPlanForDay = currentPlan.dailymealplanSet.find(p => p.day === daysOfWeek.indexOf(selectedDay));
      setSelectedMealPlan(mealPlanForDay);

      console.log("rer" + mealPlanForDay)
      console.log("Nutrition for Selected Day after Plan Change:", mealPlanForDay);
    }
  };

  const handleDeletePlan = (deletedPlanId) => {
    // Refresh the plans after deletion
    fetchNutritionPlans(selectedDay);
  };

  // Add debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length <= 2) {
        setMealSearchResults([]);
        return;
      }
      axios.get(`${backend_url}meal-search/`, { params: { search: query } })
        .then(({ data }) => setMealSearchResults(data.results))
        .catch((error) => {
          console.error('Search error:', error);
          Alert.alert('Error', 'Failed to search meals. Please try again.');
        });
    }, 300),
    []
  );

  const searchMeals = (query) => {
    debouncedSearch(query);
  };

  const pressSearchItem = (item) => {
    navigation.navigate("MealView", { meal: item });
    setMealSearchResults([]);
    

  }

  const renderSearchMealItem = ({ item }) => (
      <TouchableOpacity style={styles.mealSearchItem} onPress={() => pressSearchItem(item)}>
        <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={{ color: "#fff" }}>{item.name}</Text>
          <Text style={{ color: "#fff" }}>Calories: {item.calories} kcal</Text>
        </View>
      </TouchableOpacity>
    );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SearchInput 
          placeholder="Search meals" 
          search={searchMeals} 
          results={mealSearchResults}
          onSelect={pressSearchItem} 
          renderSearchResultItem={renderSearchMealItem} 
          categories={["Meals"]}
        />

        <NutritionSummary 
          targetNutrition={targetNutrition} 
          currentNutrition={currentNutrition} 
          navigation={navigation}
          onReset={resetCurrentNutrition}
        />

        <DaySelector selectedDay={selectedDay} onDaySelect={handleDayChange} />

        <Text style={styles.mealsTitle}>Your Nutrition Plans</Text>
        <View style={{ flexDirection: "row", padding: 10, alignItems:'center' }}>
          {isLoading ? (
            <Text style={{color: "#fff"}}>Loading nutrition plans...</Text>
          ) : nutritionPlansData.length > 0 ? (
            <NutritionPlanDropdown 
              label={"Change Nutrition Plan"} 
              data={nutritionPlansData} 
              onSelect={handlePlanChange}
              onDelete={handleDeletePlan}
            />
          ) : (
            <Text style={{color: "#fff", marginRight:10}}>No Nutrition Plans yet</Text>
          )}     
          <IconButton name='add' onPress={() => setModalVisible(true)} />
          <IconButton name='refresh' onPress={handleRefresh} disabled={isRefreshing} />
        </View>

        <Text style={styles.mealsTitle}>Your Meals</Text>
        {selectedMealPlan?.dailymealplandetailSet && selectedMealPlan.dailymealplandetailSet.length > 0 ? (
          <CustomCarousel 
            items={selectedMealPlan.dailymealplandetailSet} 
            renderItem={renderMealCard} 
            navigation={navigation}
          />
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>
              No meals planned for {selectedDay}
            </Text>
          </View>
        )}

        <OptionModal
          isVisible={modalVisible}
          options={options}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: COLORS.dark,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nutritionSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    alignContent: 'left', 
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16
  },
  dayButton: {
    padding: 10,
    borderRadius: 10,
  },
  nutritionContainer: {
    backgroundColor: COLORS.lightDark, //'#6ab04c',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    //alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  nutritionSummary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nutritionValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#fff',
  },
  nutritionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  nutritionDetailItem: {
    alignItems: 'center',
  },
  nutritionDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  nutritionDetailLabel: {
    fontSize: 14,
    color: '#fff',
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
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
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bottomButton: {
    backgroundColor: '#6ab04c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  updateNutritionButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  updatedNutritionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default NutritionPlan;

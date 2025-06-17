import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,  Image, Alert, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Dropdown from '../../components/Dropdown';
import IconHeader from '../../components/IconHeader';
import { COLORS } from '../../constants';
import { AuthContext } from '../../helpers/AuthContext';
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

const getTargetNutrition = (targetNutritionObj) => {

  const targetNutrition = {
    calories: targetNutritionObj.target_calories || 0 ,
    carbs: targetNutritionObj.target_carbs || 0,
    proteins: targetNutritionObj.target_protein || 0,
    fats: targetNutritionObj.target_fats || 0,
  };
  return targetNutrition;
}

const NutritionPlan = ({ navigation, route }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const { authState } = useContext(AuthContext);
  const [nutritionPlansData, setNutritionPlansData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetNutrition, setTargetNutrition] = useState(getTargetNutrition(authState.target_nutrition_data));

  const [mealSearchResults, setMealSearchResults] = useState([]);

  const options = [
    {iconType: 'Ionicons', iconName: 'add-circle-outline', label: 'Add plan', onPress: () => navigation.navigate('AddModifyPlan') },
    // { iconType: 'MaterialCommunityIcons',iconName: 'file-edit-outline', label: 'Update current plan',onPress:() => navigation.navigate('UpdateWorkoutPlan', { workoutPlan: selectedWorkoutPlan })},

    { iconType: 'MaterialCommunityIcons',iconName: 'brain', label: 'ask AI for plan', onPress: () => navigation.navigate('AINutritionPlan') },
    // { iconType: 'Ionicons',iconName: 'information-circle-outline', label: 'Tips', onPress: () => navigation.navigate('TipsScreen') },
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
      return (
         <MealCardOverlay  meal={meal} navigation={navigation}/>
      )
  }
 
  const fetchNutritionPlans = async () => {
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
      setIsLoading(false)

      if (plans.length > 0) {
        setSelectedPlan(plans[0]);
        console.log("rer0")
        // console.log(plans[0].dailymealplanSet)


        setSelectedMealPlan(plans[0].dailymealplanSet.find(plan => plan.day === daysOfWeek.indexOf('Mon')));
      }
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      Alert.alert('Error', 'Failed to load nutrition plans.');
    }
  };
 
  useEffect(() => {
    fetchNutritionPlans();
    
  }, []);

  useEffect(() => {
    console.log("selected")
    console.log(selectedPlan)
    if (selectedPlan && nutritionPlansData.length > 0) {
      const currentPlan = nutritionPlansData.find(plan => plan.value === selectedPlan);
      console.log("Current Plan:", currentPlan);
      if (currentPlan) {
        const mealForDay = currentPlan.dailymealplanSet.find(mealPlanDay => parseInt(mealPlanDay.day, 10) === daysOfWeek.indexOf(selectedDay));
        setSelectedMealPlan(mealForDay);
        console.log("Meql for Selected Day:", mealForDay);
      }
    } 
  }, [selectedPlan, selectedDay, nutritionPlansData]);

  // NEW: Update currentNutrition when returning from MealInputScreen
  useFocusEffect(
    React.useCallback(() => {
      if (route.params && route.params.updatedNutrition) {
        const update = route.params.updatedNutrition;
        setCurrentNutrition(prev => ({
          calories: prev.calories + (update.calories || 0),
          carbs: prev.carbs + (update.carbs || 0),
          proteins: prev.proteins + (update.proteins || 0),
          fats: prev.fats + (update.fats || 0),
        }));
        navigation.setParams({ updatedNutrition: null });
      }
    }, [route.params])
  );

  
  // Helper to get today's date as a string in YYYY-MM-DD format
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Load stored nutrition data, and reset if a new day has started
  useEffect(() => {
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

    loadNutritionData();
  }, []);

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
            />
          ) : (
            <Text style={{color: "#fff", marginRight:10}}>No Nutrition Plans yet</Text>
          )}     
          <IconButton name='add' onPress={() => setModalVisible(true)} />
        </View>

        <Text style={styles.mealsTitle}>Your Meals</Text>
        <CustomCarousel 
          items={selectedMealPlan?.dailymealplandetailSet} 
          renderItem={renderMealCard} 
          navigation={navigation}
        />

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

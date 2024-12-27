import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
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

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const NutritionPlan = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const { authState } = useContext(AuthContext);
  const [nutritionPlansData, setNutritionPlansData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  
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

  const handleDayChange = (day) => {
    setSelectedDay(day);
    // const mealPlanForDay = nutritionPlansData?.dailymealplanSet?.find(plan => plan.day === daysOfWeek.indexOf(day));
    // setSelectedMealPlan(mealPlanForDay);
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

  const renderMeal = (item) => (
    <TouchableOpacity key={item.meal.id} style={styles.mealCard} onPress={() => navigation.navigate("MealView", { meal: item.meal })}>
      <Image   source={item.meal.image ? { uri: item.meal.image } : 
      ( item.meal.name==='Chicken Quinoa Salad' ? require('../../assets/images/chicken_quinoa.png'): require('../../assets/images/oat.webp'))}  
      style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.meal.name}</Text>
        <Text style={styles.mealDetails}>Calories: {item.meal.calories} kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <IconHeader />

      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionSummary}>
          <Text style={styles.nutritionValue}>{selectedMealPlan?.dailymealplandetailSet.reduce((sum, item) => sum + item.meal.calories, 0) || 0}</Text>
          <Text style={styles.nutritionLabel}>CALORIES</Text>
        </View>
        <View style={styles.nutritionDetails}>
          <View style={styles.nutritionDetailItem}>
            <Text style={styles.nutritionDetailValue}>{selectedMealPlan?.dailymealplandetailSet.reduce((sum, item) => sum + parseFloat(item.meal.carbs), 0) || 0} g</Text>
            <Text style={styles.nutritionDetailLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionDetailItem}>
            <Text style={styles.nutritionDetailValue}>{selectedMealPlan?.dailymealplandetailSet.reduce((sum, item) => sum + parseFloat(item.meal.proteins), 0) || 0} g</Text>
            <Text style={styles.nutritionDetailLabel}>Proteins</Text>
          </View>
          <View style={styles.nutritionDetailItem}>
            <Text style={styles.nutritionDetailValue}>{selectedMealPlan?.dailymealplandetailSet.reduce((sum, item) => sum + parseFloat(item.meal.fats), 0) || 0} g</Text>
            <Text style={styles.nutritionDetailLabel}>Fats</Text>
          </View>
        </View>
      </View>

      <Text style={styles.mealsTitle}>Your Nutrition Plans</Text>
      <View style={{ flexDirection: "row", padding: 10, alignItems:'center' }}>
        {isLoading ?

         <Text style={{color: "#fff"}}>Loading nutritiont plans...</Text>
        : 
         nutritionPlansData.length > 0 ? (
          <NutritionPlanDropdown label={"Change Nutrition Plan"} data={nutritionPlansData} onSelect={handlePlanChange} /> 
         ) : (
          <Text style={{color: "#fff", marginRight:10}}>No Nutrition Plans yet</Text>
         )    
         }     
         <IconButton name='add' onPress={() => navigation.navigate('AddModifyPlan')} />

      </View>

       
      <View style={styles.daySelector}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDayChange(day)}
            style={[
              styles.dayButton,
              { backgroundColor: selectedDay === day ? 'lightblue' : 'white' },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      

      {/* <View style={{ flexDirection: "row", padding: 10, alignItems:'center' }}>
        {nutritionPlansData.length > 0 ? (
          <PlanDropdown label={"Change Nutrition Plan"} data={nutritionPlansData} onSelect={handlePlanChange} />
        ) : (
          // <Text style={{color: "#fff"}}>Loading nutritiont plans...</Text>
          <Text style={{color: "#fff", marginRight:10}}>No Nutrition Plans yet</Text>
        )}
        <IconButton name='add' onPress={() => navigation.navigate('AddModifyPlan')} />
      </View> */}

      <Text style={styles.mealsTitle}>Your Meals</Text>
      {/* {selectedMealPlan?.dailymealplandetailSet.map(renderMeal)} */}

      <CustomCarousel items={selectedMealPlan?.dailymealplandetailSet} renderItem={renderMealCard}/>
      {/* <CustomCarousel items={dummy_meals} renderItem={renderMealCard}/> */}


      {/* <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Meal Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Recipes</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.dark,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
    alignItems: 'center',
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
});

export default NutritionPlan;

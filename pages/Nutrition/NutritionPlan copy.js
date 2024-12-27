// WorkoutPlanScreen.js
import React, { useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, Button } from 'react-native';
import Dropdown from '../../components/Dropdown';
import IconHeader from '../../components/IconHeader';
import WorkoutCard from '../../components/workouts/WokroutCard';
import { COLORS } from '../../constants';

import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';

import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
import NutritionCard from '../../components/nutrition/NutritionCard';

import Icon from 'react-native-vector-icons/MaterialIcons';


const meals = [
  {
    id: '1',
    name: 'Vegan scramble with tomatoes',
    image: 'https://via.placeholder.com/150',
    time: '15 mins',
    calories: '254 kcal',
  },
  {
    id: '2',
    name: 'Banana pancake',
    image: 'https://via.placeholder.com/150',
    time: '10 mins',
    calories: '312 kcal',
  },
];
const workout_data = [
  {
    "day": "0",
    "exerciselogSet": [
      {
        "exercise": {
          "id": "99",
          "name": "barbell bench press"
        },
        "sets": 4,
        "reps": 5,
        "restTime": "2-3min"
      },
      {
        "exercise": {
          "id": "102",
          "name": "barbell bent over row"
        },
        "sets": 4,
        "reps": 5,
        "restTime": "2-3min"
      },
      {
        "exercise": {
          "id": "102",
          "name": "barbell bent over row"
        },
        "sets": 3,
        "reps": 12,
        "restTime": "2-3min"
      }
    ]
  },
  {
    "day": "1",
    "exerciselogSet": [
      {
        "exercise": {
          "id": "123",
          "name": "barbell full squat (side pov)"
        },
        "sets": 4,
        "reps": 5,
        "restTime": "2-3min"
      },
      {
        "exercise": {
          "id": "125",
          "name": "barbell glute bridge"
        },
        "sets": 4,
        "reps": 5,
        "restTime": "2-3min"
      }
    ]
  }

]
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


const dummy_meal_day = 

{ day: 'Mon', value: '1',dailymealplandetailSet:[ {meal: {
    name: "Oatmeal with Protein Powder",
    recipe: "Mix rolled oats with water or almond milk, cook until creamy. Add a scoop of protein powder, top with banana slices and a tablespoon of almond butter.",
    description: "High-protein oatmeal breakfast.",
    calories: 600,
    carbs: "60.00",
    fats: "15.00",
    proteins: "30.00"
  }},
]}

const NutritionPlan = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Mon');

  const {authState} = useContext(AuthContext)
  const [workout_plans_data, setWorkoutPlansData] = useState([  { label: 'Your Nutrition Plan', value: '1',dailymealplanSet:[dummy_meal_day]},])
  const [workouts_data, setWorkoutsData] = useState([dummy_meal_day])


  const workoutPlan = {}; // Fetch the user's workout plan for the selected day

  const [selected, setSelected] = useState( { name: 'Your Nutrition Plan', value: '1',dailymealplanSet:[dummy_meal_day]});
  const [ selectedWorkout, setSelectedWorkout] = useState(dummy_meal_day)
  const data = [
    { label: 'Muscle Gain #1', value: '1' },
    { label: 'Cut #1', value: '2' },
    // { label: 'Three', value: '3' },
    // { label: 'Four', value: '4' },
    // { label: 'Five', value: '5' },
  ];

  const graphql_user_nutrition_plans = { query: " \
      query { \ " +
        "userWeeklyMealPlans(userId:" + authState.id+ ") { \
          id \
          name \
          dailymealplanSet {\
            day\
            id\
            dailymealplandetailSet {\
            meal{\
              id \
              name \
              carbs\
              fats\
              proteins\
              recipe\
              description\
             }\
            } \
          } \
        }\
      }\
"
    }


  const fetchWorkouts = () => {
    console.log("here")
    axios.post(backend_url + "graphql/",
          graphql_user_nutrition_plans,
          // {headers : {'Authorization': 'Bearer '+ token}}
     //{headers : {'Authorization': 'Bearer '+ token}}
          ).then((response) =>{
          console.log("GraphQL", response.data.data.userWeeklyMealPlans)

          let plans = response.data.data.userWeeklyMealPlans.map((obj)=> (
             {
              label: obj.name,
              value: obj.id,
              workoutSet: obj.dailymealplanSet
             }
          ))

          let workouts = response.data.data.userWeeklyMealPlans[0].dailymealplanSet //.dailymealplandetailSet
          // // console.log(workouts[0])
 
          // // console.log(workouts[0].exerciselogSet)
          console.log(plans)
          console.log("HEREE")
          console.log(workouts)
      
          setWorkoutPlansData(plans);
          setSelectedWorkout(workouts[0])
          //setLikedPosts(response.data.likedPosts);
        }); 
   
  }   
 
  useEffect(()=>{
       fetchWorkouts()
      //  console.log(workout_plans_data)
      //  console.log(selectedWorkout)
  }, [])
   
  const handleDayChange = (day) => {
    setSelectedDay(day);
    setSelectedWorkout(workout_plans_data[0].workoutSet[daysOfWeek.indexOf(day)])
    // Fetch the workout plan for the selected day
  };
  
  const nutritionSummary = {
    calories: 1750,
    carbs: 104,
    proteins: 290,
    fats: 104,
  };

  const renderMeal = ({ item }) => (
    <View style={styles.mealCard}>
      <Image source={{ uri: item.image }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealDetails}>{item.time} - {item.calories}</Text>
      </View>
      {/* <Ionicons name="ios-checkmark-circle" size={24} color="#6ab04c" /> */}
    </View>
  );

   
  return (
    
    // // <View style={styles.container}>
    //   {/* <Text style={styles.title}>Workout Plan</Text> */}
    //   {/* <IconHeader />  */}
    <ScrollView contentContainerStyle={styles.container}>
      <IconHeader />
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

      {/* <NutritionCard workout={selectedWorkout} navigation={navigation} /> */}

      {/* <ScrollView contentContainerStyle={styles.mainContainer}> */}
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionSummary}>
          <Text style={styles.nutritionValue}>{nutritionSummary.calories}</Text>
          <Text style={styles.nutritionLabel}>CALORIES</Text>
        </View>
        <View style={styles.nutritionDetails}>
          <View style={styles.nutritionDetailItem}>
            <Text style={styles.nutritionDetailValue}>{nutritionSummary.carbs} g</Text>
            <Text style={styles.nutritionDetailLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionDetailItem}>
            <Text style={styles.nutritionDetailValue}>{nutritionSummary.proteins} g</Text>
            <Text style={styles.nutritionDetailLabel}>Proteins</Text>
          </View>
          <View style={styles.nutritionDetailItem}>
            <Text style={styles.nutritionDetailValue}>{nutritionSummary.fats} g</Text>
            <Text style={styles.nutritionDetailLabel}>Fats</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection: "row", padding:10}}>
        <Dropdown label={"change workout plan"} data={workout_plans_data} onSelect={setSelected} />

        <IconButton name='add' onPress={() => navigation.navigate('AddModifyPlan')}  />
      </View>
      {/* <TouchableOpacity style={styles.planButton}>
        <Text style={styles.planButtonText}>Balanced diet</Text>
        {/* <Ionicons name="ios-arrow-forward" size={20} color="#000" />
      </TouchableOpacity> */}
      <Text style={styles.mealsTitle}>Your meals</Text>
      { dummy_meal_day.dailymealplandetailSet.map((item) => (
          <TouchableOpacity key={item.meal.id} style={styles.mealCard} onPress={() => navigation.navigate("MealView")}>
            <Image source={{ uri: item.meal.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{item.meal.name}</Text>
              <Text style={styles.mealDetails}>{item.time} - {item.meal.calories}</Text>
            </View>
            {/* <Ionicons name="ios-checkmark-circle" size={24} color="#6ab04c" /> */}
          </TouchableOpacity>
        ))}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Meal plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Recipes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.exerciseList}>
        {/* Display workout plan for the selected day */}
        {/* You can map over workoutPlan[selectedDay] and display exercise details */}
      </View>

     
  </ScrollView>

    
  // </View>
  ) 
};  

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    //paddingHorizontal: 16,
    backgroundColor: COLORS.dark
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
    marginBottom: 16,
  },
  dayButton: {
    padding: 10,
    borderRadius: 10,
  },
  exerciseList: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
    // Add styling for displaying exercises here
  },
  addButton: {
    color: 'blue',
    fontSize: 16,
  },



  ///////////

  // mainContainer: {
  //   flexGrow: 1,
  // },

  nutritionContainer: {
    backgroundColor: '#6ab04c',
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
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  planButtonText: {
    fontSize: 16,
    color: '#000',
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  mealsList: {
    paddingHorizontal: 20,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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

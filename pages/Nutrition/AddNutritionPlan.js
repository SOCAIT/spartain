import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import DaySelector from '../../components/DaySelector';
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';
import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const USER = {
  username: "Lelouch",
  id: 0,
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
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [meals, setMeals] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
  const [planName, setPlanName] = useState("");
  const [targetNutrition, setTargetNutrition] = useState({ calories: 0, carbs: 0, proteins: 0, fats: 0 });
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState(USER);

  
  useEffect(() => {
    setUser(prevUser => ({
      ...prevUser,
      username: authState.username,
      id: authState.id,
    }));

  }, []);

  useEffect(() => {
    // Fetch target nutritional info from backend when the screen loads
    const fetchTargetNutrition = async () => {
      try {
        const response = await axios.get(`${backend_url}get-target-nutrition/${user.id}`);
        setTargetNutrition(response.data);
      } catch (error) {
        console.error("Failed to fetch target nutrition", error);
      }
    };
    fetchTargetNutrition();
  }, [user.id]);

  // useEffect(() => {
  //   const workoutForDay = meals.find(workout => workout.day === selectedDay);
  //   setSelectedWorkout(w);
  // }, [selectedWorkout, selectedDay, workouts]);

   


  // Function to calculate total nutritional values for the selected day
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

    // const existingWorkout = workouts[selectedDay];
    console.log("day")
    console.log(day)
    console.log(meal)

    console.log(meals)

    


    setMeals(prevMeals => ({
      ...prevMeals,
      [day]: meal, //[...prevMeals[day], meal],
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

  // Function to transform the meals object to GraphQL mutation format
const transformMealsToGraphQLFormat = () => {
  let dailyMealPlans = [];

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];  // Gets the date in YYYY-MM-DD format
  console.log(currentDate);


  Object.keys(meals).forEach(day => {
    const mealsByDay = meals[day];
    if (mealsByDay.length > 0) {
      // For each day, create the meals array in the required format
      const formattedMeals = mealsByDay.map((meal, index) => ({
        name: meal.name,
        recipe: meal.recipe,
        description: meal.description,
        calories: parseFloat(meal.calories),
        proteins: parseFloat(meal.proteins),
        carbs: parseFloat(meal.carbs),
        fats: parseFloat(meal.fats),
        sequence: index + 1,  // Sequence in the meal plan for the day
        day: day // Day in lowercase format
      }));

      // Add this day with formatted meals to the dailyMealPlans array
      dailyMealPlans.push({
        day: dayMapping[day], // Use the integer mapping for the day
        date: currentDate, // Example date for each day
        meals: formattedMeals
      });
    }
  });

  return dailyMealPlans;
};

// Convert JSON to a GraphQL-compatible format
const jsonToGraphQL = (data) => {
  if (Array.isArray(data)) {
    return `[${data.map(jsonToGraphQL).join(", ")}]`;
  } else if (typeof data === "object" && data !== null) {
    return `{${Object.entries(data)
      .map(([key, value]) => `${key}: ${jsonToGraphQL(value)}`)
      .join(", ")}}`;
  } else if (typeof data === "string") {
    return `"${data}"`;
  }
  return data;
};

// // Format dailyMealPlans for GraphQL syntax
// const dailyMealPlansStr = jsonToGraphQL(dailyMealPlans);
const dailyMealPlansStr = ""

// Define the GraphQL mutation query
const mutation = `
mutation {
  createMealPlan(
    userId: 3,
    name: "AI Muscle Gain Plan (AI generated)",
    description: "AI High-protein meal plan.",
    startDate: "2023-04-01",
    endDate: "2023-04-07",
    goalType: "MG",
    dailyMealPlans: ${dailyMealPlansStr}) {
    weeklyMealPlan {
      id
      name
      description
      # Include other fields as needed
    }
  }
}
`;

// Function to make the request using Axios
const createMealPlan = async () => {
  try {
    const response = await axios.post(
      backend_url + "graphql/",
          { query: mutation },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer your_access_token', // Include if required
        },
      }
    );

    // Check and handle the response
    if (response.status === 200) {
      console.log('Mutation successful:', response.data);
    } else {
      console.log('Request failed:', response.status, response.data);
    }
  } catch (error) {
    console.error('Error making request:', error);
  }
};


  const saveNutritionPlan = async () => {
    console.log("MEALS")
    console.log(meals)

    const allDaysHaveMeals = Object.keys(meals).every(day => meals[day].length > 0);
    console.log(allDaysHaveMeals)
    const dailyMealPlans = transformMealsToGraphQLFormat();

    // const formattedMeals = Object.keys(meals).map((day, index) => {
    //   const meal = meals[day];
    //   return meal[0].type === "meal"
    //     ? {
    //         name: meal[0].name,
    //         day: index,
    //         nutrients: {
    //           calories: meal[0].calories,
    //           carbs: meal[0].carbs,
    //           proteins: meal[0].proteins,
    //           fats: meal[0].fats,
    //         },
    //       }
    //     : {
    //         name: meal[0].name,
    //         day: index,
    //         nutrients: {
    //           calories: 0,
    //           carbs: 0,
    //           proteins: 0,
    //           fats: 0,
    //         },
    //       };
    // });

    if (allDaysHaveMeals) {
      const mutation = `mutation {
        createMealPlan(
          userId: ${user.id},
          name: "${planName}",
          description: "High-protein meal plan.",
          startDate: "2023-04-01",
          endDate: "2023-04-07",
          goalType: "MG",
          dailyMealPlans: ${JSON.stringify(dailyMealPlans).replace(/"([^"]+)":/g, '$1:')}
        ) {
          weeklyMealPlan {
            id
            name
            description
          }
        }
      }`;

      console.log(mutation)

      try {
        const response = await axios.post(
          backend_url + "graphql/",
          { query: mutation }
        );


        if (response.data.errors) {
          console.log(response.data.errors)

          Alert.alert('Error', 'Failed to create nutrition plan');
        } else {
          Alert.alert('Success', 'Nutrition plan created successfully');
          setMeals({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
          navigation.goBack()
        } 
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to create nutrition plan');
      }
    } else {
      Alert.alert('Error', 'Please assign meals or rest days to all days');
    }
  };

  const renderMealItem = ({ item }) => (
    <View style={styles.mealItem}>


      {/* <View style={{flexDirection: 'row'}}> */}
      <Text style={styles.dayLabel}>{item.day}</Text>
      <Text style={styles.mealText}>{item.dailyMeals.length > 0 ? `${item.dailyMeals.length} Meals Added` : 'No Meal Set'}</Text>
      {
          item.dailyMeals.length > 0 ? (
         <TouchableOpacity style={styles.added} onPress={() => navigateToCreateMeal(item.day)}>
          <MaterialIcons name="edit" size={15} color={COLORS.white} style={{alignItems:'center', justifyContent: 'center'}}/>
        </TouchableOpacity>
          ) : <></> }
     
      {/* <MaterialIcons name="done" size={20} color="#0f0" style={{alignItems:'center', justifyContent: 'center'}}/> */}

      {/* </View> */}
    </View>
  );

  
  // console.log(mealListData[0]["0"])
  const mealListData = Object.keys(meals).map(day => ({ day: day, dailyMeals: meals[day] }));


  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={"Create Nutrition Plan"} />

      <TextInput
        style={styles.input}
        placeholder="Nutrition Plan Name"
        placeholderTextColor="#aaa"
        value={planName}
        onChangeText={setPlanName}
      />

      

     

      {/* Total Nutrition Comparison */}
      <View style={styles.totalNutritionContainer}>
        <Text style={styles.totalTitle}>Total Nutrition for {selectedDay}</Text>
        <Text style={styles.totalInfo}>Calories: {totalNutrition.calories} kcal / Target: {targetNutrition.calories} kcal</Text>
        <Text style={styles.totalInfo}>Carbs: {totalNutrition.carbs} g / Target: {targetNutrition.carbs} g</Text>
        <Text style={styles.totalInfo}>Proteins: {totalNutrition.proteins} g / Target: {targetNutrition.proteins} g</Text>
        <Text style={styles.totalInfo}>Fats: {totalNutrition.fats} g / Target: {targetNutrition.fats} g</Text>
      </View>

      <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mealButton} onPress={() => navigateToCreateMeal(selectedDay)}>
          <Text style={styles.buttonText}>Add Meal for {selectedDay}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.restButton} onPress={markAsRestDay}>
          <Text style={styles.buttonText}>Mark as Rest Day</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={mealListData}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.day}
        style={styles.mealList}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveNutritionPlan}>
        <Text style={styles.buttonText}>Save Nutrition Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: Platform.OS === 'ios' ? 30 : 16,
     paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
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
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: 'space-between', // Places the items at both ends

  },
  dayLabel: {
    color: '#fff',
    marginRight: 10,
  },
  mealText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mealButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 5,
    padding: 15,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  restButton: {
    backgroundColor: '#ff9800',
    borderRadius: 5,
    padding: 15,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  mealList: {
    marginTop: 20,
  },

  added: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 10,
    padding:10,
    justifyContent: 'center',
    alignItems:'center'
    
 },
});

export default AddNutritionPlan;

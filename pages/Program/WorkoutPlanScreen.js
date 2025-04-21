import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Dropdown from '../../components/Dropdown';
import IconHeader from '../../components/IconHeader';
import WorkoutCard from '../../components/workouts/WokroutCard';
import { COLORS } from '../../constants';
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';
import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
import PlanDropdown from '../../components/PlanDropdown';
import CardOverlay from '../../components/workouts/CardOverlay';
import SectionHeader from '../../components/SectionHeader';
import SearchInput from '../../components/inputs/SearchInput';
import OptionModal from '../../components/buttons/OptionModal';
import DaySelector from '../../components/DaySelector';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
const WorkoutPlanScreen = ({ navigation }) => {
  const today = new Date()
  const [selectedDay, setSelectedDay] = useState(today.getDay()-1);
  const { authState } = useContext(AuthContext);
  const [workoutPlansData, setWorkoutPlansData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);


  const graphql_user_workout_plans = {
    query: `
      query {
        userWorkoutPlans(userId: ${authState.id}) {
          id
          name
          workoutSet {
            day
            name
            workoutexerciseSet {
              suggestedReps
              suggestedSets
              exercise {
                id
                name
                gif 
                description
              }
            }
          }
        }
      }
    `,
  };

  const fetchWorkouts = () => {
    axios.post(`${backend_url}graphql/`, graphql_user_workout_plans)
      .then((response) => {
        const plans = response.data.data.userWorkoutPlans.map((obj) => ({
          label: obj.name,
          value: parseInt(obj.id, 10),  // Ensure the value is an integer
          workoutSet: obj.workoutSet,
        }));

        console.log("Fetched Plans:", plans);

        setWorkoutPlansData(plans);

        if (plans.length > 0) {
          const initialPlan = plans[0];
          setSelectedPlan(initialPlan.value);
          const initialWorkout = initialPlan.workoutSet.find(workout => parseInt(workout.day, 10) === daysOfWeek.indexOf(selectedDay));
          setSelectedWorkout(initialWorkout);

          console.log("Initial Plan Selected:", initialPlan);
          console.log("Initial Workout Selected:", initialWorkout);
        }
      })
      .catch((error) => {
        console.error("Error fetching workout plans:", error);
      });
  };

  const renderSearchExerciseItem = ({ item, index }) => {
    if (!item) return null; // Skip rendering if item is null
    return(
    <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => pressSearchItem(item)}>
       <View style={styles.searchImageWrapper}>
        <Image source={{ uri: item.gif }} style={styles.gifImage} />
      </View>
      <Text style={styles.exerciseText}>
        {item.name}
      </Text>
    </TouchableOpacity>
    )
};

  const pressSearchItem = (item) => {
    setSelectedExercise(item);
    setExerciseSearchResults([]);
    navigateToExerciseDetails(item);
    
  }
 
  const searchExercises = (query) => {
    if (query.length > 2) {
      axios.get(backend_url + `exercises-search/?search=${query}`)
        .then((response) => {
          console.log(response.data);
          setExerciseSearchResults(response.data);
          //setIsModalVisible(true);  // Show the modal when results are available
        });
    } else {
      setExerciseSearchResults([]); // Clear results if query is too short
      //setIsModalVisible(false);
    }
  };

  const navigateToExerciseDetails = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
}; 


  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  useEffect(() => {
    if (selectedPlan && workoutPlansData.length > 0) {
      const currentPlan = workoutPlansData.find(plan => plan.value === selectedPlan);
      setSelectedWorkoutPlan(currentPlan);
      console.log("Current Plan:", currentPlan);
      if (currentPlan) {
        const workoutForDay = currentPlan.workoutSet.find(workout => parseInt(workout.day, 10) === selectedDay);
        setSelectedWorkout(workoutForDay);
        console.log("Workout for Selected Day:", workoutForDay);
      }
    }
  }, [selectedPlan, selectedDay, workoutPlansData]);

  const handlePlanChange = (planValue) => {
    console.log("Plan Selected:", planValue);
    setSelectedPlan(planValue); // Update selected plan
    const currentPlan = workoutPlansData.find(plan => plan.value === planValue);
    console.log("Current Plan 2:", currentPlan);
    if (currentPlan) {
      const workoutForDay = currentPlan.workoutSet.find(workout => parseInt(workout.day, 10) === daysOfWeek.indexOf(selectedDay));
      setSelectedWorkout(workoutForDay);
      console.log("Workout for Selected Day after Plan Change:", workoutForDay);
    }
  };

   const renderWorkout = () => {
    return <>
    {selectedWorkout ?  (
      // <WorkoutCard workout={selectedWorkout} navigation={navigation} />
      <CardOverlay workout={selectedWorkout} navigation={navigation} />
    ) :  (
      <Text>No workout found for the selected day.</Text>
    )}
    </>

   }

   const options = [
    {iconType: 'Ionicons', iconName: 'add-circle-outline', label: 'Add plan', onPress: () => navigation.navigate('AddModifyPlan') },
    { iconType: 'MaterialCommunityIcons',iconName: 'file-edit-outline', label: 'Update current plan',onPress:() => navigation.navigate('UpdateWorkoutPlan', { workoutPlan: selectedWorkoutPlan })},

    { iconType: 'MaterialCommunityIcons',iconName: 'brain', label: 'ask AI for plan', onPress: () => navigation.navigate('AIWorkoutPlan') },
    // { iconType: 'Ionicons',iconName: 'information-circle-outline', label: 'Tips', onPress: () => navigation.navigate('TipsScreen') },
  ];

  return (
    <View style={styles.container}>
      {/* <IconHeader /> */}

      <SearchInput placeholder="Search exercises, workouts" search={searchExercises} 
        results={exerciseSearchResults}
        onSelect={pressSearchItem} renderSearchResultItem={renderSearchExerciseItem} />
       
       <DaySelector selectedDay={selectedDay} onDaySelect={handleDayChange} />

      <SectionHeader title="Your Workout Plans" />
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {workoutPlansData.length > 0 ? (
          <PlanDropdown label={"Change Workout Plan"} data={workoutPlansData} onSelect={handlePlanChange} />
        ) : (
          <Text>Loading workout plans...</Text>
        )}
        {/* <IconButton name='add' onPress={() => navigation.navigate('AddModifyPlan')} /> */}
        <IconButton name='add' onPress={() =>  setModalVisible(true)} />

      </View>

      {/* New Section with two options */}
      {/* <View style={styles.optionsContainer}>
        <View style={styles.option}>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('UpdateWorkoutPlan', { workoutPlan: selectedWorkoutPlan })}>
            <Text style={styles.buttonText}>Update Plan</Text>
          </TouchableOpacity>
        </View>
         <View style={styles.option}>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ExerciseSearch')}>
            <Text style={styles.buttonText}>Find Exercise</Text>
          </TouchableOpacity>
        </View> 
      </View> */}

      

      <SectionHeader title={`Workout for ${daysOfWeek[selectedDay]}`} childComponent={renderWorkout()}/>

      <OptionModal
        isVisible={modalVisible}
        options={options}
        onClose={() => setModalVisible(false)}
      />
 
      <View style={styles.exerciseList}>
        {/* Display additional exercise details or other information */}
      </View> 

      {/* <View style={{ flexDirection: "row", padding: 10 }}>
        {workoutPlansData.length > 0 ? (
          <PlanDropdown label={"Change Workout Plan"} data={workoutPlansData} onSelect={handlePlanChange} />
        ) : (
          <Text>Loading workout plans...</Text>
        )}
        <IconButton name='add' onPress={() => navigation.navigate('AddModifyPlan')} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 :0,
    //paddingHorizontal: Platform.OS === 'ios' ? 20 :0


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
  addButton: {
    color: 'blue',
    fontSize: 16,
  },

  optionsContainer: {
    marginVertical: Platform.select({ ios: 20, android: 15 }),
    marginHorizontal: Platform.select({ ios: 20, android: 15 }),
    paddingHorizontal:  Platform.select({ ios: 25, android: 10 }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.select({ ios: 15, android: 10 }),
    backgroundColor: '#333',
    padding: Platform.select({ ios: 15, android: 10 }),
    borderRadius: 5,
  },
  option: {
    
  },
  optionText: {
    color: '#fff',
    fontSize: Platform.select({ ios: 16, android: 14 }),
  },
  optionButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: Platform.select({ ios: 15, android: 12 }),
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Platform.select({ ios: 16, android: 14 }),
  },

  exerciseSearchItem: {
    flexDirection: 'row',
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 5,
    // marginBottom: 10,
  },
  imageWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8, // Adjust the radius to make the image rounded
    overflow: 'hidden', // Ensures the image respects the borderRadius
  },
  searchImageWrapper: {
    width: 45,
    height: 45,
    borderRadius: 8, // Adjust the radius to make the image rounded
    overflow: 'hidden', // Ensures the image respects the borderRadius
  },
  gifImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  gifImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  exerciseTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default WorkoutPlanScreen;

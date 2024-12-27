import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WorkoutPlanScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const { authState } = useContext(AuthContext);
  const [workoutPlansData, setWorkoutPlansData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

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

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (selectedPlan && workoutPlansData.length > 0) {
      const currentPlan = workoutPlansData.find(plan => plan.value === selectedPlan);
      console.log("Current Plan:", currentPlan);
      if (currentPlan) {
        const workoutForDay = currentPlan.workoutSet.find(workout => parseInt(workout.day, 10) === daysOfWeek.indexOf(selectedDay));
        setSelectedWorkout(workoutForDay);
        console.log("Workout for Selected Day:", workoutForDay);
      }
    }
  }, [selectedPlan, selectedDay, workoutPlansData]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handlePlanChange = (planValue) => {
    console.log("Plan Selected:", planValue);
    setSelectedPlan(planValue); // Update selected plan
    const currentPlan = workoutPlansData.find(plan => plan.value === planValue);
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

  return (
    <View style={styles.container}>
      <IconHeader />
       
       <SectionHeader title="Your Workout Plans" />
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {workoutPlansData.length > 0 ? (
          <PlanDropdown label={"Change Workout Plan"} data={workoutPlansData} onSelect={handlePlanChange} />
        ) : (
          <Text>Loading workout plans...</Text>
        )}
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

      <SectionHeader title={"Workout of " + selectedDay} childComponent={renderWorkout()}/>

      {/* {selectedWorkout ? (
        // <WorkoutCard workout={selectedWorkout} navigation={navigation} />
        <CardOverlay workout={selectedWorkout} navigation={navigation} />
      ) : (
        <Text>No workout found for the selected day.</Text>
      )} */}

      {/* {renderWorkout()} */}
 
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
});

export default WorkoutPlanScreen;

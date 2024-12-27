// WorkoutPlanScreen.js
import React, { useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Dropdown from '../../components/Dropdown';
import IconHeader from '../../components/IconHeader';
import WorkoutCard from '../../components/workouts/WokroutCard';
import { COLORS } from '../../constants';

import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';

import { backend_url } from '../../config/config';
import IconButton from '../../components/IconButton';
const workout_data = [
  {
   
      
        "day": "0",
        "workoutexerciseSet": [
          {
            "suggestedReps": 5,
            "suggestedSets": 4,
            "exercise": {
              "name": "barbell bench press",
              "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/0025_8SQ5Gz9.gif",
              "description": "To perform this exercise: Lie flat on a bench with your feet flat on the ground and your back pressed against the bench., Grasp the barbell with an overhand grip slightly wider than shoulder-width apart., Lift the barbell off the rack and hold it directly above your chest with your arms fully extended., Lower the barbell slowly towards your chest, keeping your elbows tucked in., Pause for a moment when the barbell touches your chest., Push the barbell back up to the starting position by extending your arms., Repeat for the desired number of repetitions."
            }
          },
          {
            "suggestedReps": 5,
            "suggestedSets": 4,
            "exercise": {
              "name": "barbell bent over row",
              "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/0027.gif",
              "description": "To perform this exercise: Stand with your feet shoulder-width apart and knees slightly bent., Bend forward at the hips while keeping your back straight and chest up., Grasp the barbell with an overhand grip, hands slightly wider than shoulder-width apart., Pull the barbell towards your lower chest by retracting your shoulder blades and squeezing your back muscles., Pause for a moment at the top, then slowly lower the barbell back to the starting position., Repeat for the desired number of repetitions."
            }
          },
          {
            "suggestedReps": 12,
            "suggestedSets": 3,
            "exercise": {
              "name": "barbell bent over row",
              "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/0027.gif",
              "description": "To perform this exercise: Stand with your feet shoulder-width apart and knees slightly bent., Bend forward at the hips while keeping your back straight and chest up., Grasp the barbell with an overhand grip, hands slightly wider than shoulder-width apart., Pull the barbell towards your lower chest by retracting your shoulder blades and squeezing your back muscles., Pause for a moment at the top, then slowly lower the barbell back to the starting position., Repeat for the desired number of repetitions."
            }
          }
        ]
      },
      {
        "day": "1",
        "workoutexerciseSet": [
          {
            "suggestedReps": 5,
            "suggestedSets": 4,
            "exercise": {
              "name": "barbell full squat (side pov)",
              "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/1462.gif",
              "description": "To perform this exercise: Stand with your feet shoulder-width apart, toes slightly turned out., Hold the barbell across your upper back, resting it on your traps or rear delts., Engage your core and keep your chest up as you begin to lower your body down., Bend at the knees and hips, pushing your hips back and down as if sitting into a chair., Lower your body until your thighs are parallel to the ground or slightly below., Keep your knees in line with your toes and your weight in your heels., Drive through your heels to stand back up, extending your hips and knees., Repeat for the desired number of repetitions."
            }
          },
          {
            "suggestedReps": 5,
            "suggestedSets": 4,
            "exercise": {
              "name": "barbell glute bridge",
              "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/1409.gif",
              "description": "To perform this exercise: Start by lying flat on your back on the ground with your knees bent and feet flat on the floor., Place a barbell across your hips, holding it securely with both hands., Engage your glutes and core muscles, then lift your hips off the ground until your body forms a straight line from your knees to your shoulders., Pause for a moment at the top, squeezing your glutes., Slowly lower your hips back down to the starting position., Repeat for the desired number of repetitions."
            }
          }
        ]
      
// ]
  }

]
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];




const WorkoutPlanScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Mon');

  const {authState} = useContext(AuthContext)
  const [workout_plans_data, setWorkoutPlansData] = useState([  { label: 'Your Plans', value: '1' },])
  const [workouts_data, setWorkoutsData] = useState([])


  const workoutPlan = {}; // Fetch the user's workout plan for the selected day

  const [selected, setSelected] = useState(undefined);
  const [ selectedWorkout, setSelectedWorkout] = useState(workout_data[0])
  const data = [
    { label: 'Muscle Gain #1', value: '1' },
    { label: 'Cut #1', value: '2' },
    // { label: 'Three', value: '3' },
    // { label: 'Four', value: '4' },
    // { label: 'Five', value: '5' },
  ]; 

  const graphql_user_workout_plans = { query: " \
      query { \ " +
        "userWorkoutPlans(userId:" + authState.id+ ") { \
          id \
          name \
          workoutSet{\
            day\
            name\
            workoutexerciseSet {\
              suggestedReps\
              suggestedSets\
              exercise { \
                   name \
                   gif \
                   description \
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
          graphql_user_workout_plans,
          // {headers : {'Authorization': 'Bearer '+ token}}
     //{headers : {'Authorization': 'Bearer '+ token}}
          ).then((response) =>{
          console.log("GraphQL", response.data.data)

          let plans = response.data.data.userWorkoutPlans.map((obj)=> (
             {
              label: obj.name,
              value: obj.id,
              workoutSet: obj.workoutSet
             }
          ))

          let workouts = response.data.data.userWorkoutPlans[0].workoutSet
          console.log("WORKOUTS:" + workouts)
          // console.log(workouts[0])

          // console.log(workouts[0].exerciselogSet)
 
          setWorkoutPlansData(plans);
          setSelectedWorkout(workouts[0])
          //setLikedPosts(response.data.likedPosts);
        });
  
  }   
  
  useEffect(()=>{
       fetchWorkouts()
      //  console.log(workout_plans_data)
      console.log(selectedWorkout)
      
  }, [])
   
  const handleDayChange = (day) => {
    setSelectedDay(day);
    console.log(daysOfWeek.indexOf(day))
    console.log(workout_plans_data[selected.value-1].workoutSet[daysOfWeek.indexOf(day)])
    setSelectedWorkout(workout_plans_data[selected.value-1].workoutSet[daysOfWeek.indexOf(day)])
    // Fetch the workout plan for the selected day
  };

 
  
 
  return (
     
    <View style={styles.container}>
      {/* <Text style={styles.title}>Workout Plan</Text> */}
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

      <WorkoutCard workout={selectedWorkout} navigation={navigation} />
      <View style={styles.exerciseList}>
        {/* Display workout plan for the selected day */}
        {/* You can map over workoutPlan[selectedDay] and display exercise details */}
      </View>

      <View style={{flexDirection: "row", padding:10}}>
        <Dropdown label={"change workout plan"} data={workout_plans_data} onSelect={setSelected} />

        <IconButton name='add' onPress={() => navigation.navigate('AddModifyPlan')}  />
      </View>

    
  </View>
  )
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'space-around',
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
});

export default WorkoutPlanScreen;

import React, { useState,useContext, useEffect } from 'react';
import { View, Text,TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import DaySelector from '../../components/DaySelector';
import { AuthContext } from '../../helpers/AuthContext'

import axios from 'axios';
import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const USER= {
  "username": "Lelouch",
  "id": 0
}


const CreateWorkoutPlanScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [workouts, setWorkouts] = useState({ Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} });
  const [planName, setPlanName] = useState("")
  const [selectedWorkout, setSelectedWorkout] = useState(workouts['Mon'])

  const {authState} = useContext(AuthContext)

  const [user, setUser] = useState(USER)

  useEffect(() => {
    setUser(prevUser => ({
      ...prevUser,
      username: authState.username,
      id: authState.id
    }));
     

  }, [])


  // useEffect(() => {
  //   const workoutForDay = workouts.find(workout => workout.day === selectedDay);
  //   setSelectedWorkout(workoutForDay.exercises);
  // }, [selectedWorkout, selectedDay, workouts]);

  const updateWorkout = (day, workout) => {
    setWorkouts({ ...workouts, [day]: workout });
  };

  const navigateToCreateWorkout = (day) => {
    const existingWorkout = workouts[day];
    navigation.navigate('CreateWorkoutScreen', { 
      day, 
      existingWorkout, 
      updateWorkout 
    });
  };

  const markAsRestDay = () => {
    updateWorkout(selectedDay, { name: 'Rest Day', type: 'rest' });
  };

  const saveWorkoutPlan = async () => {
    console.log("here45")
    console.log(workouts)
    console.log(Object.keys(workouts))

    const formattedWorkouts = Object.keys(workouts).map((day, index) => {
      const workout = workouts[day];
      return workout.type === "workout"
        ? {
            name: workout.name,
            day: index,
            exercises: workout.exercises.map(exercise => ({
              exercise: exercise.id, // Ensure exercise.id is correctly mapped
              sets: parseInt(exercise.sets, 10), // Parse sets as an integer
              reps: parseInt(exercise.reps, 10), // Parse reps as an integer
              restTime: "2-3min", // Static value, adapt as needed
            })),
          }
        : {
            name: workout.name,
            day: index,
            exercises: [],
          };
    }).filter(workout => workout !== null);
  
    if (formattedWorkouts.length === 7) {
      // Construct the mutation query manually
      const mutation = `mutation {
          createWorkoutPlan(
            userId: ${user.id},
            name: "${planName}",
            description: "This is ", 
            workouts: [
              ${formattedWorkouts.map(workout => `
                {
                  name: "${workout.name}",
                  day: ${workout.day},
                  exercises: [
                    ${workout.exercises.map(exercise => `
                      {
                        exercise: ${exercise.exercise},
                        sets: ${exercise.sets},
                        reps: ${exercise.reps},
                        restTime: "${exercise.restTime}"
                      }
                    `).join(',')}
                  ]
                }
              `).join(',')}
            ]
          ) {
            workoutPlan {
              id
              name
              description
              user {
                id
                username
              }
              workoutSet {
                day
                workoutexerciseSet {
                  exercise {
                    id
                    name
                  }
                  suggestedSets
                  suggestedReps
                  restTime
                }
              }
            }
          }
        }
      `;
  
      console.log(mutation);

      try {
        const response = await axios.post(
          backend_url + "graphql/",
          { query: 
          mutation },
          // {
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // }
        );

        if (response.data.errors) {
          console.error(response.data.errors);
          Alert.alert('Error', 'Failed to create workout plan');
        } else {
          Alert.alert('Success', 'Workout plan created successfully');
          setWorkouts({ Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} });
          // Optionally navigate back or clear state
          navigation.goBack()
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to create workout plan');
      }
    } else {
      Alert.alert('Error', 'Please assign workouts or rest days to all days');
    }
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.dayLabel}>{item.day}</Text>
      <Text style={styles.workoutText}>{item.name || 'No Workout Set'}</Text>

      
      <View style={{flexDirection: 'row'}}>
      {
          item.name ? (
         <TouchableOpacity style={styles.added} onPress={() => navigateToCreateWorkout(item.day)}>
          <MaterialIcons name="edit" size={15} color={COLORS.white} style={{alignItems:'center', justifyContent: 'center'}}/>
        </TouchableOpacity>
          ) : <></> }
     
      {/* <MaterialIcons name="done" size={20} color="#0f0" style={{alignItems:'center', justifyContent: 'center'}}/> */}

      </View>
    
    </View>
  );

  const workoutListData = Object.keys(workouts).map(day => ({ day, ...workouts[day] }));

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={"Create Workout Plan"} />

      <TextInput
        style={styles.input}
        placeholder="Workout Plan Name"
        placeholderTextColor="#aaa"
        value={planName}
        onChangeText={setPlanName}
      />

      <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.workoutButton} onPress={() => navigateToCreateWorkout(selectedDay)}>
          <Text style={styles.buttonText}>Add/Edit Workout for {selectedDay}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restButton} onPress={markAsRestDay}>
          <Text style={styles.buttonText}>Mark as Rest Day</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workoutListData}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.day}
        style={styles.workoutList}
      />

      
     
      <TouchableOpacity style={styles.saveButton} onPress={saveWorkoutPlan}>
        <Text style={styles.buttonText}>Save Workout Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutItem: {
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
  workoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  workoutButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 5,
    padding: 15,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  restButton: {
    backgroundColor: '#ff0000',
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
  workoutList: {
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

export default CreateWorkoutPlanScreen;
import React, { useState,useContext, useEffect } from 'react';
import { View, Text,TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
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

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CreateWorkoutPlanScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(0); // 0-6 for Monday-Sunday
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
    <TouchableOpacity 
      style={styles.workoutItem}
      onPress={() => navigateToCreateWorkout(item.day)}
    >
      <View style={styles.workoutItemContent}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayLabel}>{item.day}</Text>
          <Text style={styles.workoutText}>{item.name || 'No Workout Set'}</Text>
        </View>
        {item.name ? (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigateToCreateWorkout(item.day)}
          >
            <MaterialIcons name="edit" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const workoutListData = Object.keys(workouts).map(day => ({ day, ...workouts[day] }));

  return (
    <View
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.gradient}>
        <ArrowHeaderNew navigation={navigation} title={"Create Workout Plan"} />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.input}
              placeholder="Workout Plan Name"
              placeholderTextColor="#aaa"
              value={planName}
              onChangeText={setPlanName}
            />

            <DaySelector 
              selectedDay={selectedDay} 
              onDaySelect={setSelectedDay}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.workoutButton]} 
                onPress={() => navigateToCreateWorkout(dayNames[selectedDay])}
              >
                <Text style={styles.buttonText}>Add/Edit Workout</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.restButton]} 
                onPress={markAsRestDay}
              >
                <Text style={styles.buttonText}>Rest Day</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={workoutListData}
              renderItem={renderWorkoutItem}
              keyExtractor={(item) => item.day}
              style={styles.workoutList}
              scrollEnabled={false}
            />

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={saveWorkoutPlan}
            >
              <Text style={styles.saveButtonText}>Save Workout Plan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'ios' ? 35 : 10,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  workoutItem: {
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  workoutItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayContainer: {
    flex: 1,
  },
  dayLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutButton: {
    backgroundColor: COLORS.darkOrange,
  },
  restButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 8,
    padding: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutList: {
    marginTop: 10,
  },
});

export default CreateWorkoutPlanScreen;
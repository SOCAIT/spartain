import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import ArrowHeaderNew from '../../../components/ArrowHeaderNew';
import DaySelector from '../../../components/DaySelector';
import { AuthContext } from '../../../helpers/AuthContext';
import axios from 'axios';
import { backend_url } from '../../../config/config';
import { COLORS } from '../../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const USER = {
  username: "Lelouch",
  id: 0,
};

// Mapping between day indices and day names
const dayMapping = {
  0: 'Mon',
  1: 'Tue',
  2: 'Wed',
  3: 'Thu',
  4: 'Fri',
  5: 'Sat',
  6: 'Sun'
};

const inverseDayMapping = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6
};

const UpdateWorkoutPlanScreen = ({ navigation, route }) => {
  // Receive current workout plan from previous screen via route.params
  const { workoutPlan } = route.params;
  const [selectedDay, setSelectedDay] = useState('Mon');
  // Initialize workouts for each day with empty objects
  const [workouts, setWorkouts] = useState({ Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} });
  const [planName, setPlanName] = useState("");
  const { authState } = useContext(AuthContext);
  const [user, setUser] = useState(USER);

  useEffect(() => {
    setUser(prevUser => ({
      ...prevUser,
      username: authState.username,
      id: authState.id,
    }));
  }, [authState]);

  // Pre-fill the workout plan details from the current plan passed as prop
  useEffect(() => {
    console.log("Workout Plan: ", workoutPlan.workoutSet[0].workoutexerciseSet);
    if (workoutPlan) {
      setPlanName(workoutPlan.label);
      // Build an object with keys for each day (Mon-Sun)
      const initialWorkouts = { Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} };
      if (workoutPlan.workoutSet && workoutPlan.workoutSet.length > 0) {
        workoutPlan.workoutSet.forEach(item => {
          // Assume item.day is a number (0 for Mon, 1 for Tue, etc.)
          const dayName = dayMapping[item.day];
          initialWorkouts[dayName] = {
            name: item.name,
            // Mark as "rest" if the workout name indicates a rest day; otherwise "workout"
            type: item.name.toLowerCase().includes("rest") ? "rest" : "workout",
            exercises: item.workoutexerciseSet.map(exItem => ({
              id: exItem.exercise.id,
              name: exItem.exercise.name,
              sets: exItem.suggestedSets,
              reps: exItem.suggestedReps,
              restTime: exItem.restTime,
            })),
          };
        });
      }
      setWorkouts(initialWorkouts);
    }
  }, [workoutPlan]);

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

  const saveUpdatedWorkoutPlan = async () => {
    // Format workouts into an array for the GraphQL mutation
    const formattedWorkouts = Object.keys(workouts).map(day => {
      const workout = workouts[day];
      const dayIndex = inverseDayMapping[day];
      if (workout && workout.type === "workout" && workout.exercises && workout.exercises.length > 0) {
        return {
          name: workout.name,
          day: dayIndex,
          exercises: workout.exercises.map(exercise => ({
            exercise: exercise.id,
            sets: parseInt(exercise.sets, 10),
            reps: parseInt(exercise.reps, 10),
            restTime: exercise.restTime || "2-3min",
          })),
        };
      } else {
        // For rest days or when no workout is provided, still include the day with no exercises
        return {
          name: workout.name || 'Rest Day',
          day: dayIndex,
          exercises: [],
        };
      }
    }).filter(workout => workout !== null);

    // Validate that we have workouts for all 7 days
    if (formattedWorkouts.length !== 7) {
      Alert.alert('Error', 'Please assign workouts or rest days to all days');
      return;
    }

    // Check if plan name is provided
    if (!planName || planName.trim() === '') {
      Alert.alert('Error', 'Please provide a workout plan name');
      return;
    }

    try {
      // Construct the updateWorkoutPlan mutation query
      const mutation = `mutation {
        updateWorkoutPlan(
          id: ${workoutPlan.value},
          userId: ${user.id},
          name: "${planName}",
          description: "Updated workout plan",
          workouts: [
            ${formattedWorkouts.map(workout => `
              {
                name: "${workout.name}",
                day: ${workout.day},
                exercises: [${workout.exercises.length > 0 ? 
                  workout.exercises.map(exercise => `
                    {
                      exercise: ${exercise.exercise},
                      sets: ${exercise.sets},
                      reps: ${exercise.reps},
                      restTime: "${exercise.restTime}"
                    }
                  `).join(',') : ''
                }]
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
      }`;

      console.log(mutation);

      const response = await axios.post(
        backend_url + "graphql/",
        { query: mutation }
      );

      if (response.data.errors) {
        console.error(response.data.errors);
        Alert.alert('Error', `Failed to update workout plan: ${response.data.errors[0]?.message || 'Unknown error'}`);
      } else {
        Alert.alert('Success', 'Workout plan updated successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update workout plan error:', error);
      Alert.alert('Error', `Failed to update workout plan: ${error.response?.data?.message || error.message || 'Network error'}`);
    }
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.dayLabel}>{item.day}</Text>
      <Text style={styles.workoutText}>{item.name || 'No Workout Set'}</Text>
      <View style={{ flexDirection: 'row' }}>
        {item.name ? (
          <TouchableOpacity style={styles.added} onPress={() => navigateToCreateWorkout(item.day)}>
            <MaterialIcons name="edit" size={15} color={COLORS.white} style={{ alignItems: 'center', justifyContent: 'center' }}/>
          </TouchableOpacity>
        ) : null }
      </View>
    </View>
  );

  const workoutListData = Object.keys(workouts).map(day => ({ day, ...workouts[day] }));

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={"Update Workout Plan"} />

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

      <TouchableOpacity style={styles.saveButton} onPress={saveUpdatedWorkoutPlan}>
        <Text style={styles.buttonText}>Update Workout Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'ios' ? 45 : 20,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UpdateWorkoutPlanScreen;
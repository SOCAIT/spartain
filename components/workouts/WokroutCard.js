import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../../constants';

const daysOfWeek = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WorkoutCard = ({ workout, navigation }) => {
  const viewWorkout = () => {
    navigation.navigate("WorkoutView", { workout });
  };

  const modifyWorkout = () => {
    navigation.navigate("UpdateWorkoutScreen", { workout });
  };

  const renderWorkoutOverview = ({ item }) => {
    const exerciseLimit = 3;
    const extraExercises = item.workoutexerciseSet.length - exerciseLimit;

    return (
      <View style={styles.card}>
        <Text style={styles.dayIndicator}>{daysOfWeek[parseInt(item.day, 10)]}</Text>
        <Text style={styles.workoutName}>{item.name}</Text>

        {/* Show only the first four exercises */}
        {item.workoutexerciseSet.slice(0, exerciseLimit).map((detail, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text key={index + "_"} style={styles.exerciseTitle}>
              {detail.exercise.name}
            </Text>
            <Text key={index + "1"} style={styles.exerciseDetails}>
              Reps: {detail.suggestedReps} | Sets: {detail.suggestedSets}
            </Text>
          </View>
        ))}

        {/* Indicator for more exercises */}
        {extraExercises > 0 && (
          <Text style={styles.moreExercisesText}>
            + {extraExercises} more exercise{extraExercises > 1 ? 's' : ''}
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={viewWorkout}>
          <Text style={styles.buttonText}>Show Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.modifyButton]} onPress={modifyWorkout}>
          <Text style={styles.buttonText}>Modify Workout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderWorkoutOverview({ item: workout })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "80%",
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    position: 'relative',
  },
  dayIndicator: {
    position: 'absolute',
    top: -15,
    left: 10,
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: 5,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#ccc',
    marginVertical: 5,
  },
  moreExercisesText: {
    fontSize: 16,
    color: '#ff9800',
    marginTop: 10,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  modifyButton: {
    backgroundColor: '#ff9800', // Different color for the modify button
    marginTop: 10, // Space between the buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutCard;

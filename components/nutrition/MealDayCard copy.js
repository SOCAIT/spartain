import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, SIZES, FONTS } from '../../constants';

const MealDayCard = ({navigation, name, exercises, buttonText, onPress }) => {
  return (
    <View style={styles.card}>
      {/* <Text style={styles.title}>{name}</Text> */}
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{exercise.meal.name}</Text>
          {/* <Text style={styles.exerciseDetails}>
            Reps: {exercise.suggestedReps} | Sets: {exercise.suggestedSets} 
          </Text> */}
        </View>
      ))}
      <Text Text style={styles.exerciseDetails}> ...more</Text>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.white
  },
  exerciseContainer: {
    marginBottom: 10,
    color: COLORS.white

  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.white

  },
  exerciseDetails: {
    fontSize: 16,
    color: COLORS.white

  },

  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MealDayCard;

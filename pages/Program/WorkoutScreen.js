import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import StylishCard from '../../components/StylishCard';
import { useNavigation } from '@react-navigation/native';
import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import ArrowHeader from '../../components/ArrowHeader';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import WokroutCardNew from '../../components/workouts/WokroutCardNew';
import ExerciseCard from '../../components/exercises/ExerciseCard';

const exercises_dummy = [
  {
    "id": 5,
    "name": "Push-up",
    "description": "A bodyweight exercise that targets the chest, shoulders, and triceps. To perform a push-up, start in a plank position with your hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up to the starting position.",
    "bodyPart": "Upper-Body",
    "equipment": "bodyweight",
    "target": "chest, shoulders, tricep",
    "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/weighted-push-up.webp"
  },
  {
    "id": 6,
    "name": "Pull-up",
    "description": "A bodyweight exercise that targets the back, biceps, and shoulders. To perform a pull-up, grip a bar with your hands slightly wider than shoulder-width apart, palms facing away from you. Pull yourself up until your chin is above the bar, then lower yourself back down to the starting position.",
    "bodyPart": "Upper-Body",
    "equipment": "pull-up bar",
    "target": "Back, Biceps, Shoulders",
    "gif": "https://socait-synchron.s3.amazonaws.com/media/gifs/Pull-up.gif"
  }
]

const WorkoutScreen = ({ route }) => {
  const { workout } = route.params;
  const navigation = useNavigation();

  const navigateToExerciseDetails = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  }; 

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={workout.name} paddingTop={10} />
      {/* <Text style={styles.header}>{workout.name}</Text> */}
      <FlatList
        data={workout.workoutexerciseSet}
        renderItem={({ item }) => (
          <ExerciseCard navigation={navigation} exerciseItem={item}/>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
    paddingHorizontal:  Platform.OS === 'ios' ? 20 : 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exerciseTouchable: {
    marginBottom: 10,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden', // Ensure the image is properly clipped to the border radius
    width: '80%', // Set equal width and height for a perfect circle
    height: 200,
    marginBottom: 20,
  },
  gifImage: {
    // width: 300,
    // height: 200,
    // marginBottom: 20,
    flex: 1,
    width: null,
    height: null,
    // borderRadius: 20
    //borderRadius: 100, // Make the border circular
  },
  // gifImage: {
  //   width: '100%',
  //   height: 200,
  //   marginBottom: 10,
  // },
  instructionText: {
    fontSize: 16,
    color: '#333',
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  cardContent: {
    paddingHorizontal: 10,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#ccc',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutScreen;
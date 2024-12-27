import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ExerciseCard = ({navigation, exerciseItem}) => {

  const navigateToExerciseDetails = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  }; 

  return (
    <View style={styles.workoutCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: exerciseItem.exercise.gif }} // Replace with the actual workout image URL
              style={styles.workoutImage}
            />
          </View>
          <View style={styles.workoutDetails}>
            <Text style={styles.workoutTitle}>{exerciseItem.exercise.name}</Text>
            <Text style={styles.workoutInfo}>Reps: {exerciseItem.suggestedReps} / Sets: {exerciseItem.suggestedSets}</Text>
            <View style={styles.workoutMetrics}>
              <Text style={styles.workoutMetric}>25min</Text>
              <Text style={styles.workoutMetric}>412kcal</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => navigateToExerciseDetails(exerciseItem.exercise)}>
            <MaterialIcons name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  workoutImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutInfo: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  workoutMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  workoutMetric: {
    color: '#FFF',
    fontSize: 12,
  },
  playButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 20,
    padding: 10,
  },

  imageContainer: {
    borderRadius: 10,
    // padding:10,
    marginRight: 10,
    overflow: 'hidden', // Ensure the image is properly clipped to the border radius
    width: 100, // Set equal width and height for a perfect circle
    // height: 50,
  },
})

export default ExerciseCard
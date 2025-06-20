import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const daysOfWeek = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CardOverlay = ({onPress, workout, navigation}) => {

  const viewWorkout = () => {
    navigation.navigate("WorkoutView", { workout });
  };


  const modifyWorkout = () => {
    navigation.navigate("UpdateWorkoutScreen", { workout });
  };


  return (
    <ImageBackground
    source={require("../../assets/in_app/workout/workout_bg.png")} // Replace with the actual workout background image URL workout.image, { uri: 'https://via.placeholder.com/150'}
    style={styles.card}
    imageStyle={styles.cardImage}
  >
    <View style={styles.workoutOverlay}>
      <Text style={styles.workoutTitle}>{workout.name}</Text>
      {/* <Text style={styles.workoutInfo}>8 Series Workout - Intense</Text> */}
      {/* <View style={styles.workoutMetrics}>
        <Text style={styles.workoutMetric}>25min</Text>
        <Text style={styles.workoutMetric}>412kcal</Text>
      </View> */}
      <TouchableOpacity style={styles.playButton} onPress={viewWorkout}>
        <MaterialIcons name="chevron-right" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  </ImageBackground>
  )
} 


const styles = StyleSheet.create({
    
    card: {
      height: 150,
      borderRadius: 10,
      overflow: 'hidden',
      width: 250,
    },
    cardImage: {
      borderRadius: 10,
    },
    workoutOverlay: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 15,

      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay for better text visibility
    },
    workoutTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    workoutInfo: {
      color: '#FFF',
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
      alignSelf: 'flex-end',
      backgroundColor: '#FF6A00',
      borderRadius: 20,
      padding: 10,
    },
  });

export default CardOverlay
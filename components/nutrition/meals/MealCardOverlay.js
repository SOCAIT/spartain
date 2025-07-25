import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants';

const daysOfWeek = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MealCardOverlay = ({ meal, navigation, onAddMeal }) => {
  console.log(meal)

  const viewWorkout = () => {
    navigation.navigate("MealView", { meal: meal.meal});
  };



  return (
    <TouchableOpacity
      style={styles.card}
      onPress={viewWorkout}
      activeOpacity={0.8}
    >
      <View style={styles.workoutOverlay}>
        {(() => {
          const name = meal.meal.name || '';
          const truncated = name.length > 62 ? name.slice(0, 59).trim() + '...' : name;
          return (
            <Text style={styles.workoutTitle} numberOfLines={2} ellipsizeMode="tail">
              {truncated}
            </Text>
          );
        })()}
        <View style={styles.workoutMetrics}>
          {/* <Text style={styles.workoutMetric}>{meal.time}min</Text> */}
          <Text style={styles.workoutMetric}>{meal.meal.calories}kcal</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={(e) => {
              e.stopPropagation();
              onAddMeal(meal.meal);
            }}
          >
            <MaterialIcons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={(e) => {
              e.stopPropagation();
              viewWorkout();
            }}
          >
            <MaterialIcons name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
} 


const styles = StyleSheet.create({
    
    card: {
      height: 150,
      borderRadius: 10,
      overflow: 'hidden',
      marginLeft: 20,
      borderWidth:2,
      borderColor: COLORS.darkOrange,
      width: 250, // Add explicit width
      backgroundColor: '#333', // Add background color so the card is visible
    },
    cardImage: {
      borderRadius: 10,
      
    },
    workoutOverlay: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Make overlay more visible
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
    addButton: {
      backgroundColor: '#FF6A00',
      borderRadius: 20,
      padding: 10,
      marginRight: 10,
    },
  });

export default MealCardOverlay
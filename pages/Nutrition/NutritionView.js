import React, { useState, useEffect } from 'react';


import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import StylishCard from '../../components/StylishCard';
import { useNavigation } from '@react-navigation/native';

import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import ArrowHeader from '../../components/ArrowHeader';
import MealCard from '../../components/nutrition/MealCard';


const NutritionView = ({route}) => {
  const { workout } = route.params;
  const navigation = useNavigation();

  const navigateToExerciseDetails = (exercise) => {
    navigation.navigate('MealView', { exercise });
  }; 

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


  return (
    <View style={styles.container}>
      <ArrowHeader navigation={navigation} title={daysOfWeek[workout.day]}/>
      {/* <Text style={styles.header}>{workout.name}</Text> */}
      <FlatList
        data={workout.dailymealplandetailSet}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseTouchable}>  
            <MealCard
              title={item.meal.name}
              exercises={[{ name: item.meal.name, carbs: item.meal.carbs, fats: item.meal.fats, proteins: item.meal.proteins }]}
              buttonText={"View Meal"}
              onPress={() => navigateToExerciseDetails(item.meal)}
            />
            {/* <Image source={{ uri: item.gifUrl }} style={styles.gifImage} />
            <Text style={styles.instructionText}>{item.instructions}</Text> */}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exerciseTouchable: {
    marginBottom: 10,
  },
  gifImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
  },
});


export default NutritionView
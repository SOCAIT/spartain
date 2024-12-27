// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import WorkoutPlanScreen from './WorkoutPlanScreen';
import AddModifyPlanScreen from './AddModifyPlanScreen';
import {createNativeStackNavigator}  from "@react-navigation/native-stack"
import WorkoutScreen from './WorkoutScreen';
import ExerciseDetailsScreen from './ExerciseDetailsScreeen';
import CreateWorkoutPlanScreen from './CreateWorkoutPlanScreen';
import CreateWorkoutScreen from './CreateWorkoutScreen';
import UpdateWorkoutScreen from './UpdateWorkoutScreen';

const Stack = createNativeStackNavigator()

const Program = () => {
  return (
      <Stack.Navigator 
      initialRouteName="WorkoutPlan"
      screenOptions={{
        headerShown: false
     }} 
      >
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
        <Stack.Screen name="AddModifyPlan" component={CreateWorkoutPlanScreen} />
        <Stack.Screen name="WorkoutView" component={WorkoutScreen} />
        <Stack.Screen name='ExerciseDetails' component={ExerciseDetailsScreen} />
        <Stack.Screen name="CreateWorkoutScreen" component={CreateWorkoutScreen} />
        <Stack.Screen name="UpdateWorkoutScreen" component={UpdateWorkoutScreen} />


      </Stack.Navigator>
  );
};

export default Program
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
import UpdateWorkoutScreen from './update/UpdateWorkoutScreen';
import ExerciseSearch from './ExerciseSearch';
import UpdateWorkoutPlanScreen from './update/UpdateWorkoutPlan';
import AIWorkoutPlanScreen from '../chat/AIWorkoutPlan';

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
                <Stack.Screen name="AIWorkoutPlan" component={AIWorkoutPlanScreen} />
        
        <Stack.Screen name="UpdateWorkoutPlan" component={UpdateWorkoutPlanScreen} />
        <Stack.Screen name="ExerciseSearch" component={ExerciseSearch} />


      </Stack.Navigator>
  );
};

export default Program
import { View, Text } from 'react-native'
import React from 'react'

import {createNativeStackNavigator}  from "@react-navigation/native-stack"
import NutritionPlan from './NutritionPlan'
import AddNutritionPlan from './AddNutritionPlan'
import NutritionView from './NutritionView'
import RecipeScreen from './RecipeScreen'
import AddModifyPlanScreen from '../Program/AddModifyPlanScreen'
import MealPlanScreen from './AddMealScreen'

const Stack = createNativeStackNavigator()


const NutritionStack = () => {
    return (
        <Stack.Navigator 
        initialRouteName="NutritionPlan"
        screenOptions={{
          headerShown: false
       }} 
        >
          <Stack.Screen name="NutritionPlan" component={NutritionPlan} />
          <Stack.Screen name="AddModifyPlan" component={AddNutritionPlan} />
          <Stack.Screen name="AddMealDayPlan" component={MealPlanScreen} />

          <Stack.Screen name="NutritionView" component={NutritionView} />
          <Stack.Screen name="MealView" component={RecipeScreen} />


        </Stack.Navigator>
    );
}

export default NutritionStack
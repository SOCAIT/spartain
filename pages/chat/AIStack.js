import { View, Text } from 'react-native'
import React from 'react'

import {createNativeStackNavigator}  from "@react-navigation/native-stack"
import ChatbotScreen from './ChatbotScreen'
import AINutritionPlan from './AINutritionPlan'
import ChatScreen from './ChatbotScreenNew'

const Stack = createNativeStackNavigator()


const AIStack = () => {
    return (
      <Stack.Navigator initialRouteName="Chatbot"  screenOptions={{
        headerShown: false
       }}>
        <Stack.Screen name="Chatbot" component={ChatScreen} />
        <Stack.Screen name="AINutritionPlan" component={AINutritionPlan} />
        {/* <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} /> */}
      </Stack.Navigator>
    );
}

export default AIStack
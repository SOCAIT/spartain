import { View, Text } from 'react-native'
import React from 'react'

import {createNativeStackNavigator}  from "@react-navigation/native-stack"
import ChatbotScreen from './ChatbotScreen'
import AINutritionPlan from './AINutritionPlan'
import ChatScreen from './ChatbotScreenNew'
import AIWorkoutPlanScreen from './AIWorkoutPlan'
import BodyAnalyzerScreen from './BodyAnalyzer'
import CameraScreen from './Camera'
import PhotoPreview from './PhotoPreview'
import AnalysisResult from './AnalysisResult'

const Stack = createNativeStackNavigator()


const AIStack = () => {
    return (
      <Stack.Navigator initialRouteName="Chatbot"  screenOptions={{
        headerShown: false
       }}>
        <Stack.Screen name="Chatbot" component={ChatScreen} />
        <Stack.Screen name="AINutritionPlan" component={AINutritionPlan} />
        <Stack.Screen name="AIWorkoutPlan" component={AIWorkoutPlanScreen} />
        <Stack.Screen name="BodyAnalyzer" component={BodyAnalyzerScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="PhotoPreview" component={PhotoPreview} />
        <Stack.Screen name="AnalysisResult" component={AnalysisResult} />
        {/* <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} /> */}
      </Stack.Navigator> 
    );
}

export default AIStack
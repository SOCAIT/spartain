// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import {createNativeStackNavigator}  from "@react-navigation/native-stack"

import Gyms from './Gyms';
import ItemDetails from './ItemDetails';
import DisciplineScore from './discipline/DisciplineScore';
import DailyAccountability from './discipline/DailyAccountability';

const Stack = createNativeStackNavigator()

const Spaces = () => {
  return (
      <Stack.Navigator 
      initialRouteName="DisciplineScore"
      screenOptions={{
        headerShown: false
     }} 
      >
        <Stack.Screen name="Gyms" component={Gyms} />
        <Stack.Screen name="ItemDetails" component={ItemDetails} />
        <Stack.Screen name="DisciplineScore" component={DisciplineScore} />
        <Stack.Screen name="DailyAccountability" component={DailyAccountability} />



        

      </Stack.Navigator>
  );
};

export default Spaces
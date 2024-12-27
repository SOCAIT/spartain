import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'

import {Realm} from '@realm/react';
import {createRealmContext} from '@realm/react';
import {Exercise} from '../../models/Exercise';
import {WorkoutPlan} from '../../models/WorkoutPlan';

// Create a configuration object
const realmConfig: Realm.Configuration = {
  schema: [Exercise, WorkoutPlan],
}; 

// Create a realm context
const {RealmProvider, useRealm, useObject, useQuery} =
  createRealmContext(realmConfig);

// // Create a realm context
// import {RealmProvider, useRealm, useObject, useQuery} from '../../models'
  
export const useExerciseHook = () => {

 // const exercises = useQuery(Exercise);

  const getExercises = () => {
        // retrieve the set of Task objects
     // const exercises = realm.objects("Exercise");

      //console.log(exercises)
   }

 


  return {getExercises}
}

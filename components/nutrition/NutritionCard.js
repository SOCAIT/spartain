import { View, Text,Image,StyleSheet } from 'react-native'
import React from 'react'

import { Card, Button, Icon} from '@rneui/themed';

import { COLORS, SIZES, FONTS} from '../../constants';

import MealDayCard from './MealCard';


const NutritionCard = ({workout, navigation}) => {

  const viewWorkout = () => {
      console.log(navigation)
      console.log(workout)
      navigation.navigate("NutritionView", {workout})
  }
  
  return (
    <View style={styles.container}>
       <MealDayCard exercises={workout.dailymealplandetailSet} buttonText={"Show Details"}  onPress={viewWorkout}/>
    </View>
  )
}

const styles = StyleSheet.create({
   
  
    container: {
        flex: 1,
        width: "80%",
      },
      fonts: {
        marginBottom: 8,
      },
      user: {
        flexDirection: 'row',
        marginBottom: 6,
      },
      image: {
        width: 30,
        height: 30,
        marginRight: 10,
      },
      name: {
        fontSize: 16,
        marginTop: 5,
      },
  
  
  })

export default NutritionCard
import { View, Text,Image,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

import { Card, Button, Icon} from '@rneui/themed';

import { COLORS, SIZES, FONTS} from '../../constants';

import MealDayCard from './MealCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const NutritionCard = ({workout, navigation}) => {

  const viewWorkout = () => {
      console.log(navigation)
      console.log(workout)
      navigation.navigate("NutritionView", {workout})
  }
  
  return (
    <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Diet & Nutrition</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.dietCard}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with the actual food image URL
        style={styles.dietImage}
      />
      <View style={styles.dietDetails}>
        <Text style={styles.dietTitle}>Salad & Egg</Text>
        <Text style={styles.dietInfo}>548kcal - 20min</Text>
        <View style={styles.dietMetrics}>
          <Text style={styles.dietMetric}>25g Protein</Text>
          <Text style={styles.dietMetric}>17g Fat</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={viewWorkout}>
        <MaterialIcons name="chevron-right" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
   

    dietCard: {
      flexDirection: 'row',
      backgroundColor: '#333',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    dietImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginRight: 10,
    },
    dietDetails: {
      flex: 1,
    },
    dietTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    dietInfo: {
      color: '#888',
      fontSize: 14,
      marginTop: 5,
    },
    dietMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    dietMetric: {
      color: '#FFF',
      fontSize: 12,
    },
    
  })

export default NutritionCard
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const WokroutCardNew = () => {
  return (
    <View style={styles.workoutCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with the actual workout image URL
            style={styles.workoutImage}
          />
          <View style={styles.workoutDetails}>
            <Text style={styles.workoutTitle}>Upper Strength 2</Text>
            <Text style={styles.workoutInfo}>8 Series Workout - Intense</Text>
            <View style={styles.workoutMetrics}>
              <Text style={styles.workoutMetric}>25min</Text>
              <Text style={styles.workoutMetric}>412kcal</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <MaterialIcons name="play-arrow" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  workoutImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutInfo: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  workoutMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  workoutMetric: {
    color: '#FFF',
    fontSize: 12,
  },
  playButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 20,
    padding: 10,
  },
})

export default WokroutCardNew
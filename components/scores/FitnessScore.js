import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const FitnessScore = () => {
  return (
    
    <ScrollView horizontal={true} style={styles.metricsScrollContainer} showsHorizontalScrollIndicator={false}>
      <View style={[styles.metricCard, { backgroundColor: '#FF6A00' }]}>
        <Text style={styles.metricValue}>88%</Text>
        <Text style={styles.metricLabel}>Score</Text>
        <Icon name="bar-chart" size={24} color="#FFF" style={styles.metricIcon} />
      </View>
      <View style={[styles.metricCard, { backgroundColor: '#007BFF' }]}>
        <Text style={styles.metricValue}>781ml</Text>
        <Text style={styles.metricLabel}>Hydration</Text>
        <Icon name="tint" size={24} color="#FFF" style={styles.metricIcon} />
      </View>
      {/* Add more metric cards as needed */}
      <View style={[styles.metricCard, { backgroundColor: '#28A745' }]}>
        <Text style={styles.metricValue}>120 bpm</Text>
        <Text style={styles.metricLabel}>Heart Rate</Text>
        <Icon name="heartbeat" size={24} color="#FFF" style={styles.metricIcon} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    metricsScrollContainer: {
        flexDirection: 'row',
      },
      metricCard: {
        width: 140, // Adjust width as needed for the cards
        borderRadius: 10,
        padding: 15,
        justifyContent: 'space-between',
        marginRight: 10, // Add space between metric cards
      },
      metricValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
      },
      metricLabel: {
        color: '#FFF',
        fontSize: 14,
      },
      metricIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
})

export default FitnessScore
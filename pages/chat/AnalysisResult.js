import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

export default function AnalysisResult({ route, navigation }) {
  const { analysis } = route.params;
  const measurements = JSON.parse(analysis.body_measurements);

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="Analysis Results" />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Body Measurements</Text>
        
        <View style={styles.measurementContainer}>
          <MeasurementItem 
            label="Weight" 
            value={measurements.weight_kg ? `${measurements.weight_kg} kg` : 'N/A'} 
          />
          <MeasurementItem 
            label="Body Fat" 
            value={measurements.body_fat_percentage ? `${measurements.body_fat_percentage}%` : 'N/A'} 
          />
          <MeasurementItem 
            label="Waist Circumference" 
            value={measurements.waist_circumference_cm ? `${measurements.waist_circumference_cm} cm` : 'N/A'} 
          />
          <MeasurementItem 
            label="Muscle Mass" 
            value={measurements.muscle_mass_kg ? `${measurements.muscle_mass_kg} kg` : 'N/A'} 
          />
        </View>
      </View>
    </View>
  );
}

const MeasurementItem = ({ label, value }) => (
  <View style={styles.measurementItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  measurementContainer: {
    gap: 20,
  },
  measurementItem: {
    backgroundColor: '#2C2C2E',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 
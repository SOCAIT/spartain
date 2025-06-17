import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Linking } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

export default function AnalysisResult({ route, navigation }) {
  const { analysis } = route.params;
  const measurements = JSON.parse(analysis.body_measurements);
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

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

        {/* Disclaimer Section */}
        <View style={styles.disclaimerContainer}>
          <View style={styles.disclaimerHeader}>
            <View style={styles.disclaimerHeaderLeft}>
              <Text style={styles.disclaimerIcon}>ℹ️</Text>
              <Text style={styles.disclaimerTitle}>AI Estimation</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowFullDisclaimer(!showFullDisclaimer)}
              style={styles.learnMoreButton}
            >
              <Text style={styles.learnMoreText}>
                {showFullDisclaimer ? 'Show less' : 'Learn more'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.disclaimerText}>
            This is an AI-generated estimation based on visual analysis and is not a medical diagnosis.
          </Text>
          
          {showFullDisclaimer && (
            <View style={styles.fullDisclaimerContainer}>
              <Text style={styles.fullDisclaimerText}>
                Estimates are informed by general health guidelines from sources such as the CDC and NIH.
                For accurate measurements and diagnosis, consult a medical professional.
              </Text>
              <Text style={styles.fullDisclaimerText}>
                These estimations should be used for general fitness tracking purposes only and may not reflect your actual body composition.
              </Text>
              
              <View style={styles.citationsContainer}>
                <Text style={styles.citationsTitle}>Health Guidelines Sources:</Text>
                
                <TouchableOpacity 
                  onPress={() => openLink('https://www.cdc.gov/healthyweight/assessing/index.html')}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>
                    • CDC - Assessing Your Weight & Health Risk
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => openLink('https://www.cdc.gov/healthyweight/effects/index.html')}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>
                    • CDC - Health Effects of Overweight and Obesity
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => openLink('https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm')}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>
                    • NIH - Calculate Your Body Mass Index
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => openLink('https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner')}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>
                    • NIH - Body Weight Planner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  disclaimerContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  disclaimerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  disclaimerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  disclaimerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  learnMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF9500',
    borderRadius: 15,
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimerText: {
    color: '#8E8E93',
    fontSize: 16,
    lineHeight: 22,
  },
  fullDisclaimerContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3E',
  },
  fullDisclaimerText: {
    color: '#8E8E93',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  citationsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3E',
  },
  citationsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  linkContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#3C3C3E',
    borderRadius: 5,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 
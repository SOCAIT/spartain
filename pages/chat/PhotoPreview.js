import React, { useRef } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Platform, Alert, Animated } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { vision_url } from '../../config/config';

// Adjust this URL to point to your backend server.

export default function PhotoPreview({ route, navigation }) {
  const { photo } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAnalyze = async () => {
    try {
      // Create a FormData object and append the photo file.
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${photo.path}`, // If your photo object provides a URI, you can use photo.uri directly.
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      console.log('Uploading photo:', photo);

      // Make the POST request to the FastAPI endpoint.
      const response = await fetch(`${vision_url}analyze_body_image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Analysis Result:', result['body_measurements']);

      // Check if body_measurements is a plain string message
      if (typeof result['body_measurements'] === 'string' && !result['body_measurements'].includes('{')) {
        Alert.alert(
          'Analysis Result',
          result['body_measurements'],
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      // Validate if body_measurements is a valid JSON string with expected fields
      try {
        let measurements;
        if (typeof result['body_measurements'] === 'string') {
          measurements = JSON.parse(result['body_measurements']);
        } else {
          measurements = result['body_measurements'];
        }

        // Validate the required fields
        const requiredFields = ['weight_kg', 'body_fat_percentage', 'waist_circumference_cm', 'muscle_mass_kg'];
        const missingFields = requiredFields.filter(field => !(field in measurements));
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate that all values are numbers
        for (const field of requiredFields) {
          if (typeof measurements[field] !== 'number') {
            throw new Error(`Field ${field} must be a number`);
          }
        }

        // Check for null values
        const nullFields = requiredFields.filter(field => measurements[field] === null);
        if (nullFields.length > 0) {
          Alert.alert(
            'Unable to Estimate Measurements',
            'Please take a photo where your body measurements can be estimated via image. Make sure you are standing straight and the photo is well-lit.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }

        navigation.navigate('AnalysisResult', { analysis: result });
      } catch (error) {
        console.error('Invalid body measurements format:', error);
        Alert.alert(
          'Invalid Analysis Result',
          'The body measurements data is not in the expected format. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error analyzing photo:', error);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ArrowHeaderNew navigation={navigation} title="Preview Photo" />
      <View style={styles.guidelinesContainer}>
        <View style={styles.guidelinesHeader}>
          <Text style={styles.iconText}>✓</Text>
          <Text style={styles.guidelinesTitle}>Check Your Photo</Text>
        </View>
        <View style={styles.guidelinesList}>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Is your full body visible?</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Is the lighting good?</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Are you standing straight?</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Is the image clear and not blurry?</Text>
          </View>
        </View>
      </View>
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: `file://${photo.path}` }}
          style={styles.previewImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.analyzeButton]} 
          onPress={handleAnalyze}
        >
          <Text style={styles.buttonText}>📊 Analyze Body</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>📷 Take Another Photo</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  guidelinesContainer: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 24,
    color: '#FF6A00',
    marginRight: 10,
  },
  guidelinesTitle: {
    color: '#FF6A00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guidelinesText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#2C2C2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyzeButton: {
    backgroundColor: '#FF6A00',
  },
  backButton: {
    backgroundColor: '#333333',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
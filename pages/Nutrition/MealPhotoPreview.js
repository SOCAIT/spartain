import React, { useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Platform, Alert, Animated, ActivityIndicator } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { vision_url } from '../../config/config';
import { COLORS } from '../../constants';

export default function MealPhotoPreview({ route, navigation }) {
  const { photo } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAnalyzeMeal = async () => {
    setIsAnalyzing(true);
    
    try {
      // Create a FormData object and append the photo file
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${photo.path}`,
        name: 'meal.jpg',
        type: 'image/jpeg',
      });

      console.log('Uploading meal photo:', photo);

      // Make the POST request to the vision API endpoint for meal analysis
      const response = await fetch(`${vision_url}analyze_food_image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        let serverMessage = '';
        try {
          const errJson = await response.json();
          serverMessage = errJson.detail || JSON.stringify(errJson);
        } catch (_) {
          serverMessage = await response.text();
        }
        throw new Error(`Server Error ${response.status}: ${serverMessage}`);
      }

      const result = await response.json();
      console.log('Meal Analysis Result:', result);

      // Check if we got nutrition data
      if (result.nutrition_info) {
        const nutritionData = result.nutrition_info;
        
        // Validate nutrition data
        const requiredFields = ['calories', 'carbs', 'proteins', 'fats'];
        const missingFields = requiredFields.filter(field => !(field in nutritionData));
        
        if (missingFields.length > 0) {
          throw new Error(`Missing nutrition fields: ${missingFields.join(', ')}`);
        }

        // Navigate back to NutritionInput with the scanned meal data
        navigation.navigate('NutritionInput', {
          scannedMeal: {
            calories: parseFloat(nutritionData.calories) || 0,
            carbs: parseFloat(nutritionData.carbs) || 0,
            proteins: parseFloat(nutritionData.proteins) || 0,
            fats: parseFloat(nutritionData.fats) || 0,
          }
        });

        Alert.alert(
          'Meal Analyzed Successfully! 🎉',
          `We've detected your meal and estimated its nutrition values. The data has been filled in for you.`,
          [{ text: 'Great!', style: 'default' }]
        );

      } else if (result.message) {
        // Handle error messages from the API
        Alert.alert(
          'Analysis Failed',
          result.message,
          [
            { text: 'Try Again', onPress: () => navigation.goBack() },
            { text: 'Manual Entry', onPress: () => navigation.navigate('NutritionInput') }
          ]
        );
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error analyzing meal photo:', error);

      let message = 'An unexpected error occurred.';
      if (error.message.includes('Network request failed')) {
        message = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.startsWith('Server Error')) {
        message = error.message;
      }

      Alert.alert(
        'Analysis Failed',
        message,
        [
          { text: 'Try Again', onPress: () => navigation.goBack() },
          { text: 'Manual Entry', onPress: () => navigation.navigate('NutritionInput') }
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ArrowHeaderNew navigation={navigation} title="Preview Meal Photo" />
      
      <View style={styles.guidelinesContainer}>
        <View style={styles.guidelinesHeader}>
          <Text style={styles.iconText}>✓</Text>
          <Text style={styles.guidelinesTitle}>Check Your Meal Photo</Text>
        </View>
        <View style={styles.guidelinesList}>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Are all food items clearly visible?</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Is the lighting good and no shadows?</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.guidelinesText}>Is the entire meal captured in the frame?</Text>
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
          style={[styles.button, styles.analyzeButton, isAnalyzing && styles.disabledButton]} 
          onPress={handleAnalyzeMeal}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.buttonText}>Analyzing Meal...</Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonIcon}>🔍</Text>
              <Text style={styles.buttonText}>Analyze Nutrition</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.disclaimerNote}>
          <Text style={styles.disclaimerText}>
            ℹ️ AI nutrition analysis provides estimates based on visual recognition. Results may vary depending on preparation methods, portion sizes, and ingredients. Use as a starting point and adjust as needed.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => navigation.goBack()}
          disabled={isAnalyzing}
        >
          <Text style={styles.buttonIcon}>📷</Text>
          <Text style={styles.buttonText}>Take Another Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.skipButton]} 
          onPress={() => navigation.navigate('NutritionInput')}
          disabled={isAnalyzing}
        >
          <Text style={styles.buttonIcon}>✏️</Text>
          <Text style={styles.buttonText}>Skip & Enter Manually</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  guidelinesContainer: {
    backgroundColor: COLORS.lightDark,
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
    backgroundColor: COLORS.lightDark,
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
    gap: 12,
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
  skipButton: {
    backgroundColor: '#666666',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    fontSize: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerNote: {
    backgroundColor: COLORS.lightDark,
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  disclaimerText: {
    color: '#AAA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
}); 
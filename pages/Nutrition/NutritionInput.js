import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  FlatList, 
  Image,
  Alert,
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import SearchInput from '../../components/inputs/SearchInput';



const NutritionInputScreen = ({ navigation, route }) => {
  const [mealInput, setMealInput] = useState({
    calories: '',
    carbs: '',
    proteins: '',
    fats: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle scanned meal data from route params
  React.useEffect(() => {
    if (route.params?.scannedMeal) {
      const { scannedMeal } = route.params;
      setMealInput({
        calories: scannedMeal.calories?.toString() || '',
        carbs: scannedMeal.carbs?.toString() || '',
        proteins: scannedMeal.proteins?.toString() || '',
        fats: scannedMeal.fats?.toString() || '',
      });
    }
  }, [route.params]);

  // Validate input fields
  const validateInputs = () => {
    const newErrors = {};
    
    if (!mealInput.calories || isNaN(parseFloat(mealInput.calories))) {
      newErrors.calories = 'Please enter valid calories';
    }
    if (!mealInput.carbs || isNaN(parseFloat(mealInput.carbs))) {
      newErrors.carbs = 'Please enter valid carbs';
    }
    if (!mealInput.proteins || isNaN(parseFloat(mealInput.proteins))) {
      newErrors.proteins = 'Please enter valid proteins';
    }
    if (!mealInput.fats || isNaN(parseFloat(mealInput.fats))) {
      newErrors.fats = 'Please enter valid fats';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // When the user taps "Add Meal", pass the entered nutrition back to update the main screen
  const addMeal = () => {
    if (!validateInputs()) {
      Alert.alert('Validation Error', 'Please fill in all nutrition fields with valid numbers.');
      return;
    }

    const meal = {
      calories: parseFloat(mealInput.calories) || 0,
      carbs: parseFloat(mealInput.carbs) || 0,
      proteins: parseFloat(mealInput.proteins) || 0,
      fats: parseFloat(mealInput.fats) || 0,
    };
    navigation.navigate({
      name: 'NutritionPlan',
      params: { updatedNutrition: meal },
      merge: true,
    });
  };

  // Search for meals when the user types
  const searchMeals = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backend_url}meal-search/?search=${query}`);
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        Alert.alert('Search Error', 'Failed to search meals. Please check your connection and try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // When a meal from search results is selected, fill the input fields with its nutrition info
  const selectSearchResult = (meal) => {
    setMealInput({
      calories: meal.calories ? meal.calories.toString() : '',
      carbs: meal.carbs ? meal.carbs.toString() : '',
      proteins: meal.proteins ? meal.proteins.toString() : '',
      fats: meal.fats ? meal.fats.toString() : '',
    });
    setSearchResults([]);
    setSearchQuery('');
    setErrors({}); // Clear any validation errors
  };

  // Navigate to meal scanning camera
  const handleScanMeal = () => {
    navigation.navigate('MealScanCamera');
  };

  // Reset the input fields
  const handleReset = () => {
    setMealInput({
      calories: '',
      carbs: '',
      proteins: '',
      fats: '',
    });
    setSearchQuery('');
    setSearchResults([]);
    setErrors({});
  };

  const pressSearchItem = (item) => {
    selectSearchResult(item);
  };

  const renderSearchMealItem = ({ item }) => (
    <TouchableOpacity style={styles.mealSearchItem} onPress={() => pressSearchItem(item)}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/60x60/FF6A00/FFFFFF?text=🍽️' }} 
        style={styles.mealImage} 
        defaultSource={{ uri: 'https://via.placeholder.com/60x60/FF6A00/FFFFFF?text=🍽️' }}
      />
      <View style={styles.mealInfo}>
        <Text style={styles.mealName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionDetail}>Cal: {item.calories || 0}</Text>
          <Text style={styles.nutritionDetail}>C: {item.carbs || 0}g</Text>
          <Text style={styles.nutritionDetail}>P: {item.proteins || 0}g</Text>
          <Text style={styles.nutritionDetail}>F: {item.fats || 0}g</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderInputField = (label, field, placeholder, icon) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <View style={styles.inputLabelContainer}>
          <Text style={styles.inputIcon}>{icon}</Text>
          <Text style={styles.inputLabel}>{label}</Text>
        </View>
        <TextInput
          style={[styles.input, errors[field] && styles.inputError]}
          placeholder={placeholder}
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={mealInput[field]}
          onChangeText={(text) => {
            setMealInput({ ...mealInput, [field]: text });
            if (errors[field]) {
              setErrors({ ...errors, [field]: null });
            }
          }}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={"Add Nutrition Input"} />
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <SearchInput 
          placeholder="Search for meals..." 
          search={searchMeals} 
          results={searchResults}
          onSelect={pressSearchItem} 
          renderSearchResultItem={renderSearchMealItem}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FF6A00" />
            <Text style={styles.loadingText}>Searching meals...</Text>
          </View>
        )}
      </View>

      {/* Manual Input Fields with Labels */}
      <View style={styles.inputsSection}>
        <Text style={styles.sectionTitle}>Manual Entry</Text>
        {renderInputField('Calories', 'calories', 'Enter calories (kcal)', '🔥')}
        {renderInputField('Carbohydrates', 'carbs', 'Enter carbs (g)', '🌾')}
        {renderInputField('Proteins', 'proteins', 'Enter proteins (g)', '🥩')}
        {renderInputField('Fats', 'fats', 'Enter fats (g)', '🥑')}
      </View>

      {/* Buttons for scanning and resetting */}
      <View style={styles.buttonRow}>
        {/* <TouchableOpacity style={styles.button} onPress={handleScanMeal}>
          <Text style={styles.buttonIcon}>📷</Text>
          <Text style={styles.buttonText}>Scan Meal</Text>
        </TouchableOpacity> */}
         <TouchableOpacity style={[styles.button,styles.addButton]} onPress={addMeal}>
        <Text style={styles.addButtonText}>✅ Add Meal</Text>
      </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonIcon}>🔄</Text>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Add and Cancel Buttons */}
      {/* <TouchableOpacity style={styles.addButton} onPress={addMeal}>
        <Text style={styles.addButtonText}>✅ Add Meal</Text>
      </TouchableOpacity> */}
      <TouchableOpacity 
        style={[styles.addButton, styles.cancelButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.addButtonText}>❌ Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 10,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
  },
  inputsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6A00',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightDark,
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  mealSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.lightDark,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#FF6A00',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionDetail: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    gap: 10,
  },
  button: {
    backgroundColor: '#FF6A00',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6A00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#555',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NutritionInputScreen;
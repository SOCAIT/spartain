
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
  Alert 
} from 'react-native';
import axios from 'axios';
import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import SearchInput from '../../components/inputs/SearchInput';


const NutritionInputScreen = ({ navigation }) => {
  const [mealInput, setMealInput] = useState({
    calories: '',
    carbs: '',
    proteins: '',
    fats: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // When the user taps "Add Meal", pass the entered nutrition back to update the main screen
  const addMeal = () => {
    const meal = {
      calories: parseFloat(mealInput.calories) || 0,
      carbs: parseFloat(mealInput.carbs) || 0,
      proteins: parseFloat(mealInput.proteins) || 0,
      fats: parseFloat(mealInput.fats) || 0,
    };
    navigation.navigate('NutritionPlan', { updatedNutrition: meal });
  };

  // Search for meals when the user types
  const searchMeals = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      axios.get(`${backend_url}meal-search/?search=${query}`)
        .then(response => {
          setSearchResults(response.data);
        })
        .catch(() => {
          Alert.alert("Error", "Failed to fetch meals");
        });
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
  };

  // Simulate scanning a meal with the camera
  const handleScanMeal = () => {
    // In a real app you would open the camera, capture a photo, and send it to your backend.
    // Here we simulate with dummy data:
    const scannedData = {
      calories: '500',
      carbs: '50',
      proteins: '30',
      fats: '20',
    };
    setMealInput(scannedData);
    Alert.alert("Scan Complete", "Meal nutrition info retrieved from scan.");
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
  };

  const pressSearchItem = (item) => {
    selectSearchResult(item)
  }

  const renderSearchMealItem = ({ item }) => (
        <TouchableOpacity style={styles.mealSearchItem} onPress={() => pressSearchItem(item)}>
          <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text style={{ color: "#fff" }}>{item.name}</Text>
            <Text style={{ color: "#fff" }}>Calories: {item.calories} kcal</Text>
          </View>
        </TouchableOpacity>
      );

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={"Add Nutrition Input"} />
      {/* Search Input */}
      <SearchInput placeholder="Search meals" search={searchMeals} 
        results={searchResults}
        onSelect={pressSearchItem} renderSearchResultItem={renderSearchMealItem} />
      {/* {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.searchResultItem} 
              onPress={() => selectSearchResult(item)}
            >
              <Text style={styles.searchResultText}>
                {item.name} - {item.calories} kcal
              </Text>
            </TouchableOpacity>
          )}
        />
      )} */}

      {/* Manual Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Calories"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={mealInput.calories}
        onChangeText={(text) => setMealInput({ ...mealInput, calories: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={mealInput.carbs}
        onChangeText={(text) => setMealInput({ ...mealInput, carbs: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Proteins (g)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={mealInput.proteins}
        onChangeText={(text) => setMealInput({ ...mealInput, proteins: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Fats (g)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={mealInput.fats}
        onChangeText={(text) => setMealInput({ ...mealInput, fats: text })}
      />

      {/* Buttons for scanning and resetting */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleScanMeal}>
          <Text style={styles.buttonText}>Scan Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Add and Cancel Buttons */}
      <TouchableOpacity style={styles.addButton} onPress={addMeal}>
        <Text style={styles.addButtonText}>Add Meal</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.addButton, styles.cancelButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.addButtonText}>Cancel</Text>
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
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: COLORS.lightDark,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  searchResultItem: {
    padding: 10,
    backgroundColor: COLORS.lightDark,
    borderRadius: 5,
    marginBottom: 5,
  },
  searchResultText: {
    color: '#fff',
  },
  input: {
    backgroundColor: COLORS.lightDark,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF6A00',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FF6A00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#555',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default NutritionInputScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Platform, 
  TouchableOpacity, 
  Text,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';

const SearchInput = ({ 
  search, 
  results, 
  onSelect, 
  renderSearchResultItem, 
  placeholder="Search Exercises, Workouts",
  categories = ["Exercises", "Workouts", "Meals"]
}) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (results && results.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [results]);

  const onChangeText = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      search(text);
    } else {
      setShowResults(false);
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setSearchText('');
    setShowResults(false);
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setSearchText('');
    setShowResults(false);
    Keyboard.dismiss();
  };

  // Handle results based on input type
  const categorizedResults = Array.isArray(results)
    ? { [categories[0]]: results }
    : results || {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <MaterialIcons name="search" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholderTextColor={COLORS.lightGray3}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={searchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialIcons name="close" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results Container */}
        {showResults && results && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <ScrollView style={styles.resultsScroll}>
              {categories.map((category) => {
                const categoryResults = categorizedResults[category] || [];
                if (!categoryResults.length) return null;
                
                return (
                  <View key={category} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    {categoryResults.slice(0, 4).map((item, index) => (
                      <TouchableOpacity 
                        key={item.id || index}
                        onPress={() => handleSelect(item)}
                        style={styles.resultItem}
                      >
                        {renderSearchResultItem({ item, index })}
                      </TouchableOpacity>
                    ))}
                    {categoryResults.length > 4 && (
                      <TouchableOpacity 
                        style={styles.viewMoreRow} 
                        onPress={() => {
                          Keyboard.dismiss();
                          /* Implement view more action */
                        }}
                      >
                        <Text style={styles.viewMoreText}>Tap to view more {category} results</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    zIndex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    padding: 0,
  },
  icon: {
    fontSize: 30,
    color: COLORS.darkOrange,
    marginRight: 10,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.darkOrange,
    marginLeft: 10,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 10,
    right: 10,
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    padding: 10,
    maxHeight: 500,
    zIndex: 2,
    elevation: 5,
    shadowColor: '000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.50,
    shadowRadius: 3.84,
  },
  resultsScroll: {
    maxHeight: 450,
  },
  categorySection: {
    marginBottom: 20,
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    padding: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkOrange,
    marginBottom: 5,
    backgroundColor: COLORS.dark,
    paddingVertical: 5,
  },
  resultItem: {
    borderBottomColor: '#ccc',
    backgroundColor: COLORS.dark,
  },
  viewMoreRow: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    marginTop: 5,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.darkOrange,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default SearchInput;
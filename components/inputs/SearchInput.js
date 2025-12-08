import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS, SIZES } from '../../constants';

/**
 * Enhanced SearchInput with modern glass effect styling
 */
const SearchInput = ({ 
  search, 
  results, 
  onSelect, 
  renderSearchResultItem, 
  placeholder = "Search Exercises, Workouts",
  categories = ["Exercises", "Workouts", "Meals"]
}) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation for focus state
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

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

  // Animated border color
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.darkBorder, COLORS.darkOrange],
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Search Bar */}
        <Animated.View 
          style={[
            styles.searchRow,
            { borderColor },
            isFocused && styles.searchRowFocused,
          ]}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name="search" 
              size={22} 
              color={isFocused ? COLORS.darkOrange : COLORS.textMuted} 
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholderTextColor={COLORS.textMuted}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={searchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch} 
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Results Container */}
        {showResults && results && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <ScrollView 
              style={styles.resultsScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {categories.map((category) => {
                const categoryResults = categorizedResults[category] || [];
                if (!categoryResults.length) return null;
                
                return (
                  <View key={category} style={styles.categorySection}>
                    {/* Category Header */}
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryDot} />
                      <Text style={styles.categoryTitle}>{category}</Text>
                      <Text style={styles.categoryCount}>{categoryResults.length}</Text>
                    </View>
                    
                    {/* Results */}
                    {(expandedCategories[category] ? categoryResults : categoryResults.slice(0, 4)).map((item, index) => (
                      <TouchableOpacity 
                        key={item.id || index}
                        onPress={() => handleSelect(item)}
                        style={styles.resultItem}
                        activeOpacity={0.7}
                      >
                        {renderSearchResultItem({ item, index })}
                      </TouchableOpacity>
                    ))}
                    
                    {/* View More */}
                    {categoryResults.length > 4 && !expandedCategories[category] && (
                      <TouchableOpacity 
                        style={styles.viewMoreRow} 
                        onPress={() => {
                          Keyboard.dismiss();
                          setExpandedCategories(prev => ({ ...prev, [category]: true }));
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.viewMoreText}>
                          View {categoryResults.length - 4} more results
                        </Text>
                        <MaterialIcons name="expand-more" size={16} color={COLORS.darkOrange} />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 100,
  },
  
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
  },
  
  searchRowFocused: {
    ...SHADOWS.glowSm,
  },
  
  iconContainer: {
    marginRight: 12,
  },
  
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    padding: 0,
    fontWeight: '500',
  },
  
  clearButton: {
    padding: 4,
    backgroundColor: COLORS.darkElevated,
    borderRadius: 12,
    marginLeft: 8,
  },
  
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    marginTop: 8,
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    maxHeight: 500,
    zIndex: 200,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.lg,
  },
  
  resultsScroll: {
    maxHeight: 450,
  },
  
  categorySection: {
    marginBottom: 16,
  },
  
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkBorder,
  },
  
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.darkOrange,
    marginRight: 8,
  },
  
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  categoryCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    backgroundColor: COLORS.darkElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  
  resultItem: {
    borderRadius: SIZES.radiusSm,
    marginBottom: 2,
    overflow: 'hidden',
  },
  
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.orangeMuted,
    borderRadius: SIZES.radiusSm,
    marginTop: 8,
  },
  
  viewMoreText: {
    fontSize: 13,
    color: COLORS.darkOrange,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default SearchInput;

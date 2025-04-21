import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  TextInput, 
  StyleSheet, 
  Platform, 
  TouchableOpacity, 
  Text,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';

const SearchInput = ({ search, results, onSelect, renderSearchResultItem, placeholder="Search Exercises, Workouts" }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Update modal visibility based on results availability.
  useEffect(() => {
    if (results && (Array.isArray(results) ? results.length > 0 : Object.keys(results).length > 0)) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [results]);

  const onChangeText = (text) => {
    setSearchText(text);
    search(text);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setModalVisible(false);
  };

  // If results is an array, assume a default category "Exercises"
  const categorizedResults = Array.isArray(results)
    ? { "Exercises": results }
    : results;

  return (
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
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialIcons name="close" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for search results */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Modal Header with title and cancel button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Results</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.resultsScroll}>
              {Object.keys(categorizedResults).map((category) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {categorizedResults[category].slice(0,5).map((item, index) => (
                    <TouchableOpacity 
                      key={item.id}
                      onPress={() => handleSelect(item)}
                      style={styles.resultItem}
                    >
                      {renderSearchResultItem({ item, index })}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.viewMoreRow} onPress={() => {/* Implement view more action */}}>
                    <Text style={styles.viewMoreText}>Tap to view more {category} results</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
  },
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 10,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkOrange,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.darkOrange,
  },
  resultsScroll: {
    // Additional styling if needed
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkOrange,
    marginBottom: 5,
  },
  resultItem: {
    //paddingVertical: 10,
    //borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  viewMoreRow: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.darkOrange,
  },
});

export default SearchInput;
// This component is generic search input component that can be used in any screen.
// It has a text input and a search icon, and below a dropdown of search results.
// Use StyleSheet to style the text input and icon.
// use specific padding, spacing and margin according to platform( ios, android)
// When the user types in the text input, it calls the search function passed as a prop.
// The search function should return an array of items that will be displayed in the dropdown.
// When the user selects an item from the dropdown, the onSelect function is called with the selected item.
// for e.g
// const searchExercises = (query) => {
    // if (query.length > 2) {
    //     axios.get(backend_url + `exercises-search/?search=${query}`)
    //       .then((response) => {
    //         setExerciseSearchResults(response.data);
    //         setIsModalVisible(true);  // Show the modal when results are available
    //       });
    //   } else {
    //     setExerciseSearchResults([]); // Clear results if query is too short
    //     setIsModalVisible(false);
    //   }
    // };

// <SearchInput
//     placeholder="Search exercises"
//     search={searchExercises}
//     onSelect={selectExercise}
// />
//

import { View, Text, StyleSheet,TextInput, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SearchInput = (
    {
        search,
        results,
        onSelect,
        renderSearchResultItem,
    }
) => {


  return (
    
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <MaterialIcons name="search" style={styles.icon} />
        <TextInput
            style={styles.input}
            placeholderTextColor={COLORS.lightDark}
            placeholder="Search Exercise"
            onChangeText={search}
            
        />
      </View>
        {results && results.length > 0 && (
            <View style={styles.resultsDropdown}>
            {results.map((item, index) => (
                <TouchableOpacity
                key={item.id}
                onPress={() => onSelect(item)}
                >
                {renderSearchResultItem({item, index})}
                </TouchableOpacity>
            ))}
            </View>
        )}

    </View>

    
  )
}

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
    resultsDropdown: {
        position: 'absolute',
        top: 60,
        left: 10,
        right: 10,
        backgroundColor: COLORS.light,
        borderRadius: 10,
        padding: 10,
    },

    input: {
        flex: 1,
        color: COLORS.white,
        fontSize: 16,
        padding: 0,
    },
    icon: {
        fontSize: 20,
        color: COLORS.darkOrange,
    },

    })
export default SearchInput
import React, { useState, useEffect, useContext } from 'react';


import { View, Text,TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import StylishCard from '../../components/StylishCard';
import { useNavigation } from '@react-navigation/native';

import { backend_url } from '../../config/config';
import { COLORS } from '../../constants';
import ArrowHeader from '../../components/ArrowHeader';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import WokroutCardNew from '../../components/workouts/WokroutCardNew';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import SearchInput from '../../components/inputs/SearchInput';

import { AuthContext } from '../../helpers/AuthContext';

import axios from 'axios';
import { set } from 'react-hook-form';
import Video from 'react-native-video';



const ExerciseSearch = () => {
  const navigation = useNavigation();
  const {authState} = useContext(AuthContext)


  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  
  const navigateToExerciseDetails = (exercise) => {
      navigation.navigate('ExerciseDetails', { exercise });
  }; 

  const getVideoSource = (item) => {
    if (authState.gender === 'M' && item.male_video) {
      return item.male_video;
    } else if (authState.gender === 'F' && item.female_video) {
      return item.female_video;
    }
    return item.gif; // Fallback to gif if no gender-specific video
  }; 

  const renderExerciseItem = ({ item, index }) => (
      <View style={styles.addedExerciseItem}>
        <View style={styles.imageWrapper}>
          {getVideoSource(item).includes('.mp4') || getVideoSource(item).includes('.mov') ? (
            <Video
              source={{ uri: getVideoSource(item) }}
              style={styles.gifImage}
              resizeMode="cover"
              repeat={true}
              muted={true}
              paused={true} // Pause by default in search results to avoid crash
              // mixWithOthers={true}
              onError={(e) => console.log('Video loading error:', e)}
            />
          ) : (
            <Image 
              source={{ uri: getVideoSource(item) }} 
              style={styles.gifImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
          )}
        </View>
        <View style={styles.exerciseDetailsContainer}>
          <Text style={styles.exerciseText}>{item.name}</Text>
          <View style={styles.setsRepsContainer}>
            <View style={styles.smallInputContainer}>
              <Text style={styles.exerciseTitle}>Sets</Text>
              <TextInput
                style={styles.smallInputAdded}
                placeholder="Sets"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={item.sets}
                onChangeText={(text) => updateExercise(index, 'sets', text)}
              />
            </View>
  
            <View style={styles.smallInputContainer}>
              <Text style={styles.exerciseTitle}>Reps</Text>
              <TextInput
                style={styles.smallInputAdded}
                placeholder="Reps"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={item.reps}
                onChangeText={(text) => updateExercise(index, 'reps', text)}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeExercise(index)}>
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  
    const renderSearchExerciseItem = ({ item, index }) => {
      if (!item) return null; // Skip rendering if item is null
      return(
      <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => pressSearchItem(item)}>
         <View style={styles.searchImageWrapper}>
          {getVideoSource(item).includes('.mp4') || getVideoSource(item).includes('.mov') ? (
            <Video
              source={{ uri: getVideoSource(item) }}
              style={styles.gifImage}
              resizeMode="cover"
              repeat={true}
              muted={true}
              paused={true} // Pause by default in search results to avoid crash
              // mixWithOthers={true}
              onError={(e) => console.log('Video loading error:', e)}
            />
          ) : (
            <Image 
              source={{ uri: getVideoSource(item) }} 
              style={styles.gifImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
          )}
        </View>
        <Text style={styles.exerciseText}>
          {item.name}
        </Text>
      </TouchableOpacity>
      )
  };

    const pressSearchItem = (item) => {
      setSelectedExercise(item);
      setExerciseSearchResults([]);
      navigateToExerciseDetails(item);
      
    }

    const searchExercises = (query) => {
      if (query.length > 2) {
        axios.get(backend_url + `exercises-search/?search=${query}`)
          .then((response) => {
            setExerciseSearchResults(response.data.results);
          })
          .catch((error) => {
            console.error('Search error:', error);
            Alert.alert('Error', 'Failed to search exercises. Please try again.');
          });
      } else {
        setExerciseSearchResults([]); // Clear results if query is too short
      }
    };
  
    
   
    return (
      <View style={styles.container}>
        <ArrowHeaderNew navigation={navigation} title={"Find an Exercise"} paddingTop={10} />
        {/* <Text style={styles.header}>{workout.name}</Text> */}

        <SearchInput placeholder="Search exercises" search={searchExercises} 
        results={exerciseSearchResults}
        onSelect={pressSearchItem} renderSearchResultItem={renderSearchExerciseItem} />
        
        {/* view selected exercise */}
        {/* {selectedExercise && (
          <View style={styles.selectedExercise}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedExercise.gif }} style={styles.gifImage} />
            </View>
            <Text style={styles.instructionText}>{selectedExercise.instructions}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigateToExerciseDetails(selectedExercise)}>
              <Text style={styles.buttonText}>View Exercise Details</Text>
            </TouchableOpacity>
          </View>
        )} */}
  
        {/* view added exercises */}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.dark,
      paddingTop: Platform.OS === 'ios' ? 45 : 10,
      paddingHorizontal:  Platform.OS === 'ios' ? 20 : 10,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    exerciseTouchable: {
      marginBottom: 10,
    },
  
    imageContainer: {
      borderRadius: 10,
      overflow: 'hidden', // Ensure the image is properly clipped to the border radius
      width: '80%', // Set equal width and height for a perfect circle
      height: 200,
      marginBottom: 20,
    },
    gifImage: {
      // width: 300,
      // height: 200,
      // marginBottom: 20,
  
      flex: 1,
      width: null,
      height: null,
      // borderRadius: 20
      //borderRadius: 100, // Make the border circular
    },
    // gifImage: {
    //   width: '100%',
    //   height: 200,
    //   marginBottom: 10,
    // },
    instructionText: {
      fontSize: 16,
      color: '#333',
    },
  
  
  
    card: {
      marginVertical: 10,
      backgroundColor: '#2b2b2b',
      borderRadius: 10,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 4,
    },
    cardContent: {
      paddingHorizontal: 10,
    },
    exerciseTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    exerciseDetails: {
      fontSize: 16,
      color: '#ccc',
      marginVertical: 10,
    },
    button: {
      backgroundColor: '#4caf50',
      borderRadius: 5,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },

    exerciseSearchItem: {
      flexDirection: 'row',
      backgroundColor: '#2b2b2b',
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
    },
    imageWrapper: {
      width: 60,
      height: 60,
      borderRadius: 8, // Adjust the radius to make the image rounded
      overflow: 'hidden', // Ensures the image respects the borderRadius
    },
    searchImageWrapper: {
      width: 60,
      height: 60,
      borderRadius: 8, // Adjust the radius to make the image rounded
      overflow: 'hidden', // Ensures the image respects the borderRadius
    },
    gifImage: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
    },
    gifImage: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
    },
    exerciseText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 10,
      flex: 1,
    },
    exerciseTitle: {
      color: '#fff',
      fontSize: 14,
      marginBottom: 5,
    },
  });
  
  export default ExerciseSearch;

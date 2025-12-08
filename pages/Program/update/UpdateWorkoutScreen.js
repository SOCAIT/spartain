import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Image, Platform} from 'react-native';
import axios from 'axios';
import { COLORS, SIZES } from '../../../constants';
import { backend_url } from '../../../config/config';
import ArrowHeaderNew from '../../../components/ArrowHeaderNew';
import { AuthContext } from '../../../helpers/AuthContext';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
// import SearchInput from '../../../components/SearchInput';

const UpdateWorkoutScreen = ({ route}) => {
  const { workout } = route.params;
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [exercises, setExercises] = useState(workout.workoutexerciseSet);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: '', reps: '' });
  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateWorkoutAPI = async () => {
    if (workoutName && exercises.length > 0) {
      const updatedWorkout = { name: workoutName, exercises, id: workout.id };
      try {
        const response = await axios.put(`${backend_url}/workouts/${workout.id}/`, updatedWorkout);
        if (response.status === 200) {
          Alert.alert('Success', 'Workout updated successfully');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update workout. Please try again.');
        console.error('Error updating workout:', error);
      }
    } else {
      Alert.alert('Error', 'Please enter a workout name and add at least one exercise');
    }
  };

  const addExercise = () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({ name: '', sets: '', reps: '' });
      setIsModalVisible(false);  // Close the modal
    } else {
      Alert.alert('Error', 'Please fill out all exercise details');
    }
  };

  const removeExercise = (exerciseIndex) => {
    setExercises(exercises.filter((_, i) => i !== exerciseIndex));
  };

  const updateExercise = (exerciseIndex, field, value) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === exerciseIndex ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updatedExercises);
  };

  const searchExercises = (query) => {
    if (query.length > 2) {
      axios.get(backend_url + `exercises-search/?search=${query}`)
        .then((response) => {
          setExerciseSearchResults(response.data.results);
          setIsModalVisible(true);  // Show the modal when results are available
        })
        .catch((error) => {
          console.error('Search error:', error);
          Alert.alert('Error', 'Failed to search exercises. Please try again.');
        });
    } else {
      setExerciseSearchResults([]); // Clear results if query is too short
      setIsModalVisible(false);
    }
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
        {getVideoSource(item.exercise).includes('.mp4') || getVideoSource(item.exercise).includes('.mov') ? (
          <Video
            source={{ uri: getVideoSource(item.exercise) }}
            style={styles.gifImage}
            resizeMode="cover"
            repeat={true}
            muted={true}
            paused={false}
            mixWithOthers={true}
            onError={(e) => console.log('Video loading error:', e)}
          />
        ) : (
          <Image 
            source={{ uri: getVideoSource(item.exercise) }} 
            style={styles.gifImage}
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        )}
      </View>
      <View style={styles.exerciseDetailsContainer}>
        <Text style={styles.exerciseText}>{item.exercise.name}</Text>
        <View style={styles.setsRepsContainer}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.exerciseTitle}>Sets</Text>
            <TextInput
              style={styles.smallInputAdded}
              placeholder="Sets"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={item.suggestedSets}
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
              value={item.suggestedReps}
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

  const renderSearchExerciseItem = ({ item, index }) => (
    <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => pressSearchItem(item)}>
      <View style={styles.searchImageWrapper}>
        {getVideoSource(item).includes('.mp4') || getVideoSource(item).includes('.mov') ? (
          <Video
            source={{ uri: getVideoSource(item) }}
            style={styles.gifImage}
            resizeMode="cover"
            repeat={true}
            muted={true}
            paused={false}
            mixWithOthers={true}
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
  );

  const pressSearchItem = (item) => {
    setCurrentExercise({ ...currentExercise, name: item.name, id: item.id, gif: item.gif });
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={"Update Workout"} />

      {/* <Text style={styles.title}>Update Workout: {workout.name}</Text> */}

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        placeholderTextColor="#aaa"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Exercise Name"
          placeholderTextColor="#aaa"
          value={currentExercise.name}
          onChangeText={(text) => {
            setCurrentExercise({ ...currentExercise, name: text });
            searchExercises(text);
          }}
        />
        <TextInput
          style={[styles.input, styles.smallInputNumber]}
          placeholder="Sets"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={currentExercise.sets}
          onChangeText={(text) => setCurrentExercise({ ...currentExercise, sets: text })}
        />
        <TextInput
          style={[styles.input, styles.smallInputNumber]}
          placeholder="Reps"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={currentExercise.reps}
          onChangeText={(text) => setCurrentExercise({ ...currentExercise, reps: text })}
        />

        <TouchableOpacity style={styles.addButton} onPress={addExercise}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isModalVisible && (
        <View style={styles.modalContainer}>
          <FlatList
            data={exerciseSearchResults}
            renderItem={renderSearchExerciseItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.exerciseList}
          />
        </View>
      )}

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.exerciseList}
      />

      <TouchableOpacity style={styles.saveButton} onPress={updateWorkoutAPI}>
        <Text style={styles.buttonText}>Update Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: Platform.OS == 'ios' ? 40: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
    textAlign: 'center',
  },
  smallInputNumber: {
    marginRight: 10,
    height: 50,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseList: {
    marginTop: 20,
  },
  addedExerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2b2b2b',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 120,
  },
  exerciseDetailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  setsRepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  smallInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  smallInputAdded: {
    color: COLORS.white,
    backgroundColor: '#333',
    borderRadius: 5,
    textAlign: 'center',
    width: '80%',
    height: 40,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalContainer: {
    backgroundColor: '#2b2b2b',
    borderRadius: 5,
    marginTop: -10,
    padding: 10,
    maxHeight: 500,
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  searchImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8, // Adjust the radius to make the image rounded
    overflow: 'hidden', // Ensures the image respects the borderRadius
  },
});

export default UpdateWorkoutScreen;

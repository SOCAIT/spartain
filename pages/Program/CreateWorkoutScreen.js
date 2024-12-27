import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import { backend_url } from '../../config/config';
import axios from 'axios';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import IconButton from '../../components/IconButton';

const CreateWorkoutScreen = ({ route, navigation }) => {
  const { day, existingWorkout, updateWorkout } = route.params;
  const [workoutName, setWorkoutName] = useState(existingWorkout?.name || '');
  const [exercises, setExercises] = useState(existingWorkout?.exercises || []);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: '', reps: '' });
  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const saveWorkoutAndGoBack = () => {
    if (workoutName && exercises.length > 0) {
      const workout = { name: workoutName, exercises, type: 'workout' };
      updateWorkout(day, workout);
      console.log(workout)
      navigation.goBack();
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
          setExerciseSearchResults(response.data);
          setIsModalVisible(true);  // Show the modal when results are available
        });
    } else {
      setExerciseSearchResults([]); // Clear results if query is too short
      setIsModalVisible(false);
    }
  };

  const renderExerciseItem = ({ item, index }) => (
    <View style={styles.addedExerciseItem}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.gif }} style={styles.gifImage} />
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

  const renderSearchExerciseItem = ({ item, index }) => (
    <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => pressSearchItem(item)}>
       <View style={styles.searchImageWrapper}>
        <Image source={{ uri: item.gif }} style={styles.gifImage} />
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
      <ArrowHeaderNew navigation={navigation} />

      <Text style={styles.title}>Create Workout for {day}</Text>

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

        {/* <TouchableOpacity style={styles.addButton} onPress={addExercise}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity> */}

        <IconButton name='add' onPress={addExercise} />
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

      <TouchableOpacity style={styles.saveButton} onPress={saveWorkoutAndGoBack}>
        <Text style={styles.buttonText}>Save Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
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
    backgroundColor: COLORS.darkOrange,
    fontSize:15,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default CreateWorkoutScreen;

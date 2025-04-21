import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { backend_url } from '../../config/config';
import axios from 'axios';
import { COLORS } from '../../constants';
import IconButton from '../../components/IconButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please enter a workout name and add at least one exercise');
    }
  };

  const addExercise = () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({ name: '', sets: '', reps: '' });
      setIsModalVisible(false);
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
      setIsModalVisible(true);
      axios.get(backend_url + `exercises-search/?search=${query}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            setExerciseSearchResults(response.data);
          } else {
            setExerciseSearchResults([]);
          }
        })
        .catch((error) => {
          console.error('Search error:', error);
          setExerciseSearchResults([]);
          Alert.alert('Error', 'Failed to search exercises. Please try again.');
        });
    } else {
      setExerciseSearchResults([]);
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
        <MaterialIcons name="delete" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.exerciseSearchItem} 
      onPress={() => {
        if (item && item.name && item.id && item.gif) {
          pressSearchItem(item);
        }
      }}
    >
      <View style={styles.searchImageWrapper}>
        {item.gif ? (
          <Image 
            source={{ uri: item.gif }} 
            style={styles.gifImage}
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={[styles.gifImage, { backgroundColor: '#333' }]} />
        )}
      </View>
      <Text style={styles.exerciseText}>{item.name || 'Unknown Exercise'}</Text>
    </TouchableOpacity>
  );

  const pressSearchItem = (item) => {
    try {
      if (item && item.name && item.id && item.gif) {
        setCurrentExercise({ 
          ...currentExercise, 
          name: item.name, 
          id: item.id, 
          gif: item.gif 
        });
        setIsModalVisible(false);
      } else {
        Alert.alert('Error', 'Invalid exercise data. Please try again.');
      }
    } catch (error) {
      console.error('Error selecting exercise:', error);
      Alert.alert('Error', 'Failed to select exercise. Please try again.');
    }
  };

  const renderHeader = () => (
    <View style={styles.contentContainer}>
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        placeholderTextColor="#aaa"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <View style={styles.exerciseInputContainer}>
        <TextInput
          style={[styles.input, styles.exerciseInput]}
          placeholder="Search Exercise"
          placeholderTextColor="#aaa"
          value={currentExercise.name}
          onChangeText={(text) => {
            setCurrentExercise({ ...currentExercise, name: text });
            searchExercises(text);
          }}
        />
        <View style={styles.setsRepsInputContainer}>
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
        </View>
        <IconButton name="add" onPress={addExercise} style={styles.addButton} />
      </View>

      {isModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Results</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={exerciseSearchResults}
            renderItem={renderSearchExerciseItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.exerciseList}
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity style={styles.saveButton} onPress={saveWorkoutAndGoBack}>
      <Text style={styles.saveButtonText}>Save Workout</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.gradient}>
        <ArrowHeaderNew navigation={navigation} title={`Create Workout for ${day}`} />

        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'ios' ? 35 : 10,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  listContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  exerciseInputContainer: {
    marginBottom: 20,
  },
  exerciseInput: {
    marginBottom: 10,
  },
  setsRepsInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  smallInputNumber: {
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseList: {
    marginTop: 10,
  },
  addedExerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  gifImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  exerciseDetailsContainer: {
    flex: 1,
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setsRepsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  smallInputContainer: {
    flex: 1,
  },
  exerciseTitle: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  smallInputAdded: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateWorkoutScreen;

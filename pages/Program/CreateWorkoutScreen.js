import React, { useState, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { backend_url } from '../../config/config';
import axios from 'axios';
import { COLORS } from '../../constants';
import IconButton from '../../components/IconButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../helpers/AuthContext';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce';

const CreateWorkoutScreen = ({ route }) => {
  const { day, existingWorkout, updateWorkout } = route.params;
  const { authState }          = useContext(AuthContext);
  const navigation             = useNavigation();

  const [workoutName, setWorkoutName]           = useState(existingWorkout?.name       || '');
  const [exercises,   setExercises]             = useState(existingWorkout?.exercises || []);
  const [currentExercise, setCurrentExercise]   = useState({ name: '', sets: '', reps: '' });
  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible]     = useState(false);

  // ---------- refs ----------
  const searchInputRef = useRef(null);

  // ---------- helpers ----------
  const clearSearch = () => {
    setExerciseSearchResults([]);
    setIsModalVisible(false);
  };

  const pressSearchItem = useCallback((item) => {
    setCurrentExercise({
      ...currentExercise,
      name:  item.name,
      id:    item.id,
      video:   item.male_video || item.female_video || item.gif,
    });
    clearSearch();
    // keep keyboard visible so user can enter sets/reps immediately
    searchInputRef.current?.focus();
  }, [currentExercise]);

  // Add debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length <= 2) {
        clearSearch();
        return;
      }
      setIsModalVisible(true);
      axios
        .get(`${backend_url}exercises-search/?search=${query}`)
        .then((res) => {
          //console.log('res.data', res.data);
          Array.isArray(res.data.results)
            ? setExerciseSearchResults(res.data.results)
            : setExerciseSearchResults([]);
        })
        .catch((err) => {
          console.error('Search error:', err);
          clearSearch();
          Alert.alert('Error', 'Failed to search exercises. Please try again.');
        });
    }, 300),
    []
  );

  const searchExercises = (query) => {
    setCurrentExercise({ ...currentExercise, name: query });
    debouncedSearch(query);
    console.log('searchExercises', exerciseSearchResults);
  };

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
      clearSearch();
    } else {
      Alert.alert('Error', 'Please fill out all exercise details');
    }
  };

  const removeExercise = (exerciseIndex) => {
    setExercises(exercises.filter((_, i) => i !== exerciseIndex));
  };

  const updateExercise = (exerciseIndex, field, value) => {
    const updatedExercises = exercises.map((exe, i) =>
      i === exerciseIndex ? { ...exe, [field]: value } : exe
    );
    setExercises(updatedExercises);
  };

  const getVideoSource = (item) => {
    if (!item) return ''; // Safely handle undefined items
    if (authState.gender === 'M' && item.male_video) return item.male_video;
    if (authState.gender === 'F' && item.female_video) return item.female_video;
    return item.gif || ''; // Return empty string if gif is undefined
  };

  // ---------- renderers ----------
  const renderExerciseItem = ({ item, index }) => (
    <View style={styles.addedExerciseItem}>
      <View style={styles.imageWrapper}>
        {item && getVideoSource(item) && (getVideoSource(item).includes('.mp4') || getVideoSource(item).includes('.mov')) ? (
          <Video
            source={{ uri: getVideoSource(item) }}
            style={styles.gifImage}
            resizeMode="cover"
            repeat
            muted
            paused={false}
            mixWithOthers={true}
            onError={(e) => console.log('Video loading error:', e)}
          />
        ) : (
          <Image 
            source={{ uri: getVideoSource(item) || 'https://via.placeholder.com/150' }} 
            style={styles.gifImage}
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        )}
      </View>
      <View style={styles.exerciseDetailsContainer}>
        <Text style={styles.exerciseText}>{item?.name || 'Unknown Exercise'}</Text>
        <View style={styles.setsRepsContainer}>
          <View style={styles.smallInputContainer}>
            <Text style={styles.exerciseTitle}>Sets</Text>
            <TextInput
              style={styles.smallInputAdded}
              placeholder="Sets"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={item?.sets || ''}
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
              value={item?.reps || ''}
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
    <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => item && pressSearchItem(item)}>
      <View style={styles.searchImageWrapper}>
        {item?.gif ? (
          (getVideoSource(item).includes('.mp4') || getVideoSource(item).includes('.mov')) ? (
            <Video
              source={{ uri: getVideoSource(item) }}
              style={styles.gifImage}
              resizeMode="cover"
              repeat
              muted
              paused={false}
              onError={(e) => console.log('Video loading error:', e)}
            />
          ) : (
            <Image 
              source={{ uri: getVideoSource(item) }} 
              style={styles.gifImage}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
          )
        ) : (
          <View style={[styles.gifImage, { backgroundColor: '#333' }]} />
        )}
      </View>
      <Text style={styles.exerciseText}>{item?.name || 'Unknown Exercise'}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.contentContainer}>
      {/* workout name */}
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        placeholderTextColor="#aaa"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      {/* search + sets + reps */}
      <View style={styles.exerciseInputContainer}>
        <TextInput
          ref={searchInputRef}
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

      {/* search results */}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Results</Text>
              <TouchableOpacity onPress={clearSearch}>
                <MaterialIcons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={exerciseSearchResults}
              renderItem={renderSearchExerciseItem}
              keyExtractor={(item) => (item?.id || Math.random()).toString()}
              style={styles.exerciseList}
              keyboardShouldPersistTaps="always"
              maxHeight={300}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <TouchableOpacity style={styles.saveButton} onPress={saveWorkoutAndGoBack}>
      <Text style={styles.saveButtonText}>Save Workout</Text>
    </TouchableOpacity>
  );

  // ---------- JSX ----------
  return (
    <View
      style={styles.container}
      /* iOS only → padding keeps TextInput above keyboard.
         No behavior on Android prevents the flicker / auto‑dismiss. */
      // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.gradient}>
        <ArrowHeaderNew navigation={navigation} title={`Create Workout for ${day}`} />
        {renderHeader()}

        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(_, idx) => idx.toString()}  // fine for user‑added list
          // ListHeaderComponent={renderHeader}
          // ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        />
        {renderFooter()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* ————————————————— APP BACKGROUND ————————————————— */
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'ios' ? 35 : 10,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  listContent: { paddingBottom: 20 },

  /* ————————————————— INPUTS / MODALS ————————————————— */
  contentContainer: { padding: 20 },
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
  exerciseInputContainer: { marginBottom: 20 },
  exerciseInput: { marginBottom: 10 },
  setsRepsInputContainer: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  smallInputNumber: { flex: 1, textAlign: 'center' },

  addButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  modalOverlay: {
    position: 'absolute',
    top: 180, // Adjust this value to position the modal higher or lower
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#444',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  exerciseList: { 
    maxHeight: 300,
  },

  /* ————————————————— ADDED EXERCISE CHIP ————————————————— */
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
  gifImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  exerciseDetailsContainer: { flex: 1 },
  exerciseText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  setsRepsContainer: { flexDirection: 'row', gap: 10 },
  smallInputContainer: { flex: 1 },
  exerciseTitle: { color: '#aaa', fontSize: 12, marginBottom: 5 },
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

  /* ————————————————— SEARCH RESULT ROW ————————————————— */
  exerciseSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  searchImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },

  /* ————————————————— SAVE BUTTON ————————————————— */
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CreateWorkoutScreen; 
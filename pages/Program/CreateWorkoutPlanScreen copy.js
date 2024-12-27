import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import { backend_url } from '../../config/config';
import axios from 'axios'
import { COLORS } from '../../constants';

const CreateWorkoutPlanScreen = ({navigation}) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: '', reps: '' });
  const [exerciseSearchResults, setExerciseSearchResults] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const addExercise = () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({ name: '', sets: '', reps: '' });
      setIsModalVisible(false);  // Close the modal
    } else {
      Alert.alert('Error', 'Please fill out all exercise details');
    }
  };

  const saveWorkoutPlan = () => {
    if (workoutName && exercises.length > 0) {
      // Save the workout plan (e.g., send it to an API, save in local storage, etc.)
      Alert.alert('Success', 'Workout plan created successfully');
      setWorkoutName('');
      setExercises([]);
    } else {
      Alert.alert('Error', 'Please enter a workout name and at least one exercise');
    }
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updatedExercises);
  };

  // const renderExerciseItem = ({ item, index }) => (
  //   <View style={styles.exerciseItem}>
  //     <Text style={styles.exerciseText}>
  //       {item.name} - {item.sets} Sets, {item.reps} Reps
  //     </Text>
  //   </View>
  // );

  const renderExerciseItem = ({ item, index }) => (
    <View style={styles.addedExerciseItem}>
      <View style={styles.smallContainer}>
      <Text style={styles.exerciseText}>{item.name}</Text>
      </View>

      <View style={styles.smallContainer}>
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

      <View style={styles.smallContainer}>
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

      <TouchableOpacity style={styles.removeButton} onPress={() => removeExercise(index)}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const pressSearchItem = (item) => {
    console.log(item)
    setCurrentExercise({ ...currentExercise, name: item.name })
    setIsModalVisible(false)

  }

  const renderSearchExerciseItem = ({ item, index }) => (
    <TouchableOpacity style={styles.exerciseSearchItem} onPress={() => pressSearchItem(item)}>
      <View style={styles.imageContainer} >
        <Image source={{ uri: item.gif }} style={styles.gifImage} />
      </View>
      <Text style={styles.exerciseText}>
        {item.name} 
      </Text>
    </TouchableOpacity>
  );

  const searchExercises = (query) => {

    

    if (query.length > 2) {
      
      axios.get(backend_url  +`exercises-search/?search=${query}`,
          // {headers : {'Authorization': 'Bearer '+ token}}
     //{headers : {'Authorization': 'Bearer '+ token}}
          ).then((response) =>{
          console.log("GraphQL", response.data[0])

          setExerciseSearchResults(response.data)
          setIsModalVisible(true);  // Show the modal when results are available

        });
      
      
      // //Start searching when query length > 2
      // fetch(backend_url +`exercises-search/?search=${query}`)
      //   .then(response => response)
      //   .then(data =>
      //     {console.log(data)
      //       setExerciseSearchResults(data)
      //     } )
      //   .catch(error => {
      //     console.error(error);
      //     Alert.alert('Error', 'Unable to fetch exercises.');
      //   });
    } else {
      setExerciseSearchResults([]); // Clear results if query is too short
      setIsModalVisible(false); 
    }
  };
  return (
    <View style={styles.container}>
       <ArrowHeader navigation={navigation}  /> 

      <Text style={styles.title}>Create Workout Plan</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        placeholderTextColor="#aaa"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <Text style={styles.sectionTitle}>Add Exercises</Text>

      <View style={styles.row}>
      <TextInput
          style={[styles.input, styles.smallInput]}        
        placeholder="Exercise Name"
        placeholderTextColor="#aaa"
        value={currentExercise.name}
        onChangeText={(text) => {
          setCurrentExercise({ ...currentExercise, name: text })
          searchExercises(text);
        }
      }
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

      {/* Custom Modal for Search Results */}
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

      <TouchableOpacity style={styles.saveButton} onPress={saveWorkoutPlan}>
        <Text style={styles.buttonText}>Save Workout Plan</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },

  modalContainer: {
    backgroundColor: '#2b2b2b',
    borderRadius: 5,
    marginTop: -10,
    padding: 10,
    maxHeight: 500,  // Limit height for the dropdown
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchResultItem: {
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
 input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
    textAlign: 'center',
    // height: 50, // Match the height of the input fields

  },
  smallInputNumber: {
    // flex: 0.15,
    marginRight: 10,
    height: 50, // Match the height of the input fields

  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
     height: 50, // Match the height of the input fields
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseList: {
    marginTop: 20,
    marginBottom: 20,
  },
  addedExerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height:80
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 8,
    width:30,
    marginLeft: 20,
    marginTop: 14
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallContainer:{
     alignItems: "center",
    //  justifyContent: "center",
     marginBottom:25,
     flexDirection: "column"
  },
 smallInputAdded: {
  color: COLORS.white,
  marginHorizontal: 10,
  borderRadius: 5,
  borderWidth: 1,  // Adding a border
  borderColor: '#555',  // Border color to define the input box  textAlign: 'center',
  // borderColor: COLORS.white
  height: 40, // Match the height of the input fields

},
  exerciseSearchItem: {
    flexDirection:'row',
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageContainer: {
    borderRadius: 20,
    // overflow: 'hidden', // Ensure the image is properly clipped to the border radius
    // width: '80%', // Set equal width and height for a perfect circle
    // height: 200,
    // marginBottom: 20,
  },
  gifImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    // borderRadius:5
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
  },
  exerciseTitle: {
    color: '#fff',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default CreateWorkoutPlanScreen;

// AddModifyPlanScreen.js
import React, { useState, useCallback} from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import CustomSelect from '../../components/CustomSelect';

import { saveExercises, getDBConnection} from '../../db/db_service';

const AddModifyPlanScreen = ({ navigation }) => {
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [kg, setKg] = useState(0)

  const options = ['Option 1', 'Option 2', 'Option 3'];
  const [selectedOption, setSelectedOption] = useState('');

  const addExercise = async () => {
    try {
      let exercises =[{id:1, name: exercise, reps:reps, sets:sets, weight:kg}]
      const db = await getDBConnection();
      await saveExercises(db, exercises);
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddExercise = async () => {
    // Add the exercise, reps, and sets to the workout plan
    try {
      let exercises =[{id:1, name: exercise, reps:reps, sets:sets, weight:kg}]
      const db = await getDBConnection();
      await saveExercises(db, exercises);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add/Modify Plan</Text>
      <TextInput
        style={styles.input}
        placeholder="Exercise"
        value={exercise}
        onChangeText={(text) => setExercise(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={(text) => setReps(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        value={sets}
        onChangeText={(text) => setSets(text)}
        keyboardType="numeric"
      />

      {/* <Text>Select an option:</Text>
      <CustomSelect options={options} onSelect={setSelectedOption} /> */}

     <TextInput
        style={styles.input}
        placeholder="Kg"
        value={kg}
        onChangeText={(text) => setKg(text)}
        keyboardType="numeric"
      />  
      <Button title="Add Exercise" onPress={handleAddExercise} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
});

export default AddModifyPlanScreen;

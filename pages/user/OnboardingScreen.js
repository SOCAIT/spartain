import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // If you're using a Picker for gender and goals
import COLORS from '../constants/colors';

const OnboardingScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('Lose Weight');

  const handleSubmit = () => {
    if (!name || !age || !height || !weight) {
      Alert.alert('Missing Information', 'Please fill in all the fields.');
      return;
    }

    // Proceed to save data and navigate to the main screen
    Alert.alert('Success', 'Your information has been saved!');
    navigation.replace('MainScreen'); // Replace 'MainScreen' with your main screen name
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to FitnessApp</Text>
      <Text style={styles.subtitle}>Let’s get to know you better!</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={COLORS.gray}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor={COLORS.gray}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          placeholderTextColor={COLORS.gray}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor={COLORS.gray}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <Text style={styles.label}>Fitness Goal</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={goal}
            style={styles.picker}
            onValueChange={(itemValue) => setGoal(itemValue)}
          >
            <Picker.Item label="Lose Weight" value="Lose Weight" />
            <Picker.Item label="Build Muscle" value="Build Muscle" />
            <Picker.Item label="Maintain Fitness" value="Maintain Fitness" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.replace('MainScreen')}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: COLORS.white,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;

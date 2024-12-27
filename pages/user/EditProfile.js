import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList } from 'react-native';
import ArrowHeader from '../../components/ArrowHeader';
import { COLORS, SIZES, FONTS } from '../../constants';

const fitnessGoals = ['Muscle Gain', 'Weight Loss', 'Maintain Fitness', 'Increase Stamina', 'Flexibility'];

const EditProfile = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Muscle Gain');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const saveProfile = () => {
    if (age && weight && height && fitnessGoal && dietaryPreferences) {
      Alert.alert("Profile Saved", "Your profile details have been saved successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Error", "Please fill out all fields");
    }
  };

  const selectFitnessGoal = (goal) => {
    setFitnessGoal(goal);
    setModalVisible(false);
  };

  return ( 
    <ScrollView contentContainerStyle={styles.container}>
      <ArrowHeader navigation={navigation} title="Edit Your Profile" />
      <View style={styles.form}>
        <Text style={styles.title}>Edit Profile</Text>

        {/* Age Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age:</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="Enter your age"
            placeholderTextColor="#aaa"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        {/* Weight and Height in one row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfInputGroup]}>
            <Text style={styles.label}>Weight (kg):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter weight"
              placeholderTextColor="#aaa"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, styles.halfInputGroup]}>
            <Text style={styles.label}>Height (cm):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter height"
              placeholderTextColor="#aaa"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Custom Dropdown for Fitness Goal */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fitness Goal:</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
            <Text style={styles.dropdownText}>{fitnessGoal || "Select your fitness goal"}</Text>
          </TouchableOpacity>
        </View>

        {/* Dietary Preferences Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary Preferences:</Text>
          <TextInput
            style={styles.largeTextInput}
            placeholder="Enter any dietary preferences"
            placeholderTextColor="#aaa"
            value={dietaryPreferences}
            onChangeText={setDietaryPreferences}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        {/* Modal for Dropdown */}
        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Fitness Goal</Text>
              <FlatList
                data={fitnessGoals}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => selectFitnessGoal(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.dark,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginTop: 10,
    paddingHorizontal: SIZES.padding * 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputGroup: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    color: COLORS.light,
    marginBottom: 5,
    ...FONTS.body3,
  },
  textInput: {
    color: COLORS.white,
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    ...FONTS.body3,
  },
  largeTextInput: {
    color: COLORS.white,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    minHeight: 80,
    textAlignVertical: 'top',
    ...FONTS.body3,
  },
  dropdown: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dropdownText: {
    color: '#aaa',
    ...FONTS.body3,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.dark,
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  modalItemText: {
    color: COLORS.white,
    ...FONTS.body3,
  },
  closeButton: {
    marginTop: 15,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default EditProfile;

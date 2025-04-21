import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal,
   TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import { backend_url } from '../../config/config';
import { InputDropdown } from '../../components/dropdowns/InputDropdown';

const target_goal_map = {
  "Muscle Gain": "MG",
  "Fat Loss": "FL",
  "Maintainance": "MT",
  "Endurance": "EN",
  "Strength Training": "ST",
};

const gender_map = {
     "Male": "M",
     "Female": "F",
      "Other": "O",
};

const activity_level_map = {
  "None": "N",
  "Light Active": "L",
  "Medium": "M",
  "Very Active": "V",
  "Ultra Active": "U",
};


const get_key = (value, mapping) => {
  for (const [key, val] of Object.entries(mapping)) {
    console.log(key, val);
    if (val === value) {
      console.log(key);
      return key;
    }
  }
  //return null;
};

export default function EditProfileScreen({ route }) {
  const navigation = useNavigation();
  const { authState, setAuthState } = useContext(AuthContext);

  

  // Profile basic info states
  const [age, setAge] = useState(authState.age);
  const [height, setHeight] = useState(authState.height);
  const [gender, setGender] = useState(get_key(authState.gender, gender_map));
  const [targetGoal, setTargetGoal] = useState(get_key(authState.user_target, target_goal_map));
  const [activityLevel, setActivityLevel] = useState(get_key(authState.activity_level, activity_level_map));
  const [preferences, setPreferences] = useState('');

  // Latest Body Measurements states (or empty strings if none exist)
  const [latestWeight, setLatestWeight] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.weight ? authState.latest_body_measurement.weight : "")  : ""
  );
  const [latestBodyFat, setLatestBodyFat] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.bodyFat ? authState.latest_body_measurement.bodyFat : "")  : ""
  );
  const [latestMuscleMass, setLatestMuscleMass] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.muscleMass ? authState.latest_body_measurement.muscleMass : "")  : ""
  );
  const [latestCircumference, setLatestCircumference] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.circumference ? authState.latest_body_measurement.circumference : "")  : ""
  );

  // State to handle modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Placeholder function for profile picture upload
  const uploadProfilePicture = () => {
    alert("Profile picture upload functionality goes here.");
  };

  useEffect(() => {
    console.log(authState);
  }, []);

  const updateUser = () => {
    let data = {
      age: age,
      height_cm: height,
      user_target: target_goal_map[targetGoal],
      dietary_preferences: preferences,
      latest_body_measurement: {
        weight: latestWeight,
        bodyFat: latestBodyFat,
        muscleMass: latestMuscleMass,
        circumference: latestCircumference,
      }
    };
    console.log(data);
    axios.put(`${backend_url}user/${authState.id}/`, data)
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("user updated");
          Alert.alert("Updated Successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ArrowHeaderNew navigation={navigation} />
      <ScrollView>
        {/* Profile Picture Section */}
        <TouchableOpacity style={styles.profilePicContainer} onPress={uploadProfilePicture}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profilePic}
          />
          <View style={styles.cameraIconContainer}>
            <MaterialIcons name="camera-alt" size={24} color="#FF6A00" />
          </View>
        </TouchableOpacity>

        {/* Subscription Button */}
        <TouchableOpacity 
          style={styles.subscriptionButton} 
          onPress={() => navigation.navigate('Subscription')}
        >
          <MaterialIcons name="star" size={24} color="#FF6A00" style={styles.subscriptionIcon} />
          <Text style={styles.subscriptionButtonText}>Manage Subscription</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          {/* Age Input */}
          <View style={{ flex: 1 }}>
            <Text style={styles.labelText}>Age</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="date-range" size={20} color="#FF6A00" style={styles.icon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(age)}
                onChangeText={(text) => setAge(Number(text))}
              />
            </View>
          </View>
          {/* Height Input */}
          <View style={{ flex: 1 }}>
            <Text style={styles.labelText}>Height</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="human-male-height" size={20} color="#FF6A00" style={styles.icon} />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(height)}
                onChangeText={(text) => setHeight(Number(text))}
              />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          {/* Gender Picker */}
          <View style={{ flex: 1 }}>
            <Text style={styles.labelText}>Gender</Text>
            <InputDropdown
              placeholder_value={gender}
              onValueChange={(text) => setGender(text)}
              items={[
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
                { label: 'Other', value: 'O' },
              ]}
            />
          </View>
          {/* Target Goal */}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.labelText}>Target Goal</Text>
            <InputDropdown
              placeholder_value={targetGoal}
              onValueChange={(text) => setTargetGoal(text)}
              items={[
                { label: 'Muscle Gain', value: 'MG' },
                { label: 'Fat Loss', value: 'FL' },
                { label: 'Maintainance', value: 'MT' },
                { label: 'Endurance', value: 'EN' },
              ]}
            />
          </View>
        </View>

        <View style={{ flex: 1, marginLeft: 0, marginTop: Platform.OS === 'ios' ? 15 : 5, width: "50%" }}>
          <Text style={styles.labelText}>Activity Level</Text>
          <InputDropdown
            placeholder_value={activityLevel}
            onValueChange={(text) => setActivityLevel(text)}
            items={[
              { label: 'None', value: 'N' },
              { label: 'Light Active', value: 'L' },
              { label: 'Medium', value: 'M' },
              { label: 'Very Active', value: 'V' },
              { label: 'Ultra Active', value: 'U' },
            ]}
          />
        </View>

        {/* Button to open Body Measurements Modal */}
        <TouchableOpacity style={styles.openModalButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.openModalButtonText}>Edit Body Measurements</Text>
        </TouchableOpacity>

        {/* Dietary Preferences */}
        <View style={styles.viewStyle}>
          <Text style={styles.labelText}>Dietary preferences</Text>
          <View style={styles.largeInputContainer}>
            <MaterialIcons name="edit" size={20} color="#FF6A00" style={styles.icon} />
            <TextInput
              style={styles.textArea}
              placeholder="Enter any specific physical or nutrition preferences..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={5}
              value={preferences}
              onChangeText={setPreferences}
            />
          </View>
        </View>

        

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={updateUser}>
          <Text style={styles.continueText}>Save</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={styles.iconRight} />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Body Measurements */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Latest Body Measurements</Text>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={String(latestWeight)}
                    onChangeText={(text) => setLatestWeight(text)}
                  />
                </View>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Body Fat (%)"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={String(latestBodyFat)}
                    onChangeText={(text) => setLatestBodyFat(text)}
                  />
                </View>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Muscle Mass"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={String(latestMuscleMass)}
                    onChangeText={(text) => setLatestMuscleMass(text)}
                  />
                </View>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Circumference"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={String(latestCircumference)}
                    onChangeText={(text) => setLatestCircumference(text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  viewStyle: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 25 : 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  largeInputContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 25 : 0,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 0,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 40,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  textArea: {
    color: "#FFF"
  },
  labelText: {
    color: COLORS.white,
    marginBottom: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
  closeModalButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  openModalButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  openModalButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  subscriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  subscriptionIcon: {
    marginRight: 10,
  },
  subscriptionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
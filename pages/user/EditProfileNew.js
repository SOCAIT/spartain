import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal,
   TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native';
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
    //console.log(key, val);
    if (val === value) {
      //console.log(key);
      return key;
    }
  }
  //return null;
};

export default function EditProfileScreen({ route }) {
  const navigation = useNavigation();
  const { authState, setAuthState, deleteAccount } = useContext(AuthContext);

  

  // Profile basic info states
  const [age, setAge] = useState(authState.age);
  const [height, setHeight] = useState(authState.height);
  // Store backend codes directly (e.g., 'M', 'MG', 'V')
  const [gender, setGender] = useState(authState.gender || 'M');
  const [targetGoal, setTargetGoal] = useState(authState.user_target || 'MG');
  const [activityLevel, setActivityLevel] = useState(authState.activity_level || 'N');
  const [preferences, setPreferences] = useState(authState.dietary_preferences);

  // Latest Body Measurements states (or empty strings if none exist)
  const [latestWeight, setLatestWeight] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.weight_kg ? authState.latest_body_measurement.weight_kg : "")  : ""
  );
  const [latestBodyFat, setLatestBodyFat] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.body_fat_percentage ? authState.latest_body_measurement.body_fat_percentage : "")  : ""
  );
  const [latestMuscleMass, setLatestMuscleMass] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.muscle_mass_kg ? authState.latest_body_measurement.muscle_mass_kg : "")  : ""
  );
  const [latestCircumference, setLatestCircumference] = useState(
    authState.latest_body_measurement ? (authState.latest_body_measurement.waist_circumference_cm ? authState.latest_body_measurement.waist_circumference_cm  : "")  : ""
  );

  // State to handle modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [metricValue, setMetricValue] = useState('');

  // Define available metrics
  const bodyMetrics = [
    { label: 'Weight (kg)', value: 'weight', unit: 'kg' },
    { label: 'Body Fat (%)', value: 'bodyFat', unit: '%' },
    { label: 'Muscle Mass (kg)', value: 'muscleMass', unit: 'kg' },
    { label: 'Circumference (cm)', value: 'circumference', unit: 'cm' },
  ];

  // Get current value for selected metric
  const getCurrentMetricValue = (metric) => {
    switch (metric) {
      case 'weight':
        return latestWeight;
      case 'bodyFat':
        return latestBodyFat;
      case 'muscleMass':
        return latestMuscleMass;
      case 'circumference':
        return latestCircumference;
      default:
        return '';
    }
  };

  // Update the specific metric value
  const updateMetricValue = (metric, value) => {
    switch (metric) {
      case 'weight':
        setLatestWeight(value);
        break;
      case 'bodyFat':
        setLatestBodyFat(value);
        break;
      case 'muscleMass':
        setLatestMuscleMass(value);
        break;
      case 'circumference':
        setLatestCircumference(value);
        break;
    }
  };

  // Handle metric selection change
  const handleMetricChange = (metric) => {
    if (!metric) return; // ignore placeholder events that return null
    setSelectedMetric(metric);
    setMetricValue(getCurrentMetricValue(metric));
  };

  // Handle modal open
  const openModal = () => {
    setSelectedMetric('weight');
    setMetricValue(getCurrentMetricValue('weight'));
    setModalVisible(true);
  };

  // Handle save metric
  const saveMetric = () => {
    // Persist change in component state
    updateMetricValue(selectedMetric, metricValue);

    // Close the modal so user sees the change reflected
    setModalVisible(false);

    // Determine readable label, fall back gracefully
    const metricObj = bodyMetrics.find(m => m.value === selectedMetric);
    const readableLabel = metricObj ? metricObj.label : 'Measurement';

    Alert.alert('Success', `${readableLabel} updated successfully!`);
  };

  // Placeholder function for profile picture upload
  const uploadProfilePicture = () => {
    alert("Profile picture upload functionality goes here.");
  };

  useEffect(() => {
    console.log(authState);
    console.log(activityLevel);
    //console.log(authState.activity_level);
    //console.log(get_key(authState.activity_level, activity_level_map));
  }, []);

  // Loading indicator for save/update action
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState("Save");

  const toCode = (val, mapping) => mapping[val] ? mapping[val] : val; // label->code else code

  const updateUser = async () => {
    setSaving(true);
    setSavingMessage("Updating...");

    let data = {
      age: age,
      height_cm: height,
      user_target: toCode(targetGoal, target_goal_map),
      dietary_preferences: preferences,
      activity_level: toCode(activityLevel, activity_level_map),
      latest_body_measurement: {
        weight_kg: latestWeight,
        body_fat_percentage: latestBodyFat,
        muscle_mass_kg: latestMuscleMass,
        waist_circumference_cm: latestCircumference,
      }
    };
    console.log(data);
    try {
      const response = await axios.put(`${backend_url}user/${authState.id}/`, data);
      if (response.data.error) {
        console.log(response.data.error);
        Alert.alert("Error", response.data.error);
      } else {
        console.log('user updated');
        console.log(response);

        // Update local auth state so UI reflects new values immediately
        setAuthState(prev => ({
          ...prev,
          age: age,
          height: height,
          gender: toCode(gender, gender_map),
          user_target: toCode(targetGoal, target_goal_map),
          activity_level: toCode(activityLevel, activity_level_map),
          dietary_preferences: preferences,
          latest_body_measurement: {
            weight_kg: latestWeight,
            body_fat_percentage: latestBodyFat,
            muscle_mass_kg: latestMuscleMass,
            waist_circumference_cm: latestCircumference,
          },
        }));

        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
      setSavingMessage("Save");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, including:\n\n• Profile information\n• Body measurements\n• Workout history\n• Nutrition data\n• Subscription details",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => confirmDeleteAccount()
        }
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Final Confirmation",
      "This is your final warning. Deleting your account will permanently remove all your data and cannot be undone.\n\nAre you absolutely sure?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "I understand, delete my account",
          style: "destructive",
          onPress: () => performDeleteAccount()
        }
      ]
    );
  };

  const performDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        Alert.alert(
          "Account Deleted",
          "Your account has been successfully deleted. You will now be logged out.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigation will be handled automatically by auth state change
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to delete account. Please try again or contact support.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again or contact support.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ArrowHeaderNew 
        navigation={navigation} 
        rightIcon="settings"
        onRightIconPress={() => navigation.navigate('SettingsStack')}
      />
      <ScrollView>
        {/* Profile Picture Section */}
        {/* <TouchableOpacity style={styles.profilePicContainer} onPress={uploadProfilePicture}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profilePic}
          />
          <View style={styles.cameraIconContainer}>
            <MaterialIcons name="camera-alt" size={24} color="#FF6A00" />
          </View>
        </TouchableOpacity> */}

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
              placeholder_value={get_key(gender, gender_map) || 'Select'}
              selectedValue={gender}
              onValueChange={(code) => setGender(code)}
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
              placeholder_value={get_key(targetGoal, target_goal_map) || 'Select'}
              selectedValue={targetGoal}
              onValueChange={(code) => setTargetGoal(code)}
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
            placeholder_value={get_key(activityLevel, activity_level_map) || 'Select'}
            selectedValue={activityLevel}
            onValueChange={(code) => setActivityLevel(code)}
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
        <TouchableOpacity style={styles.openModalButton} onPress={openModal}>
          <Text style={styles.openModalButtonText}>Edit Body Measurements</Text>
        </TouchableOpacity>

        {/* Dietary Preferences */}
        <View style={styles.viewStyle}>
          <Text style={styles.labelText}>Dietary or Physical preferences</Text>
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
        <TouchableOpacity
          style={[styles.continueButton, saving && { backgroundColor: COLORS.lightGray5, opacity: 0.7 }]}
          onPress={updateUser}
          disabled={saving}
        >
          {saving ? (
            <>
              <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={styles.continueText}>{savingMessage}</Text>
            </>
          ) : (
            <>
              <Text style={styles.continueText}>{savingMessage}</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={styles.iconRight} />
            </>
          )}
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <MaterialIcons name="delete-forever" size={24} color="#FFF" style={styles.deleteIcon} />
          <Text style={styles.deleteAccountText}>Delete Account</Text>
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
                <Text style={styles.modalTitle}>Update Body Measurement</Text>
                
                {/* Metric Selection Dropdown */}
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Select Metric:</Text>
                  <InputDropdown
                    placeholder_value={bodyMetrics.find(m => m.value === selectedMetric)?.label || 'Select metric'}
                    onValueChange={handleMetricChange}
                    items={bodyMetrics.map(metric => ({
                      label: metric.label,
                      value: metric.value
                    }))}
                  />
                </View>

                {/* Current Values Display */}
                <View style={styles.currentValuesContainer}>
                  <Text style={styles.currentValuesTitle}>Current Measurements:</Text>
                  {bodyMetrics.map(metric => (
                    <View key={metric.value} style={styles.currentValueRow}>
                      <Text style={styles.currentValueLabel}>{metric.label}:</Text>
                      <Text style={styles.currentValueText}>
                        {getCurrentMetricValue(metric.value) || 'Not set'}
                        {getCurrentMetricValue(metric.value) ? ` ${metric.unit}` : ''}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Value Input for Selected Metric */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>
                    Update {bodyMetrics.find(m => m.value === selectedMetric)?.label}:
                  </Text>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter ${bodyMetrics.find(m => m.value === selectedMetric)?.label.toLowerCase()}`}
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={String(metricValue)}
                    onChangeText={setMetricValue}
                  />
                </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveMetric}
                  >
                    <Text style={styles.saveButtonText}>Save Metric</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
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
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#666',
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
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    borderWidth: 1,
    borderColor: '#FF6666',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 30,
    marginTop: 20,
  },
  deleteIcon: {
    marginRight: 10,
  },
  deleteAccountText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    color: COLORS.white,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  currentValuesContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  currentValuesTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  currentValueLabel: {
    color: '#CCC',
    fontSize: 14,
  },
  currentValueText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  inputSection: { 
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.white,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
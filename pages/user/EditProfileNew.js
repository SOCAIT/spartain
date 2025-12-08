import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal,
   TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
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

  // Profile picture state
  const [profilePhoto, setProfilePhoto] = useState(authState.profile_photo || null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  // Function to handle profile picture selection
  const handlePhotoSelection = (type) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    const launcher = type === 'camera' ? launchCamera : launchImageLibrary;

    launcher(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setProfilePhoto(asset.uri);
        setPhotoModalVisible(false);
        // You can upload to server here if needed
        // uploadPhotoToServer(asset);
      }
    });
  };

  const openPhotoModal = () => {
    setPhotoModalVisible(true);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section Card */}
        <View style={styles.profileCard}>
          {/* Profile Picture Section */}
          {/* COMMENTED OUT - Re-enable when backend is ready */}
          {/* <TouchableOpacity style={styles.profilePicContainer} onPress={openPhotoModal}> */}
          <View style={styles.profilePicContainer}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profilePic}
              />
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <MaterialIcons name="person" size={50} color="#FF6A00" />
              </View>
            )}
            {/* <View style={styles.cameraIconContainer}>
              <MaterialIcons name="camera-alt" size={20} color="#FFF" />
            </View> */}
          </View>
          {/* </TouchableOpacity> */}
          
          <Text style={styles.profileName}>{authState.username}</Text>
          <Text style={styles.profileSubtitle}>Photo upload coming soon</Text>
        </View>

        {/* Subscription Card */}
        <TouchableOpacity 
          style={styles.subscriptionCard} 
          onPress={() => navigation.navigate('Subscription')}
          activeOpacity={0.7}
        >
          <View style={styles.subscriptionIconWrapper}>
            <MaterialIcons name="workspace-premium" size={28} color="#FFD700" />
          </View>
          <View style={styles.subscriptionTextContainer}>
            <Text style={styles.subscriptionTitle}>
              {authState.isSubscribed ? 'Premium Plan' : 'Free Plan'}
            </Text>
            <Text style={styles.subscriptionSubtitle}>
              {authState.isSubscribed ? 'Manage your subscription' : 'Upgrade to unlock all features'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        {/* Basic Info Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="person" size={22} color="#FF6A00" />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <View style={styles.row}>
            {/* Age Input */}
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Age (years)</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="cake" size={20} color="#FF6A00" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="25"
                  placeholderTextColor="#666"
                  value={String(age)}
                  onChangeText={(text) => setAge(Number(text))}
                />
              </View>
            </View>
            {/* Height Input */}
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Height (cm)</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="human-male-height" size={20} color="#FF6A00" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="175"
                  placeholderTextColor="#666"
                  value={String(height)}
                  onChangeText={(text) => setHeight(Number(text))}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            {/* Gender Picker */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.labelText}>Gender</Text>
              <InputDropdown
                placeholder_value={get_key(gender, gender_map) || 'Select Gender'}
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
            <View style={styles.dropdownWrapper}>
              <Text style={styles.labelText}>Target Goal</Text>
              <InputDropdown
                placeholder_value={get_key(targetGoal, target_goal_map) || 'Select Goal'}
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

          <View style={styles.fullWidthDropdown}>
            <Text style={styles.labelText}>Activity Level</Text>
            <InputDropdown
              placeholder_value={get_key(activityLevel, activity_level_map) || 'Select Activity Level'}
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
        </View>

        {/* Body Measurements Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="straighten" size={22} color="#FF6A00" />
            <Text style={styles.sectionTitle}>Body Measurements</Text>
          </View>
          <TouchableOpacity style={styles.measurementButton} onPress={openModal}>
            <MaterialIcons name="monitor-weight" size={24} color="#FF6A00" />
            <View style={styles.measurementTextContainer}>
              <Text style={styles.measurementButtonText}>Update Measurements</Text>
              <Text style={styles.measurementButtonSubtext}>
                Weight, Body Fat, Muscle Mass, etc.
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Dietary Preferences Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="restaurant-menu" size={22} color="#FF6A00" />
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          </View>
          <View style={styles.largeInputContainer}>
            <MaterialIcons name="restaurant-menu" size={20} color="#FF6A00" style={styles.icon} />
            <TextInput
              style={styles.textArea}
              placeholder="Enter any dietary preferences, allergies, or restrictions..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={preferences}
              onChangeText={setPreferences}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && { backgroundColor: COLORS.lightGray5, opacity: 0.7 }]}
          onPress={updateUser}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <>
              <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={styles.saveButtonText}>{savingMessage}</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="check-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>{savingMessage}</Text>
            </>
          )}
        </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <View style={styles.dangerZoneTitleContainer}>
            <MaterialIcons name="warning" size={22} color="#FF4444" />
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          </View>
          <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <MaterialIcons name="delete-forever" size={24} color="#FFF" style={styles.deleteIcon} />
            <Text style={styles.deleteAccountText}>Delete Account Permanently</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Photo Selection Modal - COMMENTED OUT until backend is ready */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={photoModalVisible}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.photoModalOverlay}>
          <View style={styles.photoModalContent}>
            <Text style={styles.photoModalTitle}>Change Profile Photo</Text>
            
            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => handlePhotoSelection('camera')}
            >
              <MaterialIcons name="camera-alt" size={28} color="#FF6A00" />
              <Text style={styles.photoOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoOption}
              onPress={() => handlePhotoSelection('library')}
            >
              <MaterialIcons name="photo-library" size={28} color="#FF6A00" />
              <Text style={styles.photoOptionText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoCancelButton}
              onPress={() => setPhotoModalVisible(false)}
            >
              <Text style={styles.photoCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

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
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  profileCard: {
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FF6A00',
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF6A00',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FF6A00',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#2C2C2E',
  },
  profileName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileSubtitle: {
    color: '#999',
    fontSize: 13,
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  subscriptionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionTextContainer: {
    flex: 1,
  },
  subscriptionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subscriptionSubtitle: {
    color: '#999',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#2C2C2E',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 10,
  },
  dropdownWrapper: {
    flex: 1,
    marginBottom: 15,
  },
  fullWidthDropdown: {
    marginBottom: 15,
  },
  labelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  largeInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
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
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 40,
    fontSize: 15,
  },
  textArea: {
    flex: 1,
    color: "#FFF",
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  measurementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  measurementTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  measurementButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  measurementButtonSubtext: {
    color: '#999',
    fontSize: 13,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
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
  dangerZone: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  dangerZoneTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dangerZoneTitle: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    padding: 16,
    borderRadius: 12,
  },
  deleteIcon: {
    marginRight: 10,
  },
  deleteAccountText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  photoModalContent: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
  },
  photoModalTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  photoOptionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  photoCancelButton: {
    backgroundColor: '#3C3C3E',
    padding: 18,
    borderRadius: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  photoCancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
  saveButtonContainer: {
    paddingHorizontal: 20,
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
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);

  // form state
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [preferences, setPreferences] = useState('');

  useEffect(() => {
    const checkOnboarding = async () => {
      const keyCheck = route?.params?.username ? `hasOnboarded_${route.params.username}` : 'hasOnboarded';
      const done = await AsyncStorage.getItem(keyCheck);
      if (done) {
        navigation.replace('Main');
      } else {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleSubmit = async () => {
    if (!gender || !weight || !height || !goal || !activityLevel) {
      Alert.alert('Please fill out all fields');
      return;
    }
    const userData = { gender, weight, height, goal, activityLevel, preferences };
    // Save locally (you can also send to backend here)
    await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
    // Determine username from navigation params if available
    const usernameParam = route?.params?.username || '';
    const key = usernameParam ? `hasOnboarded_${usernameParam}` : 'hasOnboarded';
    await AsyncStorage.setItem(key, 'true');
    navigation.replace('Main');
  };

  if (loading) return null;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Quick Setup</Text>

      {/* Gender */}
      <View style={styles.rowWrap}>
        <Ionicons name="person" size={18} color="#fff" style={styles.icon} />
        <Picker
          selectedValue={gender}
          onValueChange={setGender}
          style={styles.compactPicker}
        >
          <Picker.Item label="Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Weight & Height */}
      <View style={styles.doubleRow}>
        <View style={styles.halfInputWrap}>
          <Ionicons name="barbell" size={18} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.compactInput}
            keyboardType="numeric"
            placeholder="Weight (kg)"
            placeholderTextColor="#888"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
        <View style={styles.halfInputWrap}>
          <Ionicons name="body" size={18} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.compactInput}
            keyboardType="numeric"
            placeholder="Height (cm)"
            placeholderTextColor="#888"
            value={height}
            onChangeText={setHeight}
          />
        </View>
      </View>

      {/* Goal */}
      <View style={styles.rowWrap}>
        <Ionicons name="trophy" size={18} color="#fff" style={styles.icon} />
        <Picker
          selectedValue={goal}
          onValueChange={setGoal}
          style={styles.compactPicker}
        >
          <Picker.Item label="Goal" value="" />
          <Picker.Item label="Lose" value="lose" />
          <Picker.Item label="Maintain" value="maintain" />
          <Picker.Item label="Gain" value="gain" />
        </Picker>
      </View>

      {/* Activity */}
      <View style={styles.rowWrap}>
        <Ionicons name="walk" size={18} color="#fff" style={styles.icon} />
        <Picker
          selectedValue={activityLevel}
          onValueChange={setActivityLevel}
          style={styles.compactPicker}
        >
          <Picker.Item label="Activity" value="" />
          <Picker.Item label="Sedentary" value="sedentary" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Moderate" value="moderate" />
          <Picker.Item label="Active" value="active" />
        </Picker>
      </View>

      {/* Preferences */}
      <TextInput
        style={styles.textArea}
        placeholder="Preferences (optional)"
        placeholderTextColor="#888"
        multiline
        value={preferences}
        onChangeText={setPreferences}
      />

      <CustomButton title="Get Started" onPress={handleSubmit} />
    </ScrollView>
  );
};

// Unified button that looks native on both platforms
const CustomButton = ({ title, onPress }) => {
  if (Platform.OS === 'ios') {
    const RNButton = require('react-native').Button;
    return <RNButton title={title} onPress={onPress} color={COLORS.darkOrange} />;
  }
  return (
    <TouchableOpacity style={[styles.androidButton, { backgroundColor: COLORS.darkOrange }]} onPress={onPress}>
      <Text style={styles.androidButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.dark,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff'
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    color: '#fff'
  },
  picker: {
    marginTop: 5,
    color: '#fff'
  },
  buttonWrapper: {
    marginTop: 30,
  },
  androidButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  androidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  compactPicker: {
    flex: 1,
    color: '#fff',
  },
  compactInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    color: '#fff'
  },
  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInputWrap: {
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    color: '#fff',
    height: 80,
  },
});

export default OnboardingScreen; 
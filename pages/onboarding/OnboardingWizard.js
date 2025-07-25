import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Image, TouchableOpacity, ImageBackground } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { backend_url } from '../../config/config';
import { AuthContext } from '../../helpers/AuthContext';
import AgeSelector from '../../components/AgeSelector';
import HeightSelector from '../../components/HeightSelector';

const Wizard = () => {
  const navigation = useNavigation();
  const { authState, setAuthState } = React.useContext(AuthContext);

  const [form, setForm] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    bodyFat: '',
    muscleMass: '',
    circumference: '',
    goal: '',
    activity: '',
    prefs: '',
  });

  const update = (field, value) => setForm({ ...form, [field]: value });

  const slides = [
    {
      key: 'welcome',
      title: 'Welcome to SyntraFit',
      subtitle: 'A simple & quick onboarding to personalize your experience. You can always change your preferences later.',
      image: require('../../assets/images/onboarding/intro.jpg'),
      full: true,
      content: null,
    },
    {
      key: 'gender',
      title: 'Your Gender',
    //   image: require('../../assets/images/onboard/gender.png'),
      content: (
        <View style={styles.optionRow}>
          <OptionButton label="Male" value="M" selected={form.gender==='M'} onPress={(v)=>update('gender',v)} icon={<Ionicons name="male" size={28} color="#fff" />} />
          <OptionButton label="Female" value="F" selected={form.gender==='V'} onPress={(v)=>update('gender',v)} icon={<Ionicons name="female" size={28} color="#fff" />} />
          <OptionButton label="Other" value="O" selected={form.gender==='O'} onPress={(v)=>update('gender',v)} icon={<Ionicons name="transgender" size={28} color="#fff" />} />
        </View>
      ),
    },
    {
      key: 'age',
      title: 'Your Age',
      content: (
        <AgeSelector
          value={form.age}
          onChange={(v) => update('age', v)}
        />
      ),
    },
    {
      key: 'height',
      title: 'Your Height',
      content: (
        <HeightSelector
          value={form.height}
          onChange={(v) => update('height', v)}
        />
      ),
    },
    {
      key: 'goal',
      title: 'Target Goal',
        //   image: require('../../assets/images/onboard/goal.png'),
      content: (
        <View style={styles.optionRow}>
          <OptionButton label="Fat Loss" value="FL" selected={form.goal==='FL'} onPress={(v)=>update('goal',v)} icon={<Ionicons name="trending-down" size={24} color="#fff" />} />
          <OptionButton label="Maintain" value="MT" selected={form.goal==='MT'} onPress={(v)=>update('goal',v)} icon={<Ionicons name="remove" size={24} color="#fff" />} />
          <OptionButton label="Endurance" value="EN" selected={form.goal==='EN'} onPress={(v)=>update('goal',v)} icon={<Ionicons name="walk" size={24} color="#fff" />} />
          <OptionButton label="Muscle Gain" value="MG" selected={form.goal==='MG'} onPress={(v)=>update('goal',v)} icon={<Ionicons name="trending-up" size={24} color="#fff" />} />
        </View>
      ),
    },
    {
      key: 'activity',
      title: 'Activity Level',
      //image: require('../../assets/images/onboard/activity.png'),
      content: (
        <View style={styles.optionRow}>
          <OptionButton label="None" value="N" selected={form.activity==='N'} onPress={(v)=>update('activity',v)} icon={<Ionicons name="cafe" size={24} color="#fff" />} />
          <OptionButton label="Light" value="L" selected={form.activity==='L'} onPress={(v)=>update('activity',v)} icon={<Ionicons name="walk" size={24} color="#fff" />} />
          <OptionButton label="Moderate" value="M" selected={form.activity==='M'} onPress={(v)=>update('activity',v)} icon={<Ionicons name="bicycle" size={24} color="#fff" />} />
          <OptionButton label="Very Active" value="V" selected={form.activity==='V'} onPress={(v)=>update('activity',v)} icon={<Ionicons name="flame" size={24} color="#fff" />} />
          <OptionButton label="Ultra Active" value="U" selected={form.activity==='U'} onPress={(v)=>update('activity',v)} icon={<Ionicons name="rocket" size={24} color="#fff" />} />
        </View>
      ),
    },
    {
      key: 'prefs',
      title: 'Preferences',
      //image: require('../../assets/images/onboard/prefs.png'),
      content: (
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Any physical or dietaryPreferences (optional)"
          placeholderTextColor="#888"
          multiline
          value={form.prefs}
          onChangeText={(v) => update('prefs', v)}
        />
      ),
    },
    {
      key: 'body',
      title: 'Body Measurements',
      subtitle: 'These help us personalize your analytics (optional except weight).',
      content: (
        <View style={styles.bodyRow}>
          <TextInput
            placeholder="Weight (kg) *"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={form.weight}
            onChangeText={(v) => update('weight', v)}
          />
          <TextInput
            placeholder="Body Fat %"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={form.bodyFat}
            onChangeText={(v) => update('bodyFat', v)}
          />
          <TextInput
            placeholder="Muscle Mass (kg)"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={form.muscleMass}
            onChangeText={(v) => update('muscleMass', v)}
          />
          <TextInput
            placeholder="Circumference (cm)"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={form.circumference}
            onChangeText={(v) => update('circumference', v)}
          />
        </View>
      ),
    },
  ];

  const validate = () => {
    const { gender, age, height, weight, goal, activity } = form;
    return gender && age && height && weight && goal && activity;
  };

  const finish = async () => {
    if (!validate()) {
      Alert.alert('Please complete required fields');
      return;
    }
    // Persist to backend
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(form);
      console.log(authState.id);
      
      await axios.put(
        `${backend_url}user/${authState.id}/`,
        {
          gender: form.gender,
          age: form.age,
          height_cm: form.height,
          user_target: form.goal,
          activity_level: form.activity,
          dietary_preferences: form.prefs,
          latest_body_measurement: {
            weight_kg: form.weight,
            bodyFat: form.bodyFat,
            muscleMass: form.muscleMass,
            circumference: form.circumference,
          },
        },
        {
          // headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      console.log('✅ Profile updated on backend');
      
    } catch (e) {
      console.error('❌ Failed to update profile on backend:', e.response.data);
    }

    await AsyncStorage.setItem('userProfile', JSON.stringify(form));
    const key = authState?.username ? `hasOnboarded_${authState.username}` : 'hasOnboarded';
    await AsyncStorage.setItem(key, 'true');
    
    //update auth state with new profile data
    setAuthState({...authState, 
      age: form.age, 
      height: form.height, 
      height_cm: form.height,
      gender: form.gender,
      user_target : form.goal, 
      activity_level: form.activity, 
      dietary_preferences: form.prefs,
      latest_body_measurement: {
        weight_kg: form.weight,
        bodyFat: form.bodyFat,
        muscleMass: form.muscleMass,
        circumference: form.circumference,
      }});
    navigation.replace('Tabs');
  };

  const renderItem = ({ item }) => {
    if (item.full) {
      return (
        <ImageBackground source={item.image} style={styles.fullBg} resizeMode="cover">
          <View style={styles.fullOverlay}>
            <Text style={styles.fullTitle}>{item.title}</Text>
            {item.subtitle && <Text style={styles.fullSubtitle}>{item.subtitle}</Text>}
          </View>
        </ImageBackground>
      );
    }
    return (
      <View style={styles.slide}>
        {item.image && <Image source={item.image} style={styles.image} resizeMode="contain" />}
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        {item.content}
      </View>
    );
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      onDone={finish}
      onSkip={finish}
      showSkipButton
      dotStyle={{ backgroundColor: '#555' }}
      activeDotStyle={{ backgroundColor: COLORS.darkOrange }}
      renderNextButton={() => <Ionicons name="arrow-forward" size={24} color="#fff" />}
      renderSkipButton={() => <Ionicons name="arrow-skip-forward" size={24} color="#fff" />}
      renderDoneButton={() => <Ionicons name="checkmark" size={24} color="#fff" />}
      bottomButton
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  fullBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  fullOverlay: {
    //backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 40,
    alignItems: 'center',
  },
  fullTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  fullSubtitle: {
    fontSize: 15,
    color: '#eee',
    textAlign: 'center',
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  optionBtn: { borderWidth: 1, borderColor: '#555', borderRadius: 8, padding: 12, margin: 6, alignItems: 'center', minWidth: 90 },
  optionSelected: { backgroundColor: COLORS.darkOrange, borderColor: COLORS.darkOrange },
  optionText: { color: '#fff', marginTop: 4, fontSize: 12 },
  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginHorizontal: 5,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },
  bodyRow: {
    width: '80%',
    alignItems: 'center',
  },
});

const OptionButton = ({ label, value, selected, onPress, icon }) => (
  <TouchableOpacity
    style={[styles.optionBtn, selected && styles.optionSelected]}
    onPress={() => onPress(value)}
  >
    {icon}
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

export default Wizard; 
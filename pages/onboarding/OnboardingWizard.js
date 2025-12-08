import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Image, TouchableOpacity, ImageBackground, StatusBar, ActivityIndicator } from 'react-native';
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
    age: '25',
    height: '170',
    weight: '',
    bodyFat: '',
    muscleMass: '',
    circumference: '',
    goal: 'MT',
    activity: 'M',
    prefs: '',
  });
  const [saving, setSaving] = useState(false);

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
          <OptionButton label="Female" value="F" selected={form.gender==='F'} onPress={(v)=>update('gender',v)} icon={<Ionicons name="female" size={28} color="#fff" />} />
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

  const getMissingFields = () => {
    const missing = [];
    if (!form.gender?.toString().trim()) missing.push('Gender');
    if (!form.age?.toString().trim()) missing.push('Age');
    if (!form.height?.toString().trim()) missing.push('Height');
    if (!form.weight?.toString().trim()) missing.push('Weight');
    if (!form.goal?.toString().trim()) missing.push('Target Goal');
    if (!form.activity?.toString().trim()) missing.push('Activity Level');
    return missing;
  };

  const finish = async () => {
    if (saving) return;
    const missing = getMissingFields();
    if (missing.length > 0) {
      Alert.alert(
        'Complete required fields',
        `Please complete/select: ${missing.join(', ')}`
      );
      return;
    }
    setSaving(true);
    // Persist to backend with robust timeout and guaranteed cleanup
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(form);
      console.log(authState.id);
      const payload = {
        gender: form.gender,
        age: form.age,
        height_cm: form.height,
        user_target: form.goal,
        activity_level: form.activity,
        dietary_preferences: form.prefs,
      };
      console.log(payload);

      let targetNutrition = null;
      try {
        const response = await axios.post(
          `${backend_url}user/${authState.id}/`,
          payload,
          { timeout: 10000 } // avoid getting stuck forever
        );
        console.log("onboarding response", response);
        // Backend may return either target_nutrition_data or nutrition_macros
        targetNutrition = response?.data?.target_nutrition_data || response?.data?.nutrition_macros || null;
        console.log('✅ Profile updated on backend');
      } catch (e) {
        console.error('❌ Failed to update profile on backend:', e?.response?.data || e?.message);
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
        target_nutrition_data: targetNutrition ? {
          target_calories: targetNutrition.target_calories,
          target_carbs: targetNutrition.target_carbs,
          target_protein: targetNutrition.target_protein,
          target_fats: targetNutrition.target_fats,
        } : authState?.target_nutrition_data,
        latest_body_measurement: {
          weight_kg: form.weight,
          bodyFat: form.bodyFat,
          muscleMass: form.muscleMass,
          circumference: form.circumference,
        }});
      navigation.replace('Tabs');
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.full) {
      return (
        <ImageBackground source={item.image} style={styles.fullBg} resizeMode="cover">
          <View style={styles.overlay} />
          <View style={styles.headerBrand}>
            <Image source={require('../../assets/icons/spartan_logo.png')} style={styles.brandLogo} resizeMode="contain" />
            <Text style={styles.brandTitle}>SyntraFit</Text>
          </View>
          <View style={styles.fullOverlay}>
            <Text style={styles.fullTitle}>{item.title}</Text>
            {item.subtitle && <Text style={styles.fullSubtitle}>{item.subtitle}</Text>}
          </View>
        </ImageBackground>
      );
    }
    return (
      <View style={styles.slide}>
        <View style={styles.headerBrand}>
          <Image source={require('../../assets/icons/spartan_logo.png')} style={styles.brandLogoSmall} resizeMode="contain" />
          <Text style={styles.brandTitleSmall}>SyntraFit</Text>
        </View>
        {item.image && <Image source={item.image} style={styles.image} resizeMode="contain" />}
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        <View style={styles.card}>
          {item.content}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.dark }}>
      <StatusBar barStyle="light-content" />
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onDone={finish}
        showSkipButton={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        renderNextButton={() => (
          <View style={[styles.ctaButton, saving && styles.ctaDisabled]}>
            <Text style={[styles.ctaText, saving && styles.ctaDisabledText]}>{saving ? 'Please wait' : 'Next'}</Text>
          </View>
        )}
        renderDoneButton={() => (
          <View style={[styles.ctaButton, saving && styles.ctaDisabled]}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Done</Text>}
          </View>
        )}
        bottomButton
      />
      {saving && (
        <View style={styles.savingOverlay}>
          <View style={styles.savingCard}>
            <ActivityIndicator color="#fff" size="large" />
            <Text style={styles.savingText}>Saving your profile...</Text>
          </View>
        </View>
      )}
    </View>
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
  card: {
    width: '90%',
    backgroundColor: '#2b2b2b',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  headerBrand: {
    width: '100%',
    paddingTop: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  brandLogoSmall: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  brandTitleSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
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
  optionBtn: {
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    margin: 6,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  optionSelected: {
    backgroundColor: COLORS.darkOrange,
  },
  optionText: { color: '#fff', marginTop: 6, fontSize: 12, fontWeight: '600' },
  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: '#fff',
    marginHorizontal: 5,
  },
  input: {
    width: '80%',
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: '#fff',
  },
  bodyRow: {
    width: '80%',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#444',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.darkOrange,
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  ctaButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  ctaDisabled: {
    backgroundColor: '#8a8a8a',
  },
  ctaDisabledText: {
    color: '#eee',
  },
  ctaGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  ctaGhostText: {
    color: '#ddd',
    fontWeight: '700',
    fontSize: 14,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingCard: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  savingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
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
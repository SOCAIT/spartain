import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
import { COLORS, SIZES, FONTS } from "../../constants"
// import { Icon } from "@rneui/themed";
import { useForm, Controller } from 'react-hook-form'
import { save } from '../../helpers/Storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import SocialAuthentication from '../../components/authentication/SocialAuthentication'; // DISABLED - Uncomment to enable Google/Apple Sign-In


export default function SignInScreen({navigation}) {

  const { register, setValue, handleSubmit, control, reset, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const { setAuthState } = useContext(AuthContext)
  const [testApi, setTestApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");  // New state for error message
  const [loading, setLoading] = useState(false);           // Loading indicator state
  const [statusMessage, setStatusMessage] = useState("Logging in..."); // Dynamic loading message

  const test_api = () => {
    axios.get(backend_url + "test/").then((response) => {
      console.log(response.data)
      setTestApi(true)
    })
  }

  useEffect(() => {
    test_api()
  }, []);

  // Returns a promise so the caller can await until user data is fetched
  const auth = async ({ token }) => {
    try {
      const response = await axios.get(backend_url + "auth/auth/", {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.data.detail) {
        setAuthState({ username: "", id: 0, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
          profile_photo: response.data.profile_photo,
          age: response.data.age,
          height: response.data.height_cm,
          dietary_preferences: response.data.dietary_preferences,
          user_target: response.data.user_target,
          latest_body_measurement: response.data.latest_body_measurement,
          gender: response.data.gender,
          activity_level: response.data.activity_level,
          target_nutrition_data: response.data.target_nutrition_data,
        });
      }
    } catch (err) {
      console.log("Auth error", err);
      setAuthState({ username: "", id: 0, status: false });
    }
  };

  const login = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("Authenticating...");

    try {
      console.log(data);
      const response = await axios.post(backend_url + "user/login/", data);

      if (response.data.error) {
        setErrorMessage(response.data.error);
        return;
      }

      setStatusMessage("Loading user info...");

      // Save token and fetch full user details
      save("accessToken", response.data.access);
      await auth({ token: response.data.access });

      // Custom extra step for fancy progress feedback
      setStatusMessage("Calculating nutrition data...");

      // Determine onboarding status
      const onboardKey = `hasOnboarded_${data.username}`;
      const alreadyOnboarded = await AsyncStorage.getItem(onboardKey);

      if (alreadyOnboarded) {
        setStatusMessage("Preparing your dashboard...");
        navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding', params: { username: data.username } }] });
      }
    } catch (error) {
      console.log(error.toJSON ? error.toJSON() : error);
      setErrorMessage("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
      setStatusMessage("Logging in...");
    }
  }

  const sign_up = () => {
    navigation.navigate("Signup")
  }
  return (
    // <ImageBackground source={require('../../assets/images/chicken_quinoa.png')} style={styles.imageBackground}>
    <View style={styles.screen}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.header}>
          {/* Image Logo */}
          <Image source={require('../../assets/icons/spartan_logo.png')} style={{ width: 300, height: 200 }} />
          <Text style={styles.title}>Sign In To SyntraFit</Text>
          <Text style={styles.subtitle}>Let's personalize your fitness with AI</Text>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#FF6A00" style={styles.icon} />
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  placeholderTextColor={"#aaa"}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                />
            )}
          />

            
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
          <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password"
                  placeholderTextColor={"#aaa"}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                />
              )}
            />
          <MaterialIcons name="visibility-off" size={20} color="#FF6A00" style={styles.iconRight}               onPress={() => setShowPassword(!showPassword)} />
        </View>

        {errorMessage ? (  // Display error message if it exists
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={{ margin: SIZES.padding * 4 }}>
          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: COLORS.lightGray5, opacity: 0.7 }]}
            onPress={handleSubmit(login)}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>{statusMessage}</Text>
              </>
            ) : (
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}> Login </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* GOOGLE/APPLE SIGN-IN - DISABLED FOR NOW */}
        {/* Uncomment below to re-enable social authentication */}
        {/*
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <SocialAuthentication navigation={navigation} />
        </View>
        */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity>
         
        </TouchableOpacity>
        </View> 
        
        <TouchableOpacity  
        style={styles.forgotPasswordContainer} 
        onPress={() => navigation.navigate('ForgotPassword')}>
        >
          <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
          <Text style={styles.linkText}>Forgot Password</Text>
        </TouchableOpacity> 
      </View>
      </View>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 45 :0,

    backgroundColor: COLORS.primary

  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    color: '#FFF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
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
  iconRight: {
    marginLeft: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  signInText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#666',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialIcon: {
    marginHorizontal: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#FFF',
  },
  linkText: {
    color: '#FF6A00',
    fontWeight: 'bold',
  },
  errorContainer: {
    //marginTop: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.padding
  },
  errorText: {
    color: 'red',
    ...FONTS.body4,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
import { useForm, Controller } from 'react-hook-form';
import { COLORS, SIZES, FONTS } from "../../constants"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const { setAuthState } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const sign_up = async (data) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    console.log(data);
    // keep email, username, password and remove confirmPassword
    const { confirmPassword, ...rest } = data;
    console.log(rest);

    data = rest;

    setIsLoading(true);
    try {
      const response = await axios.post(`${backend_url}user/create/`, {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      console.log(response);

      // Success criteria: backend returns an integer "id" and HTTP 201/200
      if (response && Number.isInteger(response.data?.id) && response.status >= 200 && response.status < 300) {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });

        // Ensure onboarding wizard is shown for new account
        await AsyncStorage.removeItem('hasOnboarded');

        navigation.reset({ index: 0, routes: [{ name: 'Onboarding', params: { username: response.data.username } }] });
      } else if (Number.isInteger(response.data)) {
        // If we get an integer ID but not a success status, it means user already exists
        Alert.alert('Sign Up Failed', 'Username already exists. Please choose a different username.');
      } else {
        // Handle various backend error message formats
        let errorMessage = 'Unable to sign up. Please try again.';
        
        console.log(response.data);
        
        if (response.data?.error) {
          errorMessage = response.data.error;
        } else if (response.data?.detail) {
          errorMessage = response.data.detail;
        } else if (response.data?.message) {
          errorMessage = response.data.message;
        } else if (response.data?.email) {
          // Handle field-specific errors (e.g., email already exists)
          errorMessage = `Email: ${response.data.email[0] || response.data.email}`;
        } else if (response.data?.username) {
          errorMessage = `Username: ${response.data.username[0] || response.data.username}`;
        } else if (typeof response.data === 'string') {
          errorMessage = response.data;
        }
        
        Alert.alert('Sign Up Failed', errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to sign up. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.email) {
          // Handle email-specific errors (e.g., "User with this email already exists")
          errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
        } else if (errorData.username) {
          errorMessage = Array.isArray(errorData.username) ? errorData.username[0] : errorData.username;
        } else if (errorData.password) {
          errorMessage = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <View style={styles.overlay} />

        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialIcons name="fitness-center" size={40} color="#FF6A00" />
            <Text style={styles.title}>Sign Up For Free</Text>
            <Text style={styles.subtitle}>Quickly make your account in 1 minute</Text>
          </View>

          {/* Username Input */}
          <View style={[styles.inputContainer, errors.username && styles.errorBorder]}>
            <Icon name="user" size={20} color="#FF6A00" style={styles.icon} />
            <Controller
              control={control}
              name="username"
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          {errors.username && (
            <Text style={styles.errorText}>{errors.username.message}</Text>
          )}

          {/* Email Input */}
          <View style={[styles.inputContainer, errors.email && styles.errorBorder]}>
            <Icon name="envelope" size={20} color="#FF6A00" style={styles.icon} />
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* Password Input */}
          <View style={[styles.inputContainer, errors.password && styles.errorBorder]}>
            <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#FF6A00"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/* Confirm Password Input */}
          <View style={[styles.inputContainer, errors.confirmPassword && styles.errorBorder]}>
            <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#FF6A00"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.disabledButton]} 
            onPress={handleSubmit(sign_up)}
            disabled={isLoading}
          >
            <Text style={styles.signUpText}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Text>
            {!isLoading && <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={styles.iconRight} />}
          </TouchableOpacity>

          {/* Footer Links */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  errorBorder: {
    borderColor: '#FF0000',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 50,
    fontSize: 16,
  },
  iconRight: {
    marginLeft: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  signUpText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#FFF',
  },
  linkText: {
    color: '#FF6A00',
    fontWeight: 'bold',
  },
});

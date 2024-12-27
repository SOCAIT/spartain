import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect,useContext } from "react";
import axios from "axios";
import {AuthContext} from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';

import {COLORS, SIZES, FONTS} from "../../constants"
export default function SignUpScreen({navigation }) {
  // State variables for form fields and error handling
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {setAuthState} = useContext(AuthContext)


  const { register, setValue, handleSubmit, control, reset, formState: { errors,isValid } } = useForm({mode: 'onBlur'});

  // Function to handle password confirmation check
  const handlePasswordMatch = () => {
    setPasswordsMatch(password === confirmPassword);
  };

  const sign_up = data => {
    //let data ={username: username, password: password, email: email}
    console.log(data)
    axios.post(backend_url + "users/", data).then((response) =>{
      if (response.data.error) 
      {alert(response.data.error);
       }
      else {
      console.log("Successfully Summoned")
      setAuthState({username:response.data.username,id: response.data.id,status:true});
      navigation.navigate("tabs");
      }
    });
  }

  return (
    // <ImageBackground source={require('./path/to/your/background-image.png')} style={styles.imageBackground}>
    <View style={styles.background}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="fitness-center" size={40} color="#FF6A00" />
          <Text style={styles.title}>Sign Up For Free</Text>
          <Text style={styles.subtitle}>Quickly make your account in 1 minute</Text>
        </View>

        {/* Username Input*/}
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#FF6A00" style={styles.icon} />

          <Controller
            control={control}
            name="username"
            render={({field:{onChange, value, onBlur}}) =>(
              <TextInput
                placeholder="Username"
                placeholderTextColor="#FFF"
                style={styles.input}
                keyboardType="email-address"
                value={username}
                onChangeText={setUsername}
              />
          )} 
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#FF6A00" style={styles.icon} />
          <Controller
            control={control}
            name="email"
            render={({field:{onChange, value, onBlur}}) =>(
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#FFF"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            )}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
          <Controller
            control={control}
            name="password"
            render={({field:{onChange, value, onBlur}}) =>(
              <TextInput
                placeholder="Password"
                placeholderTextColor="#FFF"
                style={styles.input}
                secureTextEntry={showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  handlePasswordMatch();
                }}
              />
            )}
            />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
             <MaterialIcons name="visibility-off" size={20} color="#FF6A00" style={styles.iconRight}   />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={[styles.inputContainer, !passwordsMatch && styles.errorBorder]}>
          <Icon name="lock" size={20} color="#FF6A00" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#FFF"
            style={styles.input}
            secureTextEntry={showPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              handlePasswordMatch();
            }}
            // onEndEditing={() => handlePasswordMatch()} // Check match when user finishes editing confirm password
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons name="visibility-off" size={20} color="#FF6A00" style={styles.iconRight}   />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {!passwordsMatch && (
          <Text style={styles.errorMessage}>ERROR: Passwords Don’t Match!</Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit(sign_up) }>
          <Text style={styles.signUpText}>Sign Up</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={styles.iconRight} />
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
    flex: 1,
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
  errorBorder: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
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
    marginBottom: 10,
  },
  footerText: {
    color: '#FFF',
  },
  linkText: {
    color: '#FF6A00',
    fontWeight: 'bold',
  },
});

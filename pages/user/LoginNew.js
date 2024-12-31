import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
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
// import SocialAuthentication from '../../components/authentication/SocialAuthentication';


export default function SignInScreen({navigation}) {

  const { register, setValue, handleSubmit, control, reset, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const { setAuthState } = useContext(AuthContext)
  const [testApi, setTestApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");  // New state for error message

  const test_api = () => {
    axios.get(backend_url + "test/").then((response) => {
      console.log(response.data)
      setTestApi(true)
    })
  }

  useEffect(() => {
    test_api()
  }, []);

  const auth = ({ token }) => {
    axios.get(backend_url + "auth/auth/", {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      if (response.data.detail) {
        setAuthState({ username: "", id: 0, status: false })
      } else {
        console.log("authorized" + response.data)
        setAuthState({
          username: response.data.username, id: response.data.id, status: true,
          profile_photo: response.data.profile_photo,  age: response.data.age, height: response.data.height_cm,
        })
      }
    })
  }

  const login = data => {
    console.log(data)
    axios.post(backend_url + "user/login/", data).then((response) => {
      if (response.data.error) {
        setErrorMessage(response.data.error);  // Set error message
      } else {
        console.log("logged in")
        console.log(response.data)

        
        save("accessToken", response.data.access)
        auth({ token: response.data.access })
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }]
        })
      }
    }).catch((error) => {
      setErrorMessage("Login failed. Please check your credentials and try again.");  // Handle any other errors
    });
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
          <MaterialIcons name="fitness-center" size={40} color="#FF6A00" />
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

        <TouchableOpacity style={styles.signInButton} onPress={handleSubmit(login)}>
          <Text style={styles.signInText}>Sign In</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={styles.iconRight} />
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <Icon name="instagram" size={30} color="#FFF" style={styles.socialIcon} />
          <Icon name="facebook" size={30} color="#FFF" style={styles.socialIcon} />
          <Icon name="linkedin" size={30} color="#FFF" style={styles.socialIcon} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity>
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
  signInButton: {
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
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
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
});

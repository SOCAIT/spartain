import React from 'react'
import { StyleSheet, Modal, KeyboardAvoidingView, Image, TouchableOpacity, Text, View, TextInput, ScrollView, Platform } from 'react-native';
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
import { COLORS, SIZES, FONTS } from "../../constants"
import { Icon } from "@rneui/themed";
import { useForm, Controller } from 'react-hook-form'
import { save } from '../../helpers/Storage'
import SocialAuthentication from '../../components/authentication/SocialAuthentication';

function Login({ navigation }) {

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
          profile_photo: response.data.profile_photo
        })
        console.log(authState)
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

  const renderLogo = () => {
    return (
      <View style={styles.logo}>
        <Image
          source={require('../../assets/icons/spartan_logo_white.png')}
          resizeMode="contain"
          style={{ width: "60%", height: 170 }}
        />
      </View>
    )
  }

  const renderLoginButton = () => {
    return (
      <View style={{ margin: SIZES.padding * 4 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(login)}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}> Login </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderSignupButton = () => {
    return (
      <View style={{ margin: SIZES.padding * 3 }}>
        <TouchableOpacity
          style={styles.button2}
          onPress={sign_up}
        >
          <Text style={{ color: COLORS.black, ...FONTS.h3 }}> Create an account</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderSocialLogin = () => {
    return (
      <View style={styles.social}>
        <SocialAuthentication navigation={navigation} />
        <Text> {testApi ? "test successful" : "test failed"}</Text>
      </View>
    )
  }

  const renderForm = () => {
    return (
      <View style={styles.form}>
        <View style={{ marginTop: SIZES.padding * 1 }} >
          <Text style={{ color: COLORS.white, }}> Username </Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="Enter username"
                value={value}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
              />
            )}
          />
        </View>

        <View style={{ marginTop: SIZES.padding * 1 }} >
          <View>
            <Text style={{ color: COLORS.white, }}> Password </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                />
              )}
            />
            <TouchableOpacity
              style={styles.passwordVisibility}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={"eye-outline"} type="ionicon" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {errorMessage ? (  // Display error message if it exists
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1, backgroundColor: COLORS.dark }}>
      <ScrollView>
        {renderLogo()}
        {renderForm()}
        {renderLoginButton()}
        {renderSocialLogin()}
        {renderSignupButton()}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1.8,
    height: 40,
    color: COLORS.white,
    ...FONTS.body3,
  },
  logo: {
    marginTop: SIZES.padding * 5,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  social: {
    marginTop: SIZES.padding * 3,
    marginHorizontal: SIZES.padding * 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginTop: SIZES.padding * 3,
    marginHorizontal: SIZES.padding * 3
  },
  button: {
    height: 60,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    height: 40,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordVisibility: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    height: 30,
    width: 30,
  },
  errorContainer: {
    marginTop: SIZES.padding,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    ...FONTS.body4,
  },
});

export default Login;

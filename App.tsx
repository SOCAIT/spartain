import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,

} from 'react-native';
import axios from 'axios';
import { COLORS } from './constants';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthContext } from './helpers/AuthContext';
import { backend_url } from './config/config';
import { getValueFor } from './helpers/Storage';
import SignInScreen from './pages/user/LoginNew';
import SignUpScreen from './pages/user/SignupNew';
import Home from './pages/Home';
import Tabs from './navigation/tabs';

const MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(30, 30, 30)',
  },
};

const Stack = createNativeStackNavigator();

// Stylish SplashScreen with a fade-in logo animation.
const SplashScreen = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // initial opacity 0

  useEffect(() => {
    // Fade in the logo over 1.5 seconds.
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.splashContainer}>
      <Animated.Image
        source={require('./assets/icons/spartan_logo.png')} // Replace with your logo image path
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Text style={styles.splashTitle}>Your App Name</Text>
    </View>
  );
};


function App(): React.JSX.Element {
  const [token, setToken] = useState("");
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    profile_photo: ""
  });

  const [isLoading, setIsLoading] = useState(true);


  const test_api = () => {
    axios.get(`${backend_url}test/`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.error("Test API error:", error));
  };

  // First useEffect to retrieve token.
  useEffect(() => {
    getValueFor("accessToken", setToken);
    test_api();
  }, []);

  // Second useEffect to perform the auth check when token is available.
  useEffect(() => {
    if (!token) {
      // If no token, we are done loading.
      setIsLoading(false);
      return; // Only run if token is non-empty
    }

    axios.get(`${backend_url}auth/auth/`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((response) => {
        console.log("Auth response:", response.data);

        // Check if response returns an error detail, otherwise assume authorized.
        if (response.data.detail) {
          console.log("Error in auth");
          setAuthState({ username: "", id: 0, status: false, profile_photo: "" });
        } else {
          console.log("Authorized:", response.data);
          setAuthState({
            username: response.data.username, id: response.data.id, status: true,
            profile_photo: response.data.profile_photo,  age: response.data.age, height: response.data.height_cm,
            user_target: response.data.user_target, latest_body_measurement: response.data.latest_body_measurement,
             gender: response.data.gender, target_nutrition_data: response.data.target_nutrition_data,
          })
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
        setAuthState({ username: "", id: 0, status: false, profile_photo: "" });
      })
      .finally(() => {
        // Mark loading as complete whether authorized or not.
        setIsLoading(false);
      });
  }, [token]); // Dependency array ensures this runs whenever token changes

  // Debug logs (note that state updates are asynchronous)
  useEffect(() => {
    console.log("Current authState:", authState);
  }, [authState]);

  // While loading, render the splash screen.
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <NavigationContainer theme={MyTheme}>
      {authState.status ? (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.dark },
            }}
          >
            <Stack.Screen name="Tabs" component={Tabs} />
            {/* Add other authenticated screens if needed */}
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.dark },
            }}
          >
            <Stack.Screen name="Login" component={SignInScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
            {/* Include any unauthenticated screens */}
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },


  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150, // Adjust based on your design
    height: 150, // Adjust based on your design
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default App;
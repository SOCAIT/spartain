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
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './pages/onboarding/OnboardingScreen';
import Wizard from './pages/onboarding/OnboardingWizard';

import { runSahhaMinimalTest } from './services/HealthKitService';

axios.defaults.headers.common['Connection'] = 'close';

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

import Purchases, {LOG_LEVEL, CustomerInfo} from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_KHUmUupOtJXSBnhSNbxpSyzZnOd',
  android: 'google_D3E15744',
});

export async function initRevenueCat(appUserId: string) {
  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
       Purchases.configure({apiKey: REVENUECAT_API_KEY as string});
    } else if (Platform.OS === 'android') {
       Purchases.configure({apiKey: REVENUECAT_API_KEY as string});
     }
}
 
function App(): React.JSX.Element {
  const [token, setToken] = useState("");
  const [authState, setAuthState] = useState<any>({
    username: "",
    id: 0,
    status: false,
    profile_photo: "",
    isSubscribed: false,
    subscriptionExpiry: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(null as null | boolean);

  const [hr, setHr] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [sleepScore, setSleepScore] = useState<number | null>(null);
  const [wellbeingScore, setWellbeingScore] = useState<number | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  const getOnboardKey = (username?: string) => `hasOnboarded${username ? `_${username}` : ''}`;

  const test_api = () => {
    axios.get(`${backend_url}test/`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) =>{

       console.error("Test API error:", error)
       console.log('isAxiosError:', axios.isAxiosError(error));
       console.log('message:', error.message);
       console.log('config:', error.config);
       console.log('request:', error.request);   // <—— this should be an XMLHttpRequest instance
       console.log('response:', error.response); // likely undefined in Network Error
      });
  };

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 5));
    console.log(message);
  };

  const runTest = async () => {
    setLoading(true);
    try {
      addDebugLog('Configuring Sahha and fetching resting heart rate biomarkers...');
      const result = await runSahhaMinimalTest(addDebugLog);
      setHr(result.bpm);
      setSteps(result.steps);
      setSleepScore(result.sleepScore);
      setWellbeingScore(result.wellbeingScore);
      addDebugLog(`Fetched resting heart rate: ${result.bpm ?? 'none'} bpm, steps: ${result.steps ?? 'none'}`);
      addDebugLog(`Scores - sleep: ${result.sleepScore ?? 'none'}, wellbeing: ${result.wellbeingScore ?? 'none'}`);
    } catch (error) {
      addDebugLog(`Error during minimal HealthKit test: ${error}`);
      Alert.alert('Error', 'Minimal HealthKit test failed. See debug logs.');
    } finally {
      setLoading(false);
    }
  };
 
  // First useEffect to retrieve token.
  useEffect(() => {
    runTest();
   
    getValueFor("accessToken", setToken);
    test_api();
    initRevenueCat(authState.username);
    // Listen for RevenueCat entitlement updates and reflect in authState
    try {
      Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
        console.log('info', info);
        const premium = info?.entitlements?.active?.premium;
        // const isPro = !!premium;

        const pro = info?.entitlements?.active?.["Pro"];
        const isPro = !!pro;
        const expiry = (pro as any)?.expirationDate || null;

         
        setAuthState((prev: any) => ({
          ...prev,
          isSubscribed: isPro,
          subscriptionExpiry: expiry,
        }));
      }) ;
    } catch (_) {}
    // Initial RC status fetch
    (async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        const pro = info?.entitlements?.active?.["Pro"];
        const isPro = !!pro;
        const expiry = (pro as any)?.expirationDate || null;
        if (isPro) {
          setAuthState((prev: any) => ({ ...prev, isSubscribed: true, subscriptionExpiry: expiry }));
        }
      } catch (_) {}
    })();
    // Check and clear expired subscription data on app start
    const checkExpiredSubscription = async () => {
      try {
        const subscriptionExpiry = await AsyncStorage.getItem('subscriptionExpiry');
        if (subscriptionExpiry) {
          const expiryDate = new Date(subscriptionExpiry);
          const now = new Date();
          
          if (now > expiryDate) {
            console.log('Found expired subscription, cleaning up...');
            await AsyncStorage.setItem('isSubscribed', 'false');
            await AsyncStorage.removeItem('subscriptionExpiry');
            console.log('✅ Expired subscription cleaned up');
          }
        }
      } catch (error) {
        console.error('Error checking expired subscription:', error);
      }
    };
    
    checkExpiredSubscription();
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
          setAuthState({ username: "", id: 0, status: false, profile_photo: "", isSubscribed: false, subscriptionExpiry: null });
        } else {
          console.log("Authorized:", response.data);
          // Load subscription status from AsyncStorage with expiry check
          AsyncStorage.getItem('isSubscribed').then(isSubscribed => {
            AsyncStorage.getItem('subscriptionExpiry').then(subscriptionExpiry => {
              
              // Check if subscription has expired
              let finalIsSubscribed = false;
              let finalSubscriptionExpiry = null;
              
              if (isSubscribed === 'true' && subscriptionExpiry) {
                const expiryDate = new Date(subscriptionExpiry);
                const now = new Date();
                
                if (now <= expiryDate) {
                  // Subscription is still valid
                  finalIsSubscribed = true;
                  finalSubscriptionExpiry = subscriptionExpiry;
                } else {
                  // Subscription has expired, clean it up
                  console.log('🚨 Found expired subscription, cleaning up...');
                  AsyncStorage.setItem('isSubscribed', 'false');
                  AsyncStorage.removeItem('subscriptionExpiry');
                  finalIsSubscribed = false;
                  finalSubscriptionExpiry = null;
                }
              }
              
              setAuthState({
                username: response.data.username, id: response.data.id, status: true,
                profile_photo: response.data.profile_photo,  age: response.data.age, height: response.data.height_cm,
                user_target: response.data.user_target, latest_body_measurement: response.data.latest_body_measurement,
                gender: response.data.gender, target_nutrition_data: response.data.target_nutrition_data,
                dietary_preferences: response.data.dietary_preferences,
                activity_level: response.data.activity_level,
                isSubscribed: finalIsSubscribed,
                subscriptionExpiry: finalSubscriptionExpiry,
              });
              // RevenueCat login and overwrite with entitlement status if present
              (async () => {
                try {
                  await Purchases.logIn(String(response.data.id || response.data.username));
                  const info = await Purchases.getCustomerInfo();
                  const premium = (info as any)?.entitlements?.active?.premium;
                  const isPro = !!premium;
                  const expiry = premium?.expirationDate || null;
                  if (isPro || expiry) {
                    setAuthState((prev: any) => ({ ...prev, isSubscribed: isPro, subscriptionExpiry: expiry }));
                  }
                } catch (_) {}
              })();
            });
          });
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
        console.log('isAxiosError:', axios.isAxiosError(error));
        console.log('message:', error.message);
        console.log('config:', error.config);
        console.log('request:', error.request);   // <—— this should be an XMLHttpRequest instance
        console.log('response:', error.response); // likely undefined in Network Error
        setAuthState({ username: "", id: 0, status: false, profile_photo: "", isSubscribed: false, subscriptionExpiry: null });
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

  // Re-evaluate onboarding flag whenever username changes
  useEffect(() => {
    const checkOnboardFlag = async () => {
      // Temporarily set to null so UI shows splash while we fetch, preventing UI glitch
      setHasOnboarded(null);
      const flag = await AsyncStorage.getItem(getOnboardKey(authState.username));
      setHasOnboarded(!!flag);
    };
    checkOnboardFlag();
  }, [authState.username]);

  // Re-evaluate onboarding flag whenever a user logs in/out
  useEffect(() => {
    const refreshFlag = async () => {
      const flag = await AsyncStorage.getItem(getOnboardKey(authState.username));
      setHasOnboarded(!!flag);
    };
    // Only refresh when auth status becomes true (logged in) so wizard decision is up-to-date
    if (authState.status) {
      refreshFlag();
    }
  }, [authState.status, authState.username]);

  // Logout clears token & resets auth state
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      try { await Purchases.logOut(); } catch (_) {}
      setToken('');
      setAuthState({ username: "", id: 0, status: false, profile_photo: "", isSubscribed: false, subscriptionExpiry: null });
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Minimal deleteAccount implementation used by Settings/Profile
  const deleteAccount = async () => {
    try {
      const response = await axios.delete(`${backend_url}user/delete/`);
      // Clear stored tokens & state
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('isSubscribed');
      await AsyncStorage.removeItem('subscriptionExpiry');
      setToken('');
      setAuthState({ username: "", id: 0, status: false, profile_photo: "", isSubscribed: false, subscriptionExpiry: null });
      return { success: response.status === 200 || response.status === 204 };
    } catch (error) {
      console.error('Delete account error:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  };

  // Add updateSubscriptionStatus function for subscription management
  const updateSubscriptionStatus = async (isSubscribed: boolean, expiryDate: string | null = null) => {
    try {
      await AsyncStorage.setItem('isSubscribed', isSubscribed.toString());
      if (expiryDate) {
        await AsyncStorage.setItem('subscriptionExpiry', expiryDate);
      }
      
      setAuthState((prev: any) => ({
        ...prev,
        isSubscribed,
        subscriptionExpiry: expiryDate,
      }));
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  // While loading auth or onboarding flag
  if (isLoading || hasOnboarded === null) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout, deleteAccount, updateSubscriptionStatus }}>
      <NavigationContainer theme={MyTheme}>
      {authState.status ? (
        hasOnboarded ? (
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.dark } }}>
            <Stack.Screen name="Tabs" component={Tabs} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.dark } }}>
            <Stack.Screen name="Onboarding" component={Wizard} />
            <Stack.Screen name="Tabs" component={Tabs} />
          </Stack.Navigator>
        )
      ) : (
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.dark } }}>
            <Stack.Screen name="Login" component={SignInScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
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
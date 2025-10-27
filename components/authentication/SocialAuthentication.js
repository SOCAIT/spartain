// React Native code for Google and Apple authentication

import React, {useContext} from 'react';
import { View, Alert, Platform } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthContext} from "../../helpers/AuthContext"
import { backend_url } from '../../config/config';
// Replace these with your actual Client IDs from Google Cloud Console
const GOOGLE_WEB_CLIENT_ID_DEV = "807169666347-i8ve04ss9ru2hm11o60aif544igirqts.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID_RELEASE = "807169666347-e3b61fth7bjpfldkkmh0ddvqdvlf9qo0.apps.googleusercontent.com"

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: __DEV__ ? GOOGLE_WEB_CLIENT_ID_DEV : GOOGLE_WEB_CLIENT_ID_RELEASE,
  offlineAccess: true,
  scopes: ['profile', 'email'],
});
const SocialAuthentication = ({navigation}) => {

  const {setAuthState} = useContext(AuthContext)

  const handleGoogleSignIn = async () => {
    try {
      // Check if Play Services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In successful:', userInfo);

      const idToken = userInfo.idToken;

      if (!idToken) {
        Alert.alert('Error', 'Failed to get authentication token from Google');
        return;
      }

      // Send idToken to your backend for verification
      const response = await axios.post(backend_url + "user/google_auth/", {
        code: idToken
      });

      console.log('Backend response:', response.data);

      if (response.data.access_token) {
        // Save the access token
        await AsyncStorage.setItem('token', response.data.access_token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        // Update auth state
        setAuthState({
          token: response.data.access_token,
          authenticated: true,
          user: response.data.user,
          username: response.data.user.username,
          id: response.data.user.id,
          status: true,
        });

        // Check onboarding status
        const onboardKey = `hasOnboarded_${response.data.user.username}`;
        const alreadyOnboarded = await AsyncStorage.getItem(onboardKey);

        if (alreadyOnboarded) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding', params: { username: response.data.user.username } }]
          });
        }

        Alert.alert('Success', 'Signed in with Google successfully!');
      } else {
        Alert.alert('Error', 'Failed to authenticate with backend');
      }

    } catch (error) {
      console.error('Google Sign-In error:', error);
      
      // Handle specific error codes
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in
        console.log('User cancelled Google Sign-In');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Error', 'Sign-In already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated');
      } else {
        Alert.alert('Error', `Google Sign-In failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // Perform Apple Sign-In
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, email, fullName } = appleAuthRequestResponse;

      if (!identityToken) {
        Alert.alert('Error', 'Failed to get authentication token from Apple');
        return;
      }

      // Send identityToken to your backend
      const response = await axios.post(backend_url + "user/apple_auth/", {
        code: identityToken,
        email: email,
        fullName: fullName
      });

      console.log('Backend response:', response.data);

      if (response.data.access_token) {
        // Save the access token
        await AsyncStorage.setItem('token', response.data.access_token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

        // Update auth state
        setAuthState({
          token: response.data.access_token,
          authenticated: true,
          user: response.data.user,
          username: response.data.user.username,
          id: response.data.user.id,
          status: true,
        });

        // Check onboarding status
        const onboardKey = `hasOnboarded_${response.data.user.username}`;
        const alreadyOnboarded = await AsyncStorage.getItem(onboardKey);

        if (alreadyOnboarded) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding', params: { username: response.data.user.username } }]
          });
        }

        Alert.alert('Success', 'Signed in with Apple successfully!');
      } else {
        Alert.alert('Error', 'Failed to authenticate with backend');
      }

    } catch (error) {
      console.error('Apple Sign-In error:', error);
      
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User cancelled Apple Sign-In');
      } else {
        Alert.alert('Error', `Apple Sign-In failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <GoogleSigninButton
        style={{ width: 150, height: 60 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={handleGoogleSignIn}
      />
      {Platform.OS === 'ios' && (
        <AppleButton
          style={{ width: 150, height: 60, marginLeft: 20 }}
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.SIGN_IN}
          onPress={handleAppleSignIn}
        />
      )}
    </View>
  );
};

export default SocialAuthentication;

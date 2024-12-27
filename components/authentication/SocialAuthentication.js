// React Native code for Google and Apple authentication

import React, {useContext} from 'react';
import { View, Button, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton,   statusCodes } from '@react-native-google-signin/google-signin';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';

import {AuthContext} from "../../helpers/AuthContext"


import {save,getValueFor} from '../../helpers/Storage'


import { backend_url } from '../../config/config';
const GOOGLE_ANDROID_CLIENT_ID_DEV = "1027987981704-rnglrifqhtar7o53i0jcvaiila060mfb.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID_DEV = "1027987981704-cnmne27tpad01j4fdhpcgpp6tpd5okfl.apps.googleusercontent.com"

const GOOGLE_WEB_CLIENT_ID_RELEASE ="807169666347-e3b61fth7bjpfldkkmh0ddvqdvlf9qo0.apps.googleusercontent.com"
const GOOGLE_ANDROID_CLIENT_ID_RELEASE ="807169666347-gl1rd1qouc3qgs2fktvenl42d3snmsim.apps.googleusercontent.com"


// if (__DEV__){
//   GoogleSignin.configure({
//     webClientId:  GOOGLE_WEB_CLIENT_ID_DEV  ,
//     androidClientId: GOOGLE_ANDROID_CLIENT_ID_DEV,
//     //iosClientId: GOOGLE_IOS_CLIENT_ID,
//     scopes: ['profile', 'email'],
//   });
// }
// else {
//   GoogleSignin.configure({
//     webClientId:  GOOGLE_WEB_CLIENT_ID_RELEASE ,
//     androidClientId: GOOGLE_ANDROID_CLIENT_ID_RELEASE,
//     //iosClientId: GOOGLE_IOS_CLIENT_ID,
//     scopes: ['profile', 'email'],
//   });
// }
GoogleSignin.configure({
  webClientId:  GOOGLE_WEB_CLIENT_ID_DEV  ,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID_DEV,
  //iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

import axios from 'axios';
const SocialAuthentication = ({navigation}) => {

  const {setAuthState} = useContext(AuthContext)

  const checkPlayServices = async () => {
    try {
      // Check if Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      Alert.alert('Play Services Available', 'Google Play Services are available and up to date.');
      console.log('Google Play Services are available.');
    } catch (error) {
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play Services not available or outdated
        Alert.alert('Error', 'Google Play Services are not available or outdated.');
        console.log('Play Services not available or outdated:', error.message);
      } else {
        // Some other error
        Alert.alert('Error', 'An unknown error occurred while checking Play Services.');
        console.log('Unknown error while checking Play Services:', error.message);
      }
    }
  };

  const logged_in = (response) => {
      //deleteItemAsync("access-token")
      save("accessToken", response.data.access_token)
      // auth({token: response.data.access})
      //setAuthState({username:response.data.username,id: response.data.id,status:true,
       // profile_photo: response.data.profile_photo});
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }]
      })
  }

  const handleGoogleSignIn = async () => {
    try {
      // Alert.alert("socia 1")

      //const hasPlayServices = await GoogleSignin.hasPlayServices();

      checkPlayServices()

      // Alert.alert("socia 2")

      const userInfo = await GoogleSignin.signIn();

      Alert.alert("socail 3")

      console.log(userInfo)
      console.log(backend_url)
      idToken = userInfo.idToken

      // Alert.alert(idToken)

      axios.get(backend_url +"test/").then((response) => {
        console.log(response.data)

      })
  
      axios.post(backend_url +"user/google_auth/", {code: idToken}).then((response) => {
        console.log(response.data)
        Alert.alert("sucess")
        setAuthState({username:response.data.user.username, id: response.data.user.id,status:true,})
        
        logged_in(response)

      })

      // send to back for validation

      // let resp = await axios({
      //   method: 'get',
      //   url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`,
      //   withCredentials: true,
      // });

      // console.log(resp.data) 

      // Send userInfo.idToken to your backend
      Alert.alert('Success', 'Google authentication successful');
    } catch (error){
      Alert.alert('Error', `Google Sign-In failed: ${error.message}`);
    //   if (isErrorWithCode(error)) {
    //     switch (error.code) {
    //       case statusCodes.IN_PROGRESS:
    //         // operation (eg. sign in) already in progress
    //         Alert.alert("already in progress")
    //         break;
    //       case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //         Alert.alert("play services not available or outdated")
    //         // Android only, play services not available or outdated
    //         break;
    //       default:
    //         // some other error happened
    //         Alert.alert("other error")
    //     }
    // }  else {
    //   console.error('Google authentication error:', error);
    //   Alert.alert('Error', 'Google authentication failed');
    // }
  }
  };

  // Somewhere in your code
_signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    setState({ userInfo, error: undefined });
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // user cancelled the login flow
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // play services not available or outdated
          break;
        default:
        // some other error happened
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
};

  const handleAppleSignIn = async () => {
    try {
      const credential = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
      });
      // Send credential.identityToken to your backend
      Alert.alert('Success', 'Apple authentication successful');
    } catch (error) {
      console.error('Apple authentication error:', error);
      Alert.alert('Error', 'Apple authentication failed');
    }
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <GoogleSigninButton
        style={{ width: 150, height: 70, }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={handleGoogleSignIn}
      />
      <AppleButton
        style={{ width: 150, height: 60, marginLeft:20, marginTop:5 }}
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={handleAppleSignIn}
      />
    </View>
  );
};

export default SocialAuthentication;

  
import React, {useState,useEffect,useContext, createContext, useCallback, } from 'react';
import {
  SafeAreaView,
  ScrollView,
  // SnapshotViewIOSComponent,
  StatusBar,
  StyleSheet,
  Alert,
  Text,
  useColorScheme,
  View,
} from 'react-native';


//import LineUI from './components/Analytics/Lines/LineUI';

import axios from 'axios';
import { COLORS } from './constants';

import {createNativeStackNavigator}  from "@react-navigation/native-stack"
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'


const MyTheme = {
  ...DefaultTheme,
    dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(30, 30, 30)',
  },
};
const Stack = createNativeStackNavigator()

import { AuthContext } from './helpers/AuthContext';

import { backend_url } from './config/config';
import { getValueFor } from './helpers/Storage'; 
import SignInScreen from './pages/user/LoginNew';
import SignUpScreen from './pages/user/SignupNew';
import Home from './pages/Home'
import Tabs from './navigation/tabs';

function App(): React.JSX.Element {
  const [token, setToken] = useState("")
  //const {authState,setAuthState}=  useAuthContext;
  
  const [authState,setAuthState] = useState({username:"",id:0, status:false,profile_photo:""})
 
  const test_api = () =>{
    axios.get(backend_url +"test/").then((response) => {
      console.log(response.data)
  
    })
   }

   useEffect(() => {
    //loadDataCallback();
  
    getValueFor("accessToken",setToken)

    test_api()

    console.log(authState)
    console.log(token)
    axios.get(backend_url +"auth/auth/",
    {headers:{ 
      'Authorization': 'Bearer ' + token
    }}).then((response) =>{
      console.log(response) 
      setSoon(false) 
  
      if (response.data.detail){
        console.log("error in auth")
        setAuthState({username:"",id:0, status:false, profile_photo:""})
      }
      else {   
        console.log("authorized" + response.data)
        setAuthState({username: response.data.username, id: response.data.id,status:true,
           })
        console.log(authState) 
      }
   }) 
   
   console.log(authState)
  }, []);

  return (
    <AuthContext.Provider value={{authState, setAuthState}}>
    {/* <SafeAreaView>
      <Text >App 2</Text>

    </SafeAreaView> */}

<NavigationContainer theme={ MyTheme}>
    <Stack.Navigator
        screenOptions={{
           headerShown: false,
           contentStyle: { backgroundColor: COLORS.dark}
        }} 
        initialRouteName={ authState.status ? "Tabs" :"Login"}
        
        //initialRouteName={"Test"}
       > 
  
        {/* {soon ? 
         <Stack.Screen name="Soon" component={Soon} /> :!authState.status ? 
            <>
            <Stack.Screen name="Login" component={Login} />
           
            </>
         :
         <Stack.Screen name="drawer" component={CustomDrawer} /> 
        //  <Stack.Screen name="Tabs" component={Tabs} /> CustomDrawer
         }  */}
        <Stack.Screen name="Chat" component={Home} />
        <Stack.Screen name='Signup'  component={SignUpScreen} />
        <Stack.Screen name='Login'  component={SignInScreen} />
        
         <Stack.Screen name="Tabs" component={Tabs} />

        {/* <Stack.Screen name="Test" component={CustomDrawer} /> */}
        </Stack.Navigator>
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
});

export default App;

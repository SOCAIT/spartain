import React from 'react'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import { StyleSheet,Modal, AppRegistry, Text,FlatList,Platform} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
 

import TabIcon from '../components/TabIcon';
import Soon from '../pages/Soon';
import Program from '../pages/Program/Program';
import WorkoutPlanScreen from '../pages/Program/WorkoutPlanScreen';

import { Card, Button, Icon} from '@rneui/themed';
// import Profile from '../pages/Profile';
import NutritionStack from '../pages/Nutrition/NutritionStack';
 
import { COLORS } from '../constants';
import ProfileStack from '../pages/user/ProfileStack';
// import Settings from '../pages/settings/Settings';
import Spaces from '../pages/gyms/Spaces';
import AIStack from '../pages/chat/AIStack';
import MainScreen from '../pages/user/Main';
import Profile from '../pages/Profile';
import SettingsStack from '../pages/settings/SettingsStack';

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
    dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.dark,
  },
};


const Tabs = () => {
    return (
         <NavigationContainer independent={true} theme={MyTheme}>  
        <Tab.Navigator
           initialRouteName="Chat"
        //  tabBarOptions={{
        //   style: {
        //       backgroundColor: COLORS.primary,
        //       padding: Platform.OS=== 'ios' ? 25 : 0,
        //       // height: 60,
        //       // marginBottom: 10

        //       //borderTopColor: "transparent",
        //   }
        //  }}

        screenOptions={
        
            ({route}) => ({

            
            
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let isMain = false
    
              switch (route.name) {
                case 'Home':
                  iconName = focused 
                    ? 'home' 
                    : 'home-outline';
                  break;
                case 'Nutrition':
                  iconName = focused
                  ? require('../assets/icons/nutri.png')
                  : require('../assets/icons/nutri.png')
                break;
                case 'Profile':
                    iconName = focused
                    ? require('../assets/icons/profile.png')
                    : require('../assets/icons/profile.png')
                break;
                case 'AddPost':
                  iconName = focused 
                  ? 'add-circle' 
                  : 'add-circle-outline';
                  break;
                case 'Soon':
                    iconName = focused 
                    ? require('../assets/icons/feed.png' )
                    : require('../assets/icons/feed.png')
                    break;
                case 'Program':
                    iconName = focused 
                    ? require('../assets/icons/fitness.png')
                    : require('../assets/icons/fitness.png')
                    break;
                // case 'Drawer':
                //     iconName = focused 
                //     ? 'business' 
                //     : 'business-outline';
                //     break;
                case 'Chat':
                  isMain = true
                  iconName = focused 
                    ? 'paper-plane' 
                    : 'paper-plane-outline';
                    break;
                case 'Entangle':
                  isMain = true
                  iconName = focused 
                   ? 'paper-plane' 
                   : 'paper-plane-outline';
                   break;
              }
    
              // You can return any component that you like here!
              return (
                // <Icon name={iconName} type="ionicon" size={size} color={ COLORS.white} />
                <TabIcon focused={focused} icon={iconName} isMain={isMain} size={25} />
              );
            },
            "tabBarShowLabel": false,
            headerShown: false,
            "contentStyle":{
              backgroundColor:COLORS.dark
            },
            "tabBarStyle": [
              {
                  backgroundColor: COLORS.primary,
                  borderTopColor: "transparent",
                  height: 80,
                  padding: Platform.OS=== 'ios' ? 25 : 0
                  // borderTopLeftRadius:5,
                  // borderTopRightRadius: 5
                  
              }
              ]
          
              
          })
          
            // {"tabBarShowLabel": false}
             
          
          

        }
        >
            <Tab.Screen name="Profile" component={ProfileStack} />
            <Tab.Screen name="Chat" component={AIStack} />

            <Tab.Screen name="Program" component={Program} />
            <Tab.Screen name="Nutrition" component={NutritionStack} />
            {/* <Tab.Screen name="Soon" component={SettingsStack} /> */}





            
            {/* <Tab.Screen name="Gallery" component={Gallery} /> */}
            {/* <Tab.Screen name="Drawer" component={CustomDrawer} /> */}
          

        </Tab.Navigator>
        </NavigationContainer>
       
    )
}

export default Tabs;
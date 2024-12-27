import React,{ useState, useEffect,useContext } from "react";
import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer'

import { StyleSheet,Modal,Image, TouchableOpacity, AppRegistry, Text, View, Button,TextInput , ScrollView,FlatList,Platform} from 'react-native';
import { Ionicons } from 'react-native-vector-icons/Ionicons'; 
import { Icon } from "@rneui/themed";
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from "../helpers/AuthContext"


import {COLORS,SIZES, FONTS} from '../constants';
import Payment from '../pages/Wallet/Payment'
 import Wallet from "../pages/Wallet/Wallet";
 import MyCards from "../pages/Wallet/MyCards";
 import Charity from "../pages/Society/Charity";
 import Analytics from "../pages/Analytics";
 import CheckoutForm from "../components/CheckoutForm";
 import CheckoutScreen from "../pages/Wallet/CheckoutScreen";
import Tabs from "./tabs";

import {connect} from "react-redux"
import { setSelectedTab } from "../stores/tabs/tabActions";
//import MyCards from "../pages/Wallet/MyCards";

import {backend_url_exodia} from "../config/config"
import PostComponentTest from "../components/PostComponentTest";

import axios from "axios";
import AddIoT from "../pages/Main/IoT/AddIoT";

const Drawer = createDrawerNavigator()



const logout = () => {

  //localStorage.removeItem("accessToken");
  axios.get(backend_url_exodia +"logout/")
  .then((response) => {
      console.log(response)
      setAuthState({username:"",id:0,status:false})
      deleteToken("accessToken")
      navigation.navigate("Login");

  })
 
 
  
}



const CustomDrawerItem = ({label, icon, isFocused, onPress}) => {
    return (
        <TouchableOpacity
          style = {{
              flexDirection: 'row',
              height: 40,
              marginBottom: SIZES.base,
              alignItems: 'center',
              paddingLeft: SIZES.radius,
              borderRadius: SIZES.base,
              backgroundCOLOR: isFocused ? COLORS.transparent : null
          }}
          onPress={onPress}
        >
        <Icon name={icon} type="ionicon" size={20} color={ COLORS.lightGray} />

        <Text style ={{
             marginLeft: 15,
             color: COLORS.lightGray,
             ...FONTS.h4
        }}>
            {label}
        </Text>

        </TouchableOpacity>
    )
}

const CustomDrawerContent = ({navigation, selectedTab, setSelectedTab}) => {

    const {authState} = useContext(AuthContext)

    return (
        <DrawerContentScrollView
             scrollEnabled={true}
             contentContainerStyle={{ flex: 1}}
        >
             <View 
               style={{
                   flex: 1,
                   paddingHorizontal: SIZES.radius
               }}
             >
                  {/* Close */}
                  <View 
                    style ={{
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        
                    }}
                  >
                      <TouchableOpacity
                          style ={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => navigation.closeDrawer()}
                      >
                            <Icon name="close" type="ionicon" size={35} color={ COLORS.white} />
                           
                      </TouchableOpacity>

                  </View>
                  {/* Profile */}

                  <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        alignItems: 'center'
                    }}
                    onPress={() => {console.log("Profile")}}
                  >
                    <Image
                      style={{width: 50, height:50, borderRadius:SIZES.radius, marginRight:10}}
                      source={{
                        uri: authState.profile_photo//"https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/08/Lelouch-Zero.jpg?q=50&fit=crop&w=960&h=500&dpr=1.5"
                       }}
                     />
                     <View>
                         <Text style={{ color: COLORS.white, ...FONTS.h4}}>
                             {authState.username}
                         </Text>
                     </View>
              


                  </TouchableOpacity>


                  {/* Drawer Items */}
                  <View style={{
                      flex: 1,
                      marginTop: SIZES.padding
                  }}>
                       <CustomDrawerItem  // Home analogue Tab
                        label={"Home"}
                        icon={"home-outline"}
                        isFocused={selectedTab==="Home"}
                        onPress={() => {
                           setSelectedTab("Home")
                           navigation.navigate("Tab")
                        }}
                        activeTintColor= {COLORS.white}
                        >

                      </CustomDrawerItem>

                      <CustomDrawerItem  // Wallet analogue Payment
                        label={"Wallet"}
                        icon={"card"}
                        isFocused={selectedTab==="Wallet"}
                        onPress={() => {
                          setSelectedTab("Wallet")
                          navigation.navigate("Wallet")
                       }}
                      >

                      </CustomDrawerItem>

                     <CustomDrawerItem
                        label={"Analytics"}
                        icon={"stats-chart-outline"}
                        isFocused={selectedTab==="Analytics"}
                        onPress={() => {
                          setSelectedTab("Analytics")
                          navigation.navigate("Analytics")
                       }}
                      >

                      </CustomDrawerItem>

                      <CustomDrawerItem
                        label={"Multiverse"}
                        icon={"logo-react"}>

                      </CustomDrawerItem> 

                      <CustomDrawerItem
                        label={"IoT"}
                        icon={"tv-outline"}
                        isFocused={selectedTab==="IoT"}
                        onPress={() => {
                          setSelectedTab("IoT")
                          navigation.navigate("IoT")
                       }} >

                      </CustomDrawerItem> 

                     
                      <View style={{
                           height: 1,
                           marginVertical: SIZES.radius,
                           marginLeft: SIZES.radius,
                           backgroundColor: COLORS.black
                          
                      }}>

                      </View>

                       {/* <CustomDrawerItem
                        label={"Charity"}
                        icon={"people-circle-outline"}>

                      </CustomDrawerItem> */}

                      <CustomDrawerItem
                        label={"Settings"}
                        icon={"settings-outline"}>

                      </CustomDrawerItem> 

                       <CustomDrawerItem
                        label={"Logout"}
                        icon={"exit-outline"}
                        onPress={() => logout()}
                        >

                      </CustomDrawerItem>

                  </View>


             </View>


        </DrawerContentScrollView>

    )
}


 const CustomDrawer = ({selectedTab, setSelectedTab}) => {
    
    

    return (
         <View style={styles.drawer}>
             
             <Drawer.Navigator 
                    drawerType="slide"
                    
                    drawerStyle={{
                        flex: 1,
                        width: '65%',
                        paddingRight: 20,
                        backgroundColor: '#ff0000'
                    }}
                    sceneContainerStyle={{
                        backgroundColor: '#ff0000'
                    }} 
                    screenOptions={{
                        headerShown: false,
                        drawerStyle: {
                          backgroundColor: COLORS.primary
                        }
                      }}    
                      
                    contentOptions= {{
                        style: {
                         backgroundColor: 'blue',
                         //flex: 1
                       }
                    }}
                    initialRouteName="Home"
                    drawerContent={ props => {
                        return (
                            <CustomDrawerContent 
                                 navigation={props.navigation}
                                 selectedTab={selectedTab}  
                                 setSelectedTab={setSelectedTab}
                            />
                        ) 
                    }}
             >


                  <Drawer.Screen name="Tab">
                     {props => <Tabs {...props} />}
                 </Drawer.Screen> 
                 {/* <Drawer.Screen name="Tab">
                     {props => <Tabs {...props} />}
                 </Drawer.Screen> */}

                 <Drawer.Screen name="Wallet">
                     {props => <Wallet {...props} />}
                 </Drawer.Screen>  

                 <Drawer.Screen name="MyCards">
                     {props => <MyCards {...props} />}
                  </Drawer.Screen>   

                 <Drawer.Screen name="AddNewCard">
                     {props => <Payment {...props} />}
                </Drawer.Screen> 

                 <Drawer.Screen name="Charity">
                     {props => <Charity {...props} />}
                 </Drawer.Screen> 

                 <Drawer.Screen name="Analytics">
                     {props => <Analytics {...props} />}
                 </Drawer.Screen>

                 <Drawer.Screen name="CheckoutForm">
                     {props => <CheckoutForm {...props} />}
                 </Drawer.Screen>

                 <Drawer.Screen name="IoT">
                    {props => <AddIoT {...props} />}
                 </Drawer.Screen>

                 <Drawer.Screen name="Checkout">
                     {props => <CheckoutScreen {...props} />}
                 </Drawer.Screen>

             </Drawer.Navigator>

         </View>
    )
} 


const styles = StyleSheet.create({
  
    drawer: {
        flex: 1,
        //backgroundColor: COLORS.blac
    } 
  
  });

  function mapStateToProps(state) {
       return {
         selectedTab: state.tabReducer.selectedTab
       }
  }

  function mapDispatchToProps(dispatch) {
     return {
       setSelectedTab: (selectedTab) => {
         return dispatch(setSelectedTab(selectedTab))
       }
     }
  }

export default connect(mapStateToProps, mapDispatchToProps)
(CustomDrawer)

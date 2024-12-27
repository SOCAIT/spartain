import { View, Text, Image} from 'react-native'
import React from 'react'
import { Icon } from "@rneui/themed";

import { FONTS, COLORS } from '../constants'
import IconMain from './IconMain';
const TabIcon = ({ focused, icon, iconStyle, label, size, isMain}) => {

  let icon_v = '../assets/icons/'+ icon
  if (isMain){
    return ( 
        <View style={{
        alignItems:'center', 
        justifyContent:"center",
        width: 60,
        height: 60, 
        borderRadius: 50,
        backgroundColor: COLORS.darkOrange

        }}>

                <Image
                    source={require("../assets/icons/spartan_logo.png")}
                    resizeMode="contain"
                    style={{
                        width: 60, 
                        height: 60,
                        shadowColor: focused ? COLORS.primary : COLORS.darkgray,
                        tintColor: focused ? COLORS.primary : COLORS.darkgray
                        
                    }}
                />
          {/* <Icon name={icon} type="ionicon" size={size} 
              color={focused ? COLORS.white : COLORS.darkgray}  /> */}
          
        </View> 
      )

  }

  else {
    return (
        <View style={{alignItems:'center', justifyContent:"center"}}>
            {/* <Icon name={icon} type="ionicon" size={size} 
              color={focused ? COLORS.secondary : COLORS.secondary}  /> */}
            <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width: 40, 
                        height: 40,
                        shadowColor: focused ? COLORS.darkOrange : COLORS.darkgray,
                        tintColor: focused ? COLORS.darkOrange: COLORS.darkgray
                        
                    }}
                />
            {/* <Text style={{color:focused ? COLORS.white : COLORS.darkgray, ...FONTS.h4}}>
             {label}
            </Text> */}
        </View>
      )

  }
  
}

export default TabIcon
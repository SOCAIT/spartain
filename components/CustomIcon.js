import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

import { SIZES } from '../constants'

const CustomIcon = ({uri, color, size}) => {
  return (
    <View style={styles.logo}>
             <Image
                    source={uri}
                    resizeMode="contain"
                    style={{
                        width: size, 
                        height: size,
                        //color: color,
                        tintColor: color
                        
                    }}
                />
            {/* <Text style={{color:focused ? COLORS.white : COLORS.darkgray, ...FONTS.h4}}>
             {label}
            </Text> */}
        </View>
  )
}

const styles = StyleSheet.create({
   
  
  logo: {
   
    padding: SIZES.padding,
    //height: 30,
    
    // alignItems: 'center',
    // justifyContent:'center',
 }, 


})

export default CustomIcon
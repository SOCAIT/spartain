import { View, Text, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'

const IconMain = ({uri, color}) => {
    return (
        <View style={{alignItems:'center', justifyContent:"center"}}>
             <Image
                    source={uri}
                    resizeMode="contain"
                    style={{
                        width: 70, 
                        height: 70,
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

export default IconMain
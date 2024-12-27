import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import CustomIcon from './CustomIcon'

import { SIZES } from '../constants'

const CustomIconButton = ({uri, color, size, onPress}) => {
   //style={styles.logo}
  return (
     <TouchableOpacity onPress={() => onPress()}   >  
        <CustomIcon uri={uri} color={color} size={size}/>
     </TouchableOpacity>
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
export default CustomIconButton
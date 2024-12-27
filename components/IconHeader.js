import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import IconMain from './IconMain'

import { COLORS, SIZES} from '../constants'
const IconHeader = () => {

    const renderLogo = () => {
        return (
          <IconMain uri={require("../assets/icons/spartan_logo_white.png")} color={COLORS.darkOrange}/>
  
  
      )}
  
      const renderHeader = () =>{
        return (<View >
          <View style={styles.logo}>
         
  
         {/* <Icon name={"logo-react"} type="ionicon" size={30} color={ COLORS.primary} /> */}
         {renderLogo()}
         
  
         </View>
       </View>)
      }
   
  return (
    <View style={
        styles.container
        //paddingTop: SIZES.padding
     }>
      {renderHeader()}
      </View>
  )
}


const styles = StyleSheet.create({
    
  
    logo: {
      marginTop: SIZES.padding ,
      marginBottom: SIZES.padding,
      height: 30,
      
      alignItems: 'center',
      justifyContent:'center',
   },

   container: {
    flexDirection: 'row', // Horizontal arrangement
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    width: '100%', // Takes the full width of the screen
    height: 60, // You can adjust the height as needed
    backgroundColor: COLORS.primary, // Example background color
    paddingHorizontal: 16, // Padding on the left and right sides
    marginBottom: 20
  },
    
   
  });

export default IconHeader
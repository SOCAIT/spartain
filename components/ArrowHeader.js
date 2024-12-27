import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'

import { COLORS } from '../constants'
const ArrowHeader = ({navigation, title, paddingTop, height}) => {

    const renderHeader = () => {
        return (
          <View style={{height:40, marginBottom:10, flexDirection:"row", paddingTop:paddingTop, paddingLeft:10}}>
           <TouchableOpacity style={styles.overlayButton} onPress={() => navigation.goBack() } >
            {/* <Icon name={"chevron-back-outline"} type="ionicon" size={30} color={ COLORS.black} /> */}
           <Image source={require("../assets/icons/back_arrow.png")} style={{
                             width: 30, 
                             height: 30,
                             overlayColor: COLORS.white,
                             tintColor: COLORS.white
                              
                         }} />
           </TouchableOpacity>
           <Text style={styles.overlayText}>{title}</Text>

    
           </View>
     
        )
     }
  return (
    <View>
      {renderHeader()}
    </View>
  )
}



const styles = StyleSheet.create({
   
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: COLORS.primary
    },
  
    image: {
      width: '100%',
      height: 300, // Adjust the image height as needed
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
  
 
    overlayText: {
    //   position: 'absolute',
    //   top: 5, // Adjust the top position as needed
    //   left: 20, // Adjust the left position as needed
      fontSize: 20,
      fontWeight: 'bold',
      color:  COLORS.white, // Set text color
    },
    overlayButton: {
    //   position: 'absolute',
    //   top: 5, // Adjust the top position as needed
    //   left: 10, // Adjust the left position as needed
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.primary, // Set text color
      marginBottom:20,
      marginRight: 20
    },
  });
export default ArrowHeader
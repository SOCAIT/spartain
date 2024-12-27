import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


function ArrowHeaderNew({navigation, title, paddingTop}) {
  return (
    <View style={styles.header}  >
    <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack() }>
      <MaterialIcons name="arrow-back-ios" size={20} color="#FFF" style={{alignItems:'center', justifyContent: 'center'}}/>
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
  </View>
  )
}

const styles = StyleSheet.create({
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      padding: 10
    },
    headerText: {
      //   position: 'absolute',
      //   top: 5, // Adjust the top position as needed
      //   left: 20, // Adjust the left position as needed
        fontSize: 15,
        fontWeight: 'bold',
        color:  "#fff", // Set text color,
        marginLeft:10
      },
    backArrow: {
       backgroundColor: "#333",
       borderRadius: 10,
       padding:5,
       justifyContent: 'center',
       alignItems:'center'
       
    },
    
  });
  
export default ArrowHeaderNew
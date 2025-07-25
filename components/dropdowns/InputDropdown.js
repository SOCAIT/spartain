import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import RNPickerSelect from 'react-native-picker-select';
import { COLORS } from '../../constants';


export const InputDropdown = ({placeholder_value, items, onValueChange, selectedValue}) => {

    const placeholder = {
      label: placeholder_value,
      value: null,
      color: '#9EA0A4',
    };
   
    
    return (
     <View style={styles.view}>
      <RNPickerSelect
        value={selectedValue}
        onValueChange={onValueChange}
        placeholder={placeholder}
        style={styles}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return   (
           <View style={{alignItems:'center', justifyContent:'center'}}>
          <MaterialIcons name="expand-more" size={30} color="#FF6A00" style={{marginTop:5}} />
          </View>
        )
        }}
        items={items} 
      />
      </View>
    );
  };

const styles = StyleSheet.create({
  view: {
     alignItems: 'center'
  },

  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    //borderWidth: 1,
    alignItems: 'center',
    //borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: COLORS.lightDark,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
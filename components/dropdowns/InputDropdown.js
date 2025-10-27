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
      color: '#999',
    };
   
    
    return (
     <View style={styles.container}>
      <RNPickerSelect
        value={selectedValue}
        onValueChange={onValueChange}
        placeholder={placeholder}
        style={{
          inputIOS: styles.inputIOS,
          inputAndroid: styles.inputAndroid,
          placeholder: styles.placeholder,
          iconContainer: styles.iconContainerInner,
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <MaterialIcons name="arrow-drop-down" size={28} color="#FF6A00" />
        }}
        items={items} 
      />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  inputIOS: {
    fontSize: 15,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: '#FFF',
    paddingRight: 45,
    fontWeight: '500',
  },
  inputAndroid: {
    fontSize: 15,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: '#FFF',
    paddingRight: 45,
    fontWeight: '500',
  },
  placeholder: {
    color: '#999',
    fontSize: 15,
    fontWeight: '400',
  },
  iconContainerInner: {
    top: Platform.OS === 'ios' ? 14 : 16,
    right: 15,
  },
});
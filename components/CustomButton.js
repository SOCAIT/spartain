import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, SIZES, FONTS } from '../constants';


const CustomButton = ({name, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{name}</Text>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.greenPrimary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 10,
      },
      buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
      },
  })

export default CustomButton
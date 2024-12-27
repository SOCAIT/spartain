import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IconButton = ({name, onPress, size = 30, color = '#fff', style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Add your styling here
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Example of a shadow
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: {height: 3, width: 3},
    elevation: 5, // for Android shadow
    borderRadius: 50, // Circular button
    backgroundColor: COLORS.darkOrange
  },
});

export default IconButton;

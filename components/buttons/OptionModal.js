import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

// Import vector icons from different libraries:
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';
// Add other libraries if needed

const OptionModal = ({ isVisible, options, onClose }) => {
  // Helper to render icon based on type
  const renderIcon = (option) => {
    const size = option.iconSize || 32;
    const color = option.iconColor || COLORS.darkOrange;

    if (option.iconType === 'Ionicons') {
      return (
        <Ionicons
          name={option.iconName}
          size={size}
          color={color}
          style={styles.optionIcon}
        />
      );
    } else if (option.iconType === 'MaterialIcons') {
      return (
        <MaterialIcons
          name={option.iconName}
          size={size}
          color={color}
          style={styles.optionIcon}
        />
      );
    } else if (option.iconType === 'MaterialCommunityIcons') {
      return (
        <MaterialCommunityIcons
          name={option.iconName}
          size={size}
          color={color}
          style={styles.optionIcon}
        />
      );
    } else if (option.iconType === 'Image' || option.iconType === 'png') {
      return (
        <Image
          source={option.iconSource}
          style={[styles.optionImage, { width: size, height: size }]}
          resizeMode="contain"
        />
      );
    } else {
      // default fallback is Ionicons
      return (
        <Ionicons
          name={option.iconName}
          size={size}
          color={color}
          style={styles.optionIcon}
        />
      );
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Close modal if user taps outside */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Options container in bottom-left */}
          <TouchableWithoutFeedback>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => {
                    onClose();
                    option.onPress();
                  }}
                >
                  {renderIcon(option)}
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Full screen dark overlay
    justifyContent: 'flex-end', // Position container at the bottom
  },
  optionsContainer: {
    alignSelf: 'flex-start', // Align container to the left
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Increased touch area for bigger buttons
  },
  optionIcon: {
    marginRight: 15,
  },
  optionImage: {
    marginRight: 15,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 22,
  },
});

export default OptionModal;
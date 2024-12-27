// CustomSelect.js
import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const CustomSelect = ({ options, onSelect }) => {
  const [textInputValue, setTextInputValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOptionSelect = (option) => {
    setTextInputValue(option);
    onSelect(option);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.input}>
      <TextInput
        value={textInputValue}
        placeholder="Select an option..."
        onFocus={() => setIsModalVisible(true)}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleOptionSelect(option)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
    
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 16,
    },
  });

export default CustomSelect;

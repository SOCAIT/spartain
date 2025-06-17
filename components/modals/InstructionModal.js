import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS } from '../../constants';
const InstructionsModal = ({ visible, onClose, instructions }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
        {instructions.split("|").map((item, index) => (
            <Text key={index} style={styles.modalText}>{(index+1) +". " +item}</Text>

        ))}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
  },
  modalContent: {
    backgroundColor: COLORS.dark,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: COLORS.white
    
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InstructionsModal;

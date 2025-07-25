import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { Clipboard } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS } from '../../constants';
const InstructionsModal = ({ visible, onClose, instructions }) => {
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Text copied to clipboard!');
  };

  const renderStep = (item, index) => {
    const stepText = (index + 1) + ". " + item;
    const isPromptStep = item.startsWith("Try this prompt:");
    
    if (isPromptStep) {
      const promptText = item.replace("Try this prompt:", "").trim();
      return (
        <View key={index} style={styles.stepContainer}>
          <Text style={styles.modalText}>{(index + 1) + ". Try this prompt:"}</Text>
          <View style={styles.promptContainer}>
            <Text style={[styles.modalText, styles.promptText]}>{promptText}</Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={() => copyToClipboard(promptText)}
            >
              <MaterialIcons name="content-copy" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    return (
      <Text key={index} style={styles.modalText}>{stepText}</Text>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContainer}>
            {instructions.split("|").map(renderStep)}
          </ScrollView>
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
    width: '85%',
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  scrollArea: {
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: COLORS.white
    
  },
  stepContainer: {
    marginBottom: 10,
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightDark,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  promptText: {
    flex: 1,
    fontStyle: 'italic',
    fontSize: 16,
  },
  copyButton: {
    marginLeft: 10,
    padding: 5,
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

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Platform, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';

export default function LargeInputModal({ 
  visible, 
  onClose, 
  value, 
  onChangeText, 
  onSend 
}) {
  const handleSend = () => {
    onSend();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.largeModalContainer}>
        <View style={styles.largeModalHeader}>
          <TouchableOpacity
            style={styles.largeModalCloseButton}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.largeModalTitle}>Write Message</Text>
          <TouchableOpacity
            style={styles.largeModalSendButton}
            onPress={handleSend}
          >
            <MaterialIcons name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.largeModalInput}
          placeholder="Type your message here..."
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
          autoFocus
        />
        <View style={styles.largeModalFooter}>
          <Text style={styles.largeModalHint}>
            Press send or swipe down to close
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  largeModalContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  largeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.dark,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  largeModalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  largeModalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  largeModalSendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FF6A00',
  },
  largeModalInput: {
    flex: 1,
    color: '#FFF',
    backgroundColor: '#1C1C1E',
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  largeModalFooter: {
    padding: 16,
    backgroundColor: COLORS.dark,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  largeModalHint: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});


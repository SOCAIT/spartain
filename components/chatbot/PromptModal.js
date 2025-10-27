import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const PROMPTS = [
  "Tell me about a workout plan.",
  "How can I lose weight?",
  "Give me tips for muscle gain.",
  "What should I eat for energy?",
];

export default function PromptModal({ visible, onClose, onSelectPrompt }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContent}>
          {PROMPTS.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptOption}
              onPress={() => {
                onSelectPrompt(prompt);
                onClose();
              }}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  promptOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  promptText: {
    color: '#FFF',
    fontSize: 14,
  },
});


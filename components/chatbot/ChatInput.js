import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 200;

export default function ChatInput({ 
  value, 
  onChangeText, 
  onSend, 
  onExpand 
}) {
  const [inputHeight, setInputHeight] = useState(MIN_HEIGHT);

  const handleContentSizeChange = (event) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(Math.min(Math.max(height, MIN_HEIGHT), MAX_HEIGHT));
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, { height: Math.max(inputHeight, MIN_HEIGHT) }]}
        placeholder="Type to start chatting..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        multiline
        onContentSizeChange={handleContentSizeChange}
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <MaterialIcons name="send" size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.expandButton} onPress={onExpand}>
        <MaterialIcons name="fullscreen" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Platform.OS === 'ios' ? 10 : 10,
    backgroundColor: COLORS.dark,
    borderTopWidth: 1,
    borderTopColor: COLORS.dark,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    paddingHorizontal: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: Platform.OS === 'ios' ? 15 : 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#FF6A00',
    borderRadius: 50,
    padding: 10,
  },
  expandButton: {
    marginLeft: 10,
    backgroundColor: '#555',
    borderRadius: 50,
    padding: 10,
  },
});


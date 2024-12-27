import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const TrainerChatScreen = ({ route }) => {
  const { trainerId, trainerName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch existing chat messages with the trainer
    axios
      .get(`YOUR_API_ENDPOINT/chats`, { params: { trainerId } })
      .then(response => {
        setMessages(response.data.messages); // Assuming response.data.messages is the list of messages
      })
      .catch(error => {
        console.error(error);
      });
  }, [trainerId]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    // Send the new message to the server
    axios
      .post(`YOUR_API_ENDPOINT/chats`, { trainerId, message: newMessage })
      .then(response => {
        setMessages([...messages, response.data.message]); // Append the new message to the list
        setNewMessage(''); // Clear the input field
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {trainerName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageItem: {
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TrainerChatScreen;

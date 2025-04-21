import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi there! Welcome to SyntraFit, your personal AI fitness coach. I’m here to guide you on your fitness journey.\n\nPlease make sure to update your profile information for as accurate suggestions as possible.\n\nWhether you want to get fit, lose weight, or build strength, I’m here to help you through! 💪",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    // {
    //   id: '2',
    //   text: "Hello, who are you?",
    //   isUser: true,
    //   timestamp: '10:01 AM',
    // },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const prompts = [
    "Tell me about a workout plan.",
    "How can I lose weight?",
    "Give me tips for muscle gain.",
    "What should I eat for energy?",
  ];

  const sendMessage = () => {
    if (inputText.trim().length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now().toString(),
          text: "AI coach is thinking... 🤔",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        setIsTyping(false);
      }, 2000); // Bot responds after 2 seconds
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      {item.isUser ? (
        <MaterialIcons name="person" size={20} color="#FF6A00" style={styles.userIcon} />
      ) : (
        <MaterialIcons name="smartphone" size={20} color="#333" style={styles.botIcon} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <MaterialIcons name="arrow-back-ios" size={24} color="#FFF" /> */}
        <Text style={styles.headerTitle}>SyntraFit.AI</Text>
        <View style={styles.headerRight}>
          <Text style={styles.chatsLeft}>Advanced Actions</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <MaterialIcons name="more-vert" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        // inverted
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI coach is typing...</Text>
          <MaterialIcons name="autorenew" size={16} color="#FF6A00" style={styles.typingIcon} />
        </View>
      )}

     
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type to start chatting..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

       {/* Modal for prompt options */}
       <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {prompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptOption}
                onPress={() => {
                  setInputText(prompt);
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingTop: Platform.OS === 'ios' ? 35 : 16,
    // paddingHorizontal: Platform.OS === 'ios' ? 25 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.dark,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatsLeft: {
    color: '#FFF',
    fontSize: 12,
    marginRight: 10,
  },
  messageList: {
    paddingHorizontal: Platform.OS === 'ios' ? 35 : 20,
    flex: 1,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6A00',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: '#FFF',
    fontSize: 14,
  },
  timestamp: {
    color: '#888',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  userIcon: {
    position: 'absolute',
    top: 10,
    right: -30,
  },
  botIcon: {
    position: 'absolute',
    top: 10,
    left: -30,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  typingText: {
    color: '#FFF',
    marginRight: 5,
  },
  typingIcon: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.OS ==='ios' ? 10: 10,
    backgroundColor: '#333',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  input: {
    flex: 1,
    color: '#FFF',
    paddingHorizontal: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: Platform.OS ==='ios' ? 15: 0,

  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#FF6A00',
    borderRadius: 50,
    padding: 10,
  },

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

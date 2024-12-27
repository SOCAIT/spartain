import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../constants';

import Icon from 'react-native-vector-icons/FontAwesome';
const ChatbotScreen = ({navigation}) => {
    const [messages, setMessages] = useState([
      { id: '1', text: 'Hello! How can I help you today regarding fitness?', sender: 'bot' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef(null);
  
    const handleSend = () => {
      if (inputMessage.trim()) {
        const newMessage = {
          id: Date.now().toString(),
          text: inputMessage,
          sender: 'user',
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');
  
        setTimeout(() => {
          const botReply = {
            id: Date.now().toString(),
            text: 'Thank you for your message!',
            sender: 'bot',
          };
          setMessages((prevMessages) => [...prevMessages, botReply]);
        }, 1000);
      }
    };
  
    const clearMessages = () => {
      setMessages([
        { id: '1', text: 'Hello! How can I help you today regarding to fitness?', sender: 'bot' },
      ]);
    };
  
    const handleOptionPress = async (option) => {
      console.log(option)
      if (option === "Estimate my body fat percentage based on this photo:") {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.assets && response.assets.length > 0) {
            const { uri } = response.assets[0];
  
            const newMessage = {
              id: Date.now().toString(),
              text: "Calculating body fat percentage...",
              sender: 'bot',
              image: uri,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
  
            // Here you would send the image and prompt to an LLM service and process the result
            // For demonstration, let's simulate a response
            setTimeout(() => {
              const botReply = {
                id: Date.now().toString(),
                text: 'Your estimated body fat percentage is 15%.',
                sender: 'bot',
              };
              setMessages((prevMessages) => [...prevMessages, botReply]);
            }, 2000);
          }
        });
      }
      else if (option === "ai workout plan") {
        navigation.navigate('AIWorkoutPlan');      
      }
      else if (option === "ai nutrition plan") {
        navigation.navigate('AINutritionPlan');      
      }


    };
  
    const handleFeedback = (messageId, feedback) => {
      // Handle the feedback for the message
      console.log(`Feedback for message ${messageId}: ${feedback}`);
      Alert.alert('Feedback received', `You gave a ${feedback} feedback.`);
    };
  
    useEffect(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, [messages]);
  
    const renderItem = ({ item }) => (
      <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
        {item.image && <Image source={{ uri: item.image }} style={styles.uploadedImage} />}
        <Text style={styles.messageText}>{item.text}</Text>
        {item.sender === 'bot' && (
          <View style={styles.feedbackContainer}>
            <TouchableOpacity onPress={() => handleFeedback(item.id, 'positive')}>
              <Icon name="thumbs-up" size={16} color="#4caf50" style={styles.feedbackIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFeedback(item.id, 'negative')}>
              <Icon name="thumbs-down" size={16} color="#ff4d4d" style={styles.feedbackIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  
    return (
      <View
        style={styles.container}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}  // Adjusting the offset
                    >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
  
        <View style={styles.quickRepliesContainer}>
          <TouchableOpacity style={styles.quickReplyButton} onPress={() => handleOptionPress("Estimate my body fat percentage based on this photo:")}>
            <Text style={styles.quickReplyText}>Estimate my body fat percentage based on this photo:</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.quickReplyButton} onPress={() => handleOptionPress("ai workout plan")}>
            <Text style={styles.quickReplyText}>Create me a new Workout plan </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickReplyButton} onPress={() => handleOptionPress("ai nutrition plan")}>
            <Text style={styles.quickReplyText}>Create me a new Nutrition plan</Text>
          </TouchableOpacity>
          {/* Add more quick reply buttons here */}
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            {/* <Text style={styles.sendButtonText}>Send</Text> */}
            <Image source={require("../../assets/icons/send.png")} style={{
                             width: 25, 
                             height: 25,
                             overlayColor: COLORS.black,
                             tintColor: COLORS.black
                              
                         }} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  chatContainer: {
    padding: 20,
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    position: 'relative', // To position feedback icons
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4caf50',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.dark,
    borderTopWidth: 1,
    // borderTopColor: '#ddd',
    alignItems: 'center',
    minHeight: 60, // Ensure consistent height  
},
  input: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    // paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  clearButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    flexWrap: 'wrap', // Allow wrapping of buttons
  },
  quickReplyButton: {
    backgroundColor: COLORS.dark,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10, // Add margin for spacing between buttons
  },
  quickReplyText: {
    color: COLORS.white,
    fontSize: 14,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  feedbackContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    right: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  feedbackIcon: {
    marginLeft: 10,
  },
});

export default ChatbotScreen;

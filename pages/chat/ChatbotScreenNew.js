import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { backend_url, agent_url } from '../../config/config';
import { AuthContext } from '../../helpers/AuthContext';


export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi there! Welcome to SyntraFit, your personal AI fitness coach. I'm here to guide you on your fitness journey.\n\nPlease make sure to update your profile information for as accurate suggestions as possible.\n\nWhether you want to get fit, lose weight, or build strength, I'm here to help you through! 💪",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
  const [isLargeModalVisible, setIsLargeModalVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const {authState} = useContext(AuthContext);
  const flatListRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // const createUserContext = () => {
  //     let userContext = 
  // }

  const navigation = useNavigation();

  const MIN_HEIGHT = 40;
  const MAX_HEIGHT = 200;

  const prompts = [
    "Tell me about a workout plan.",
    "How can I lose weight?",
    "Give me tips for muscle gain.",
    "What should I eat for energy?",
  ];

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async () => {
    if (inputText.trim().length > 0) {
      // Add the user message to the list
      const newMessage = {
        id: generateUniqueId(),
        text: inputText,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      setIsTyping(true);
  
      // Build conversation context as a single string (for example)
      // Alternatively, you could format the history in a structured way that your backend expects.
      const conversationContext = messages
        .map((msg) => `${msg.isUser ? "User" : "AI"}: ${msg.text}`)
        .join("\n");
  
      try {
        const response = await fetch(agent_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            user_input: newMessage.text,
            context: conversationContext,
            auth_state: authState,  // authState should be set from your app's authentication logic
            // Optionally add user/session id
          }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
    
        const botResponse = {
          id: generateUniqueId(),
          text: data.response || "Sorry, I didn't get that.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
    
      } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorResponse = {
          id: generateUniqueId(),
          text: 'Sorry, something went wrong. Please try again later.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prevMessages) => [...prevMessages, errorResponse]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Add useEffect to scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Add animation effect for the typing indicator
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isTyping]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

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

  const handleContentSizeChange = (event) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(Math.min(Math.max(height, MIN_HEIGHT), MAX_HEIGHT));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SyntraFit.AI</Text>
        <View style={styles.headerRight}>
          <Text style={styles.chatsLeft}>Advanced Actions</Text>
          <TouchableOpacity onPress={() => setIsPromptModalVisible(true)}>
            <MaterialIcons name="more-vert" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI coach is typing...</Text>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialIcons name="autorenew" size={16} color="#FF6A00" style={styles.typingIcon} />
          </Animated.View>
        </View>
      )}

      {/* Action Tabs */}
      <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('AIWorkoutPlan')}
        >
          <Text style={styles.tabText}>Create Workout Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('BodyAnalyzer')}
        >
          <Text style={styles.tabText}>Analyze Body Composition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('AINutritionPlan')}
        >
          <Text style={styles.tabText}>Create Nutrition Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: Math.max(inputHeight, MIN_HEIGHT) }]}
          placeholder="Type to start chatting..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          multiline
          onContentSizeChange={handleContentSizeChange}
          // scrollEnabled={inputHeight >= MAX_HEIGHT}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.expandButton} onPress={() => setIsLargeModalVisible(true)}>
          <MaterialIcons name="fullscreen" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Modal for Prompt Options */}
      <Modal
        visible={isPromptModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPromptModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsPromptModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {prompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptOption}
                onPress={() => {
                  setInputText(prompt);
                  setIsPromptModalVisible(false);
                }}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal for Large Input Text */}
      <Modal
        visible={isLargeModalVisible}
        animationType="slide"
        onRequestClose={() => setIsLargeModalVisible(false)}
      >
        <View style={styles.largeModalContainer}>
          <TextInput
            style={styles.largeModalInput}
            placeholder="Type your message here..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={styles.largeModalCloseButton}
            onPress={() => setIsLargeModalVisible(false)}
          >
            <Text style={styles.largeModalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingTop: Platform.OS === 'ios' ? 35 : 16,
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
    color: '#fff',
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
  tabsContainer: {
    backgroundColor: COLORS.dark,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
  
    shadowOpacity: 0.99,
    shadowRadius: 10,
  },
  tab: {
    marginHorizontal: 5,
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabText: {
    color: '#FFF',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Platform.OS === 'ios' ? 10 : 10,
    backgroundColor: COLORS.dark,
    borderTopWidth: 1,
    borderTopColor: COLORS.dark,
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
  largeModalContainer: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
    justifyContent: 'center',
  },
  largeModalInput: {
    flex: 1,
    color: '#FFF',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    textAlignVertical: 'top',
  },
  largeModalCloseButton: {
    marginTop: 10,
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  largeModalCloseButtonText: {
    color: '#FFF',
  },
});
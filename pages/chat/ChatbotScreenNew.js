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
  Alert,
  KeyboardAvoidingView,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { backend_url, agent_url } from '../../config/config';
import { AuthContext } from '../../helpers/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import SubscriptionModal from '../../components/SubscriptionModal';

 
export default function ChatScreen() {
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
  const [isLargeModalVisible, setIsLargeModalVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const {authState} = useContext(AuthContext);
  const { checkSubscription, showSubscriptionModal, setShowSubscriptionModal, handleSubscribe } = useSubscription();
  const flatListRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [thinkingText, setThinkingText] = useState('�� AI is thinking');

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Helloo there " + authState.username + "! Welcome to SyntraFit Hermes-0, your personal AI fitness coach. I'm here to guide you on your fitness journey.\n\nPlease make sure to update your profile information for as accurate suggestions as possible.\n\n ⚠️ *Disclaimer:* All health and fitness suggestions provided here are for informational purposes only and not a substitute for professional medical advice. For medical concerns or diagnosis, please consult a licensed healthcare provider.", //\n\nWhether you want to get fit, lose weight, or build strength, I'm here to help you through! 💪",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const navigation = useNavigation();

  const MIN_HEIGHT = 40;
  const MAX_HEIGHT = 200;

  const prompts = [
    "Tell me about a workout plan.",
    "How can I lose weight?",
    "Give me tips for muscle gain.",
    "What should I eat for energy?",
  ];

  // ─────────────────────────── helpers
const JOB_POLL_INTERVAL = 3000;          // 3-second polling
const MAX_JOB_WAIT_MS   = 10 * 60 * 1000;   // 10 min
const POLL_INTERVAL_MS  =  3 * 1000;        // 3  sec

// New constants for animation timing
const DOT_ANIM_MS      =   500;             // dot update
const PHASE_CHANGE_MS  =  15 * 1000;         // 8-second phase change

// New: phases shown while planner job is running
const PLANNER_PHASES = [
  'Planning… this may take a few minutes',
  'Retrieving data and planning next steps',
  'Optimizing your personalized program',
  'Verifying that your program is aligned with your goals',
  'Finalizing recommendations'
];

// Map <jobId, intervalId> so we can clear intervals on unmount / refresh
const activePolls = new Map();

const pollJobStatus = (jobId, botMsgId, setMessages, setIsTyping) => {
  const start   = Date.now();

  /* ─── animated status text ─── */
  let phaseIdx  = 0;
  let dotCount  = 0;

  // Dots every 0.5 s
  const dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    setMessages(m =>
      m.map(it =>
        it.id === botMsgId
          ? { ...it, text: `${PLANNER_PHASES[phaseIdx]}${'.'.repeat(dotCount)}` }
          : it
      )
    );
  }, DOT_ANIM_MS);

  // Phase every 8 s
  const phaseInterval = setInterval(() => {
    phaseIdx = (phaseIdx + 1) % PLANNER_PHASES.length;
  }, PHASE_CHANGE_MS);

  const intervalId = setInterval(async () => {
    /* 1 — abort after MAX_JOB_WAIT_MS */
    if (Date.now() - start > MAX_JOB_WAIT_MS) {
      clearInterval(intervalId);
      activePolls.delete(jobId);
      setMessages(m =>
        m.map(it =>
          it.id === botMsgId
            ? { ...it, text: '❌ Planner timed out. Please try again.' }
            : it
        )
      );
      setIsTyping(false);
      /* stop animations */
      clearInterval(dotInterval);
      clearInterval(phaseInterval);
      return;
    }
    console.log(`${agent_url}/jobs/${jobId}`);
    /* 2 — normal polling */
    try {
      console.log(`${agent_url}/jobs/${jobId}`);
      const res  = await fetch(`${agent_url}/jobs/${jobId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.status === 'complete' || data.status === 'failed') {
        clearInterval(intervalId);
        activePolls.delete(jobId);
 
        setMessages(m =>
          m.map(it =>
            it.id === botMsgId
              ? {
                  ...it,
                  text: data.status === 'complete'
                    ? data.result
                    : '❌ Planner failed. Please try again.',
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit',
                  }),
                }
              : it
          )
        );
        setIsTyping(false);
        /* stop animated dots */
        clearInterval(dotInterval);
        clearInterval(phaseInterval);
      }
    } catch (err) {
      /* network glitch—ignore this tick, try again next */
      console.error(`${agent_url}/jobs/${jobId}`);

      //console.error('poll error', err);

    }
  }, POLL_INTERVAL_MS);

  activePolls.set(jobId, intervalId);
};

// Clear any running polls when component unmounts
useEffect(() => {
  return () => {
    for (const id of activePolls.values()) clearInterval(id);
  };
}, []);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;
    const hasSubscription = await checkSubscription('ai_agent');
    if (!hasSubscription) return;
  
    /* 1) append user msg */
    const userMsg = {
      id: generateUniqueId(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages(m => [...m, userMsg]);
    setInputText('');
  
    /* 2) context string */
    const conversationContext = [...messages, userMsg]
      .map(m => `${m.isUser ? 'User' : 'AI'}: ${m.text}`)
      .join('\n');
  
    /* 3) placeholder bot msg */
    const botMsgId = generateUniqueId();
    setMessages(m => [
      ...m,
      {
        id: botMsgId,
        text: '', // filled as tokens arrive OR when job completes
        isUser: false,
        timestamp: '',
      },
    ]);
    setIsTyping(true);
  
    /* 4) open WebSocket */
    const wsUrl = agent_url.replace(/^http/, 'ws') + '/ws/agent';
    const ws = new WebSocket(wsUrl);
  
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          user_input: userMsg.text,
          context: conversationContext,
          auth_state: authState,
        }),
      );
    };
  
    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
  
      /* ─── 4.a streaming tokens (chat mode) ─── */
      if (msg.token) {
        setMessages(m =>
          m.map(item =>
            item.id === botMsgId
              ? { ...item, text: item.text + msg.token }
              : item,
          ),
        );
      }
  
      /* ─── 4.b job id (planner mode) ─── */
      if (msg.job_id) {
        // Show “queued” status in the placeholder
        setMessages(m =>
          m.map(item =>
            item.id === botMsgId
              ? { ...item, text: '⏳ Planning… this may take a few minutes.' }
              : item,
          ),
        );
        // Start polling DynamoDB via /jobs/{id}
        pollJobStatus(msg.job_id, botMsgId, setMessages, setIsTyping);
      }
  
      if (msg.status === 'complete') {
        // Chat mode reached end of stream
        setMessages(m =>
          m.map(item =>
            item.id === botMsgId
              ? {
                  ...item,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }
              : item,
          ),
        );
        setIsTyping(false);
        ws.close();
      }
    };
  
    ws.onerror = err => {
      console.error('WebSocket error:', err);
      setMessages(m =>
        m.map(item =>
          item.id === botMsgId
            ? {
                ...item,
                text: '❌ Sorry, something went wrong.',
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : item,
        ),
      );
      setIsTyping(false);
      ws.close();
    };
  }; 

  // const sendMessage = async () => {
  //   if (inputText.trim().length === 0) return;

  //   // Properly await the async subscription check
  //   const hasSubscription = await checkSubscription('ai_agent');
  //   console.log(hasSubscription);
  //   if (!hasSubscription) {
  //     return; // Do not proceed if user is not subscribed
  //   }

  //   // Add the user message to the list
  //   const newMessage = {
  //     id: generateUniqueId(),
  //     text: inputText,
  //     isUser: true,
  //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   setInputText('');
  //   setIsTyping(true);

  //   // Build conversation context as a single string (for example)
  //   // Alternatively, you could format the history in a structured way that your backend expects.
  //   const conversationContext = messages
  //     .map((msg) => `${msg.isUser ? "User" : "AI"}: ${msg.text}`)
  //     .join("\n");

  //   try {
  //     const response = await fetch(agent_url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         user_input: newMessage.text,
  //         context: conversationContext,
  //         auth_state: authState,  // authState should be set from your app's authentication logic
  //         // Optionally add user/session id
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
      
  //     const data = await response.json();
  
  //     const botResponse = {
  //       id: generateUniqueId(),
  //       text: data.response || "Sorry, I didn't get that.",
  //       isUser: false,
  //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     };
  //     setMessages((prevMessages) => [...prevMessages, botResponse]);
  
  //   } catch (error) {
  //     console.error('Error fetching AI response:', error);
  //     const errorResponse = {
  //       id: generateUniqueId(),
  //       text: 'Sorry, something went wrong. Please try again later.',
  //       isUser: false,
  //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     };
  //     setMessages((prevMessages) => [...prevMessages, errorResponse]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };

  // Add useEffect to scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }

    console.log(authState);
  }, [messages]);

  // Add animation effect for the typing indicator
  useEffect(() => {
    let interval;
    if (isTyping) {
      let dotCount = 0;
      interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; // cycles through 0-3 dots
        setThinkingText(`🤖 SyntraFit Hermes is thinking${'.'.repeat(dotCount)}`);
      }, 500); // update every 0.5s for smoother animation
    } else {
      setThinkingText('🤖 SyntraFit Hermes is thinking');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const renderItem = ({ item }) => {
    const displayText = !item.isUser && (!item.text || item.text.trim() === '')
      ? thinkingText
      : item.text;

    // Format text with markdown-style formatting for AI responses
    const formatText = (text) => {
      if (item.isUser) {
        return <Text style={styles.messageText}>{text}</Text>;
      }

      // Split text by bold, headers, and URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const combinedRegex = /(\*\*.*?\*\*|###.*?|https?:\/\/[^\s]+)/g;
      const parts = text.split(combinedRegex).filter(Boolean);
      
      return (
        <Text style={styles.messageText}>
          {parts.map((part, index) => {
            // Bold text: **text**
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              return (
                <Text key={index} style={styles.boldText}>
                  {boldText}
                </Text>
              );
            }
            // Headers: ### text
            else if (part.startsWith('###')) {
              const headerText = part.slice(3).trim();
              return (
                <Text key={index} style={styles.headerText}>
                  {'\n'}{headerText}{'\n'}
                </Text>
              );
            }
            // URLs
            else if (urlRegex.test(part)) {
              return (
                <Text
                  key={index}
                  style={styles.linkText}
                  onPress={() => Linking.openURL(part)}
                >
                  {part}
                </Text>
              );
            }
            // Regular text
            else {
              return <Text key={index}>{part}</Text>;
            }
          })}
        </Text>
      );
    };

    return (
      <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
        {formatText(displayText)}
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.isUser ? (
          <MaterialIcons name="person" size={20} color="#FF6A00" style={styles.userIcon} />
        ) : (
          <Image source={require('../../assets/icons/spartan_logo.png')} style={styles.botIcon} />
        )}
      </View>
    );
  };

  const handleContentSizeChange = (event) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(Math.min(Math.max(height, MIN_HEIGHT), MAX_HEIGHT));
  };

  const clearConversation = () => {
    Alert.alert(
      "Clear Conversation",
      "Are you sure you want to clear the entire conversation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: () => {
            setMessages([
              {
                id: generateUniqueId(),
                text: "Hi there! Welcome to SyntraFit, your personal AI fitness coach. I'm here to guide you on your fitness journey.\n\nPlease make sure to update your profile information for as accurate suggestions as possible.\n\nWhether you want to get fit, lose weight, or build strength, I'm here to help you through! 💪",
                isUser: false,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ]);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleActionTabPress = (action) => {
    let prompt = '';
    
    switch(action) {
      case 'AIWorkoutPlan':
        prompt = 'Create a personalized workout plan for me based on my profile and fitness goals.';
        break;
      case 'AINutritionPlan':
        prompt = 'Create a personalized nutrition plan for me based on my profile and dietary goals.';
        break;
      case 'BodyAnalyzer':
        // Keep navigation for body analyzer as it needs camera
        if (checkSubscription(action)) {
          navigation.navigate(action);
        }
        return;
      default:
        return;
    }
    
    if (prompt) {
      setInputText(prompt);
    }
    
    // Future navigation code (commented out)
    // if (checkSubscription(action)) {
    //   navigation.navigate(action);
    // }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SyntraFit.AI</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={clearConversation}
            style={styles.clearButton}
          >
            <MaterialIcons name="delete-sweep" size={20} color="#FFF" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
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

      {/* {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI coach is typing...</Text>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialIcons name="autorenew" size={16} color="#FF6A00" style={styles.typingIcon} />
          </Animated.View>
        </View>
      )} */}

      {/* Action Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleActionTabPress('AIWorkoutPlan')}
          >
            <Text style={styles.tabText}>Create Workout Plan</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.tab}
            onPress={() => handleActionTabPress('BodyAnalyzer')}
          >
            <Text style={styles.tabText}>Analyze Body Composition</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleActionTabPress('AINutritionPlan')}
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
          <View style={styles.largeModalHeader}>
            <TouchableOpacity
              style={styles.largeModalCloseButton}
              onPress={() => setIsLargeModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.largeModalTitle}>Write Message</Text>
            <TouchableOpacity
              style={styles.largeModalSendButton}
              onPress={() => {
                sendMessage();
                setIsLargeModalVisible(false);
              }}
            >
              <MaterialIcons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.largeModalInput}
            placeholder="Type your message here..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
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

      {/* Add Subscription Modal */}
      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        navigation={navigation}
      />
    </KeyboardAvoidingView>
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4136',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginRight: 10,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 3,
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
  boldText: {
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6A00',
    marginTop: 10,
    marginBottom: 5,
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
    width: 30,
    height: 30,
    borderRadius: 10,
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
  linkText: {
    color: '#4DA6FF',
    textDecorationLine: 'underline',
  },
});
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { agent_url } from '../../config/config';
import { AuthContext } from '../../helpers/AuthContext';
import { useSubscriptionRevenueCat } from '../../hooks/useSubscription.revenuecat';
import SubscriptionModal from '../../components/SubscriptionModal';
import ChatHeader from '../../components/chatbot/ChatHeader';
import ChatMessage from '../../components/chatbot/ChatMessage';
import ChatActionTabs from '../../components/chatbot/ChatActionTabs';
import ChatInput from '../../components/chatbot/ChatInput';
import PromptModal from '../../components/chatbot/PromptModal';
import LargeInputModal from '../../components/chatbot/LargeInputModal';

 
export default function ChatScreen() {
   
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
  const [isLargeModalVisible, setIsLargeModalVisible] = useState(false);
  const { authState } = useContext(AuthContext);
  const { checkSubscription, showSubscriptionModal, setShowSubscriptionModal } = useSubscriptionRevenueCat();
  const flatListRef = useRef(null);
  const [thinkingText, setThinkingText] = useState('🤖 AI is thinking');
  const [conversationId, setConversationId] = useState('');

  // Generate unique conversation ID on mount
  useEffect(() => {
    const generateConversationId = () => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      return `conv_${timestamp}_${random}`;
    };
    const newId = generateConversationId();
    setConversationId(newId);
    console.log('Conversation started with ID:', newId);
  }, []);

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello there " + authState.username + "! Welcome to SyntraFit Hermes-0, your personal AI fitness coach. I'm here to guide you on your fitness journey.\n\nPlease make sure to update your profile information for as accurate suggestions as possible.\n\n ⚠️ *Disclaimer:* All health and fitness suggestions provided here are for informational purposes only and not a substitute for professional medical advice. For medical concerns or diagnosis, please consult a licensed healthcare provider.", //\n\nWhether you want to get fit, lose weight, or build strength, I'm here to help you through! 💪",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const navigation = useNavigation();

  // ─────────────────────────── helpers
const JOB_POLL_INTERVAL = 3000;          // 3-second polling
const MAX_JOB_WAIT_MS   = 20 * 60 * 1000;   // 10 min
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
    console.log("polling...")
    
    /* 2 — normal polling */
    try {
      console.log(`${agent_url}/jobs/${jobId}`);
      // const res  = await fetch(`${agent_url}/jobs/${jobId}`);
      // console.log(res)
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const data = await res.json();
      // console.log(data)

      const url = `${agent_url}/jobs/${jobId}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      const bodyText = await res.text(); // read text so we can log even on 4xx/5xx
      console.log('GET', url, 'status', res.status, 'body:', bodyText);

      if (res.status === 404) {
        // Treat as "not ready yet" instead of error
        return; // just wait for next tick
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = JSON.parse(bodyText);
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
      console.log(err.message)
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

  const generateConversationId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `conv_${timestamp}_${random}`;
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
          conversation_id: conversationId,
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
          m.map(item => {
            if (item.id !== botMsgId) return item;

            // extract nutrition
            const extract = (txt) => {
              /* Debug logging to see exactly what the AI sent */
              console.log('[Nutrition-Parser] Raw AI text ->', txt);

              const match = txt.match(/<nutrition>([\s\S]*?)<\/nutrition>/i);
              if (!match) {
                console.log('[Nutrition-Parser] No <nutrition> tag found.');
                return { clean: txt, data: null };
              }
              let data = null;
              let jsonStr = match[1].trim();
              
              // Handle double brackets {{ }} - common LLM output format
              if (jsonStr.startsWith('{{') && jsonStr.endsWith('}}')) {
                jsonStr = jsonStr.slice(1, -1); // Remove outer brackets
                console.log('[Nutrition-Parser] Removed double brackets ->', jsonStr);
              }
              
              try {
                data = JSON.parse(jsonStr);
                console.log('[Nutrition-Parser] Parsed nutrition JSON ->', data);
              } catch (err) {
                console.log('[Nutrition-Parser] JSON parse error', err);
                // Try one more approach: extract just the object part
                const objectMatch = jsonStr.match(/\{[^{}]*\}/);
                if (objectMatch) {
                  try {
                    data = JSON.parse(objectMatch[0]);
                    console.log('[Nutrition-Parser] Parsed with fallback ->', data);
                  } catch (e) {
                    console.log('[Nutrition-Parser] Fallback parse also failed');
                  }
                }
              }
              const clean = txt.replace(match[0], '').trim();
              return { clean, data };
            };
            const { clean, data } = extract(item.text);

            return {
              ...item,
              text: clean,
              nutritionData: data,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }),
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
        dotCount = (dotCount + 1) % 4;
        setThinkingText(`🤖 SyntraFit Hermes is thinking${'.'.repeat(dotCount)}`);
      }, 500);
    } else {
      setThinkingText('🤖 SyntraFit Hermes is thinking');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping]);

  const renderItem = ({ item }) => (
    <ChatMessage item={item} thinkingText={thinkingText} />
  );

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
            // Generate new conversation ID for the new chat
            const newConversationId = generateConversationId();
            setConversationId(newConversationId);
            console.log('New conversation started with ID:', newConversationId);
            
            setMessages([
              {
                id: generateUniqueId(),
                text:  "Hello there " + authState.username + "! Welcome to SyntraFit Hermes-0, your personal AI fitness coach. I'm here to guide you on your fitness journey.\n\nPlease make sure to update your profile information for as accurate suggestions as possible.\n\n ⚠️ *Disclaimer:* All health and fitness suggestions provided here are for informational purposes only and not a substitute for professional medical advice. For medical concerns or diagnosis, please consult a licensed healthcare provider.", //\n\nWhether you want to get fit, lose weight, or build strength, I'm here to help you through! 💪",
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
      <ChatHeader 
        onClear={clearConversation}
        onShowPrompts={() => setIsPromptModalVisible(true)}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <ChatActionTabs onActionPress={handleActionTabPress} />

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
        onExpand={() => setIsLargeModalVisible(true)}
      />

      <PromptModal
        visible={isPromptModalVisible}
        onClose={() => setIsPromptModalVisible(false)}
        onSelectPrompt={setInputText}
      />

      <LargeInputModal
        visible={isLargeModalVisible}
        onClose={() => setIsLargeModalVisible(false)}
        value={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
      />

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
    // paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
  },
  messageList: {
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    flex: 1,
  },
});
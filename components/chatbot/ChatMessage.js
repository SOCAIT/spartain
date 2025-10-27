import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants';

export default function ChatMessage({ item, thinkingText }) {
  const rawText = !item.isUser && (!item.text || item.text.trim() === '')
    ? thinkingText
    : item.text;

  // Remove any leading 'AI:' or 'User:' markers that backend may send
  const displayText = rawText.replace(/^\s*(AI|User):\s*/i, '');

  // Format text with markdown-style formatting for AI responses
  const formatText = (text) => {
    if (item.isUser) {
      return <Text style={styles.messageText}>{text}</Text>;
    }

    const lines = text.split('\n');
    
    // Function to parse a single line and apply formatting
    const parseLine = (line) => {
      const elements = [];
      let currentIndex = 0;

      // Pattern to match markdown elements
      const patterns = [
        { regex: /\*\*(.+?)\*\*/g, style: styles.boldText, unwrap: true }, // **bold**
        { regex: /\*(.+?)\*/g, style: styles.italicText, unwrap: true }, // *italic*
        { regex: /`(.+?)`/g, style: styles.inlineCode, unwrap: true }, // `code`
        { regex: /(https?:\/\/[^\s]+)/g, style: styles.linkText, isLink: true }, // URLs
      ];

      let match;
      let matches = [];

      // Find all matches
      for (const pattern of patterns) {
        while ((match = pattern.regex.exec(line)) !== null) {
          matches.push({
            start: match.index,
            end: pattern.regex.lastIndex,
            text: match[1] || match[0],
            style: pattern.style,
            isLink: pattern.isLink,
            fullMatch: match[0],
          });
        }
      }

      // Sort matches by position
      matches.sort((a, b) => a.start - b.start);

      // Build elements avoiding overlaps
      let lastEnd = 0;
      for (const m of matches) {
        if (m.start >= lastEnd) {
          // Add text before this match
          if (m.start > lastEnd) {
            elements.push(line.substring(lastEnd, m.start));
          }

          // Add the styled element
          if (m.isLink) {
            elements.push(
              <Text
                key={elements.length}
                style={m.style}
                onPress={() => Linking.openURL(m.fullMatch)}
              >
                {m.fullMatch}
              </Text>
            );
          } else {
            elements.push(
              <Text key={elements.length} style={m.style}>
                {m.text}
              </Text>
            );
          }
          lastEnd = m.end;
        }
      }

      // Add remaining text
      if (lastEnd < line.length) {
        elements.push(line.substring(lastEnd));
      }

      return elements.length > 0 ? elements : line;
    };

    return (
      <View style={styles.formattedTextContainer}>
        {lines.map((line, lineIndex) => {
          // Empty lines create paragraph breaks
          if (line.trim() === '') {
            return <View key={lineIndex} style={styles.paragraphBreak} />;
          }

          // Check for headers
          if (line.startsWith('### ')) {
            return (
              <Text key={lineIndex} style={styles.h3Text}>
                {line.slice(4).trim()}
              </Text>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <Text key={lineIndex} style={styles.h2Text}>
                {line.slice(3).trim()}
              </Text>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <Text key={lineIndex} style={styles.h1Text}>
                {line.slice(2).trim()}
              </Text>
            );
          }

          // Check for code blocks
          if (line.startsWith('```') && line.endsWith('```')) {
            const codeText = line.slice(3, -3);
            return (
              <View key={lineIndex} style={styles.codeBlock}>
                <Text style={styles.codeText}>{codeText}</Text>
              </View>
            );
          }

          // Regular line with formatting
          const parsedContent = parseLine(line);
          return (
            <Text key={lineIndex} style={styles.messageText}>
              {Array.isArray(parsedContent) ? parsedContent : parsedContent}
            </Text>
          );
        })}
      </View>
    );
  };

  const addNutrition = async (data) => {
    if (!data) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem('@currentNutrition');
      let base = { calories: 0, carbs: 0, proteins: 0, fats: 0 };
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) base = parsed.nutrition;
      }
      const updated = {
        calories: base.calories + (parseFloat(data.calories) || 0),
        carbs: base.carbs + (parseFloat(data.carbs) || 0),
        proteins: base.proteins + (parseFloat(data.protein || data.proteins) || 0),
        fats: base.fats + (parseFloat(data.fat || data.fats) || 0),
      };
      await AsyncStorage.setItem('@currentNutrition', JSON.stringify({ date: today, nutrition: updated }));
      Alert.alert('Added', 'Nutrition info added to today\'s diary');
    } catch (err) {
      Alert.alert('Error', 'Could not save nutrition info');
    }
  };

  // Different rendering for user vs AI messages
  if (item.isUser) {
    return (
      <View style={styles.userMessageWrapper}>
        <View style={[styles.messageContainer, styles.userMessage]}>
          {formatText(displayText)}
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <MaterialIcons name="person" size={20} color="#FF6A00" style={styles.userIcon} />
      </View>
    );
  }

  // AI message - full width, no bubble
  return (
    <View style={styles.aiMessageContainer}>
      <View style={styles.aiHeader}>
        <Image source={require('../../assets/icons/spartan_logo.png')} style={styles.aiAvatar} />
        <Text style={styles.aiLabel}>SyntraFit AI</Text>
        {item.timestamp && <Text style={styles.aiTimestamp}>{item.timestamp}</Text>}
      </View>
      <View style={styles.aiContent}>
        {formatText(displayText)}
        {item.nutritionData && item.timestamp && (
          <TouchableOpacity style={styles.nutriButton} onPress={() => addNutrition(item.nutritionData)}>
            <Text style={styles.nutriButtonText}>Add to Daily Nutrition Info</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // User message styles (bubble style)
  userMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 4,
    gap: 8,
  },
  messageContainer: {
    marginVertical: 0,
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#FF6A00',
  },
  userIcon: {
    marginBottom: 2,
  },
  
  // AI message styles (full width, no bubble)
  aiMessageContainer: {
    width: '100%',
    marginVertical: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  aiLabel: {
    color: '#FF6A00',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  aiTimestamp: {
    color: '#888',
    fontSize: 10,
  },
  aiContent: {
    paddingHorizontal: 4,
  },
  
  // Text formatting styles
  formattedTextContainer: {
    width: '100%',
    gap: 2,
  },
  paragraphBreak: {
    height: 8,
  },
  messageText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 19,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#DDD',
  },
  h1Text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6A00',
    marginTop: 6,
    marginBottom: 2,
    lineHeight: 24,
  },
  h2Text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6A00',
    marginTop: 5,
    marginBottom: 2,
    lineHeight: 22,
  },
  h3Text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8A33',
    marginTop: 4,
    marginBottom: 1,
    lineHeight: 20,
  },
  linkText: {
    color: '#4DA6FF',
    textDecorationLine: 'underline',
  },
  codeBlock: {
    backgroundColor: '#1A1A1A',
    padding: 10,
    borderRadius: 6,
    marginVertical: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6A00',
  },
  codeText: {
    fontFamily: 'Courier',
    color: '#A8E6CF',
    fontSize: 13,
  },
  inlineCode: {
    fontFamily: 'Courier',
    backgroundColor: '#2A2A2A',
    color: '#A8E6CF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 13,
  },
  timestamp: {
    color: '#fff',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  nutriButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  nutriButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});


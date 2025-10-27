import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';

export default function ChatHeader({ onClear, onShowPrompts }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>SyntraFit.AI</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          onPress={onClear}
          style={styles.clearButton}
        >
          <MaterialIcons name="delete-sweep" size={20} color="#FFF" />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <Text style={styles.chatsLeft}>Advanced Actions</Text>
        <TouchableOpacity onPress={onShowPrompts}>
          <MaterialIcons name="more-vert" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});


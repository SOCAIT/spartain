import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export default function AgeSelector({ value = '', onChange }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const age = parseInt(value || 0, 10);

  const bounce = () => {
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.25, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const adjust = (delta) => {
    const next = clamp(age + delta, 5, 100);
    onChange(String(next));
    bounce();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={() => adjust(-1)}>
        <Ionicons name="remove" size={24} color="#fff" />
      </TouchableOpacity>
      <Animated.Text style={[styles.value, { transform: [{ scale: scaleAnim }] }]}> {age || 0} </Animated.Text>
      <TouchableOpacity style={styles.btn} onPress={() => adjust(1)}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: COLORS.darkOrange,
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  value: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
}); 
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const ComingSoonScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/soon.png') }
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Coming Soon!</Text>
      <Text style={styles.subtitle}>This screen is under construction.
        This is a time to take a break and relax, or hit the gym 😊.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 400,
    height: 300,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default ComingSoonScreen;
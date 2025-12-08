import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

/**
 * Enhanced StylishCard with modern styling and accent border
 */
const StylishCard = ({ navigation, title, exercises, buttonText, onPress }) => {
  return (
    <View style={styles.cardWrapper}>
      {/* Accent border on left */}
      <View style={styles.accentBorder} />
      
      <View style={styles.card}>
        {/* Glass overlay effect */}
        <View style={styles.glassOverlay} />
        
        <Text style={styles.title}>{title}</Text>
        
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseContainer}>
            <View style={styles.exerciseRow}>
              <View style={styles.exerciseDot} />
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </View>
            <Text style={styles.exerciseDetails}>
              {exercise.suggestedSets} sets × {exercise.suggestedReps} reps
            </Text>
          </View>
        ))}
        
        <Text style={styles.moreText}>...more exercises</Text>
        
        <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.darkOrange,
    zIndex: 1,
  },
  
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusMd,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    borderLeftWidth: 0,
  },
  
  glassOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopRightRadius: SIZES.radiusMd,
    borderBottomRightRadius: SIZES.radiusMd,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  
  exerciseContainer: {
    marginBottom: 12,
    paddingLeft: 12,
  },
  
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.darkOrange,
    marginRight: 10,
  },
  
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  
  exerciseDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginLeft: 16,
  },
  
  moreText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 16,
    fontStyle: 'italic',
  },

  button: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: SIZES.radiusSm,
    alignSelf: 'center',
    marginTop: 8,
    ...SHADOWS.glowSm,
  },
  
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StylishCard;

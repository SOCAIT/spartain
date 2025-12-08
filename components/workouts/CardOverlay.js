import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS, SIZES } from '../../constants';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Enhanced CardOverlay with gradient overlay and improved visuals
 */
const CardOverlay = ({ onPress, workout, navigation }) => {

  const viewWorkout = () => {
    navigation.navigate("WorkoutView", { workout });
  };

  const modifyWorkout = () => {
    navigation.navigate("UpdateWorkoutScreen", { workout });
  };

  // Get exercise count
  const exerciseCount = workout?.workoutexerciseSet?.length || 0;

  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={require("../../assets/in_app/workout/workout_bg.png")}
        style={styles.card}
        imageStyle={styles.cardImage}
      >
        {/* Dark overlay for text visibility */}
        <View style={styles.overlay}>
          {/* Top accent line */}
          <View style={styles.topAccent} />
          
          <View style={styles.contentContainer}>
            <View style={styles.textContent}>
              <Text style={styles.workoutTitle} numberOfLines={2}>
                {workout.name}
              </Text>
              
              {exerciseCount > 0 && (
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <MaterialIcons name="fitness-center" size={12} color={COLORS.darkOrange} />
                    <Text style={styles.statText}>{exerciseCount} exercises</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Action button */}
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={viewWorkout}
              activeOpacity={0.8}
            >
              <View style={styles.playButtonInner}>
                <MaterialIcons name="play-arrow" size={20} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      
      {/* Orange glow effect */}
      <View style={styles.glowEffect} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginHorizontal: 4,
  },
  
  card: {
    height: 160,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    width: 260,
  },
  
  cardImage: {
    borderRadius: SIZES.radiusMd,
  },
  
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.darkOrange,
  },
  
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  
  workoutTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orangeMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  statText: {
    color: COLORS.darkOrange,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  workoutInfo: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  
  workoutMetrics: {
    flexDirection: 'row',
    marginTop: 8,
  },
  
  workoutMetric: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginRight: 12,
  },
  
  playButton: {
    ...SHADOWS.glowSm,
  },
  
  playButtonInner: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  glowEffect: {
    position: 'absolute',
    bottom: -5,
    left: 20,
    right: 20,
    height: 20,
    backgroundColor: COLORS.orangeGlow,
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
  },
});

export default CardOverlay;

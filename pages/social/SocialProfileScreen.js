import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SocialProfileScreen = ({ route, navigation }) => {
  const { user } = route.params || {};

  // Mock data
  const profileData = {
    username: user?.username || 'fitness_pro',
    avatar: user?.avatar || null,
    currentStreak: 45,
    prs: [
      { exercise: 'Bench Press', value: '315 lbs' },
      { exercise: 'Squat', value: '405 lbs' },
      { exercise: 'Deadlift', value: '495 lbs' },
    ],
    badges: [
      { id: 1, emoji: '🏆', name: 'Champion' },
      { id: 2, emoji: '💪', name: 'Strong' },
      { id: 3, emoji: '🔥', name: 'On Fire' },
      { id: 4, emoji: '⭐', name: 'Star' },
      { id: 5, emoji: '🎯', name: 'Goal Crusher' },
      { id: 6, emoji: '👑', name: 'King' },
    ],
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Profile" 
        paddingTop={0}
        rightIcon={null}
        onRightIconPress={null}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <Image 
            source={{ uri: profileData.avatar || 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>@{profileData.username}</Text>
          
          {/* Current Streak */}
          <View style={styles.streakBadge}>
            <MaterialIcons name="local-fire-department" size={20} color={COLORS.darkOrange} />
            <Text style={styles.streakText}>{profileData.currentStreak} day streak</Text>
          </View>
        </View>

        {/* PRs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          <View style={styles.prsContainer}>
            {profileData.prs.map((pr, index) => (
              <View key={index} style={styles.prCard}>
                <Text style={styles.prExercise}>{pr.exercise}</Text>
                <Text style={styles.prValue}>{pr.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <Text style={styles.badgeCount}>{profileData.badges.length}</Text>
          </View>
          <View style={styles.badgesGrid}>
            {profileData.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightDark,
    marginBottom: 12,
  },
  username: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkOrange + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    color: COLORS.darkOrange,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgeCount: {
    color: COLORS.darkOrange,
    fontSize: 16,
    fontWeight: '600',
  },
  prsContainer: {
    gap: 8,
  },
  prCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prExercise: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  prValue: {
    color: COLORS.darkOrange,
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SocialProfileScreen;


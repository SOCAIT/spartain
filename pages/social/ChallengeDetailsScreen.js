import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import LeaderboardList from '../../components/social/LeaderboardList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CircularProgress from '../../components/charts/CircularProgress';

const ChallengeDetailsScreen = ({ route, navigation }) => {
  const { challenge } = route.params;
  const [joined, setJoined] = useState(challenge.joined || false);
  const [activeTab, setActiveTab] = useState('rules');

  const mockLeaderboard = [
    { id: 1, rank: 1, handle: 'champion_max', value: '95', unit: '%', change: 2 },
    { id: 2, rank: 2, handle: 'fitness_beast', value: '87', unit: '%', change: 1 },
    { id: 3, rank: 3, handle: 'gym_hero', value: '82', unit: '%', change: 0 },
  ];

  const userProgress = 65; // Mock progress percentage

  const handleJoinToggle = () => {
    setJoined(!joined);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Challenge Rules</Text>
            <View style={styles.rulesCard}>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={20} color={COLORS.greenPrimary} />
                <Text style={styles.ruleText}>Complete daily workouts</Text>
              </View>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={20} color={COLORS.greenPrimary} />
                <Text style={styles.ruleText}>Log all exercises in the app</Text>
              </View>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={20} color={COLORS.greenPrimary} />
                <Text style={styles.ruleText}>Minimum 80% completion required</Text>
              </View>
            </View>

            {joined && (
              <View style={styles.progressSection}>
                <Text style={styles.sectionTitle}>Your Progress</Text>
                <View style={styles.progressCard}>
                  <CircularProgress
                    percentage={userProgress}
                    size={120}
                    strokeWidth={10}
                    color={COLORS.darkOrange}
                    textStyle={{}}
                  />
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressValue}>{userProgress}%</Text>
                    <Text style={styles.progressLabel}>Completed</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      case 'leaderboard':
        return (
          <View style={styles.tabContent}>
            <LeaderboardList data={mockLeaderboard} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Challenge Details" 
        paddingTop={0}
        rightIcon="share"
        onRightIconPress={() => {}}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeEmoji}>{challenge.badge}</Text>
          </View>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>
          
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <MaterialIcons name="people" size={20} color={COLORS.darkOrange} />
              <Text style={styles.metaText}>{challenge.participantCount} participants</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="calendar-today" size={20} color={COLORS.darkOrange} />
              <Text style={styles.metaText}>Ends {challenge.endDate}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rules' && styles.tabActive]}
            onPress={() => setActiveTab('rules')}
          >
            <Text style={[styles.tabText, activeTab === 'rules' && styles.tabTextActive]}>
              Rules & Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leaderboard' && styles.tabActive]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.actionButton, joined && styles.actionButtonJoined]}
          onPress={handleJoinToggle}
        >
          <MaterialIcons 
            name={joined ? 'check-circle' : 'add-circle'} 
            size={20} 
            color={COLORS.white} 
          />
          <Text style={styles.actionButtonText}>
            {joined ? 'Joined' : 'Join Challenge'}
          </Text>
        </TouchableOpacity>
      </View>
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
  header: {
    padding: 16,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.darkOrange + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeEmoji: {
    fontSize: 40,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: COLORS.lightGray5,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightDark,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.darkOrange,
  },
  tabText: {
    color: COLORS.lightGray5,
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rulesCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 12,
  },
  progressSection: {
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  progressInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  progressValue: {
    color: COLORS.darkOrange,
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressLabel: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginTop: 4,
  },
  actionBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightDark,
  },
  actionButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonJoined: {
    backgroundColor: COLORS.greenPrimary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChallengeDetailsScreen;


import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import LeaderboardList from '../../components/social/LeaderboardList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GroupDetailsScreen = ({ route, navigation }) => {
  const { group } = route.params;
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About', icon: 'info' },
    { id: 'members', label: 'Members', icon: 'people' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { id: 'challenges', label: 'Challenges', icon: 'flag' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{group.description}</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <MaterialIcons name="people" size={20} color={COLORS.darkOrange} />
                <Text style={styles.infoText}>{group.memberCount} members</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="flag" size={20} color={COLORS.darkOrange} />
                <Text style={styles.infoText}>{group.challengeCount} active challenges</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name={group.isPrivate ? 'lock' : 'public'} size={20} color={COLORS.darkOrange} />
                <Text style={styles.infoText}>{group.isPrivate ? 'Private' : 'Public'} group</Text>
              </View>
            </View>
          </View>
        );
      
      case 'members':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Members list coming soon...</Text>
          </View>
        );
      
      case 'leaderboard':
        return (
          <View style={styles.tabContent}>
            <LeaderboardList data={[]} />
          </View>
        );
      
      case 'challenges':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Group challenges coming soon...</Text>
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
        title={group.name} 
        paddingTop={0}
        rightIcon="more-vert"
        onRightIconPress={() => {}}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Group Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: group.image || 'https://via.placeholder.com/120' }}
            style={styles.groupImage}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{group.memberCount}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{group.challengeCount}</Text>
                <Text style={styles.statLabel}>Challenges</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <MaterialIcons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? COLORS.white : COLORS.lightGray5} 
              />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Leave Group</Text>
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
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  groupImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: COLORS.lightDark,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  groupName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.darkOrange,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightDark,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.darkOrange,
  },
  tabText: {
    color: COLORS.lightGray5,
    fontSize: 12,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
    minHeight: 300,
  },
  description: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 12,
  },
  comingSoon: {
    color: COLORS.lightGray5,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 40,
  },
  actionBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightDark,
  },
  actionButton: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroupDetailsScreen;


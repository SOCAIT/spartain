import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import GroupCard from '../../components/social/GroupCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Mock data
const mockGroups = [
  {
    id: 1,
    name: 'Beast Mode Squad',
    description: 'Elite lifters pushing limits every day',
    memberCount: 234,
    challengeCount: 5,
    isPrivate: false,
  },
  {
    id: 2,
    name: 'Morning Warriors',
    description: 'Early birds who crush workouts before sunrise',
    memberCount: 156,
    challengeCount: 3,
    isPrivate: false,
  },
  {
    id: 3,
    name: 'VIP Fitness Club',
    description: 'Exclusive group for premium members',
    memberCount: 89,
    challengeCount: 8,
    isPrivate: true,
  },
];

const GroupsScreen = ({ navigation }) => {
  const [groups, setGroups] = useState(mockGroups);

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Groups" 
        paddingTop={0}
        rightIcon="add"
        onRightIconPress={() => navigation.navigate('CreateGroup')}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <MaterialIcons name="add-circle" size={24} color={COLORS.darkOrange} />
            <Text style={styles.actionButtonText}>Create Group</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('JoinGroup')}
          >
            <MaterialIcons name="search" size={24} color={COLORS.darkOrange} />
            <Text style={styles.actionButtonText}>Join Group</Text>
          </TouchableOpacity>
        </View>

        {/* My Groups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Groups</Text>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={() => navigation.navigate('GroupDetails', { group })}
            />
          ))}
        </View>

        {/* Suggested Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested for You</Text>
          <Text style={styles.comingSoon}>Coming soon...</Text>
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.darkOrange,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comingSoon: {
    color: COLORS.lightGray5,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default GroupsScreen;


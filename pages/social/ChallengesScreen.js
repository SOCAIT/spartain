import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import ChallengeCard from '../../components/social/ChallengeCard';

// Mock data
const mockChallenges = [
  {
    id: 1,
    title: '30-Day Bench Press Challenge',
    description: 'Increase your bench press max by 10% in 30 days',
    endDate: '2025-11-05',
    participantCount: 234,
    badge: '🏆',
    joined: false,
  },
  {
    id: 2,
    title: '10K Steps Daily',
    description: 'Walk at least 10,000 steps every day this month',
    endDate: '2025-10-31',
    participantCount: 567,
    badge: '🚶',
    joined: true,
  },
  {
    id: 3,
    title: 'Squat Strength Challenge',
    description: 'Hit a new squat PR and maintain it',
    endDate: '2025-11-15',
    participantCount: 189,
    badge: '💪',
    joined: false,
  },
];

const ChallengesScreen = ({ navigation }) => {
  const [challenges] = useState(mockChallenges);

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Challenges" 
        paddingTop={0}
        rightIcon={null}
        onRightIconPress={null}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onPress={() => navigation.navigate('ChallengeDetails', { challenge })}
          />
        ))}
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
    paddingVertical: 8,
    paddingBottom: 20,
  },
});

export default ChallengesScreen;


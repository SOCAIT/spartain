import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';
import LeaderboardHeader from '../../components/social/LeaderboardHeader';
import LeaderboardList from '../../components/social/LeaderboardList';

// Mock data - replace with actual API calls
const mockLeaderboardData = {
  prs: {
    bench: [
      { id: 1, rank: 1, handle: 'ironlift_king', avatar: null, value: '315', unit: 'lbs', change: 2 },
      { id: 2, rank: 2, handle: 'beast_mode22', avatar: null, value: '295', unit: 'lbs', change: 0 },
      { id: 3, rank: 3, handle: 'gym_warrior', avatar: null, value: '285', unit: 'lbs', change: -1 },
      { id: 4, rank: 4, handle: 'strength_pro', avatar: null, value: '275', unit: 'lbs', change: 1 },
      { id: 5, rank: 5, handle: 'flex_master', avatar: null, value: '265', unit: 'lbs', change: 0 },
    ],
    squat: [
      { id: 1, rank: 1, handle: 'leg_legend', avatar: null, value: '405', unit: 'lbs', change: 1 },
      { id: 2, rank: 2, handle: 'squat_king', avatar: null, value: '385', unit: 'lbs', change: 0 },
      { id: 3, rank: 3, handle: 'deep_squatter', avatar: null, value: '375', unit: 'lbs', change: 2 },
    ],
  },
  streaks: [
    { id: 1, rank: 1, handle: 'consistent_carl', avatar: null, value: '156', unit: 'days', change: 5 },
    { id: 2, rank: 2, handle: 'never_skip', avatar: null, value: '142', unit: 'days', change: 1 },
    { id: 3, rank: 3, handle: 'daily_grind', avatar: null, value: '128', unit: 'days', change: 0 },
  ],
  badges: [
    { id: 1, rank: 1, handle: 'badge_hunter', avatar: null, value: '47', unit: 'badges', change: 3 },
    { id: 2, rank: 2, handle: 'achievement_pro', avatar: null, value: '42', unit: 'badges', change: 1 },
    { id: 3, rank: 3, handle: 'collector_max', avatar: null, value: '38', unit: 'badges', change: 0 },
  ],
};

const LeaderboardsScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('prs');
  const [selectedScope, setSelectedScope] = useState('global');
  const [selectedKey, setSelectedKey] = useState('bench');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedType, selectedScope, selectedKey]);

  const fetchLeaderboardData = () => {
    // Simulate API call
    if (selectedType === 'prs') {
      setLeaderboardData(mockLeaderboardData.prs[selectedKey] || []);
    } else {
      setLeaderboardData(mockLeaderboardData[selectedType] || []);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchLeaderboardData();
      setRefreshing(false);
    }, 1000);
  };

  const handleLoadMore = () => {
    // Implement pagination
    console.log('Load more...');
  };

  return (
    <View style={styles.container}>
      <ArrowHeaderNew 
        navigation={navigation} 
        title="Leaderboards" 
        paddingTop={0}
        rightIcon="people"
        onRightIconPress={() => navigation.navigate('Groups')}
      />
      
      <LeaderboardHeader
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
        selectedKey={selectedKey}
        onKeyChange={setSelectedKey}
      />

      <LeaderboardList
        data={leaderboardData}
        type={selectedType}
        scope={selectedScope}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
      />
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
});

export default LeaderboardsScreen;


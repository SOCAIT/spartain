import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeaderboardsScreen from '../pages/social/LeaderboardsScreen';
import GroupsScreen from '../pages/social/GroupsScreen';
import GroupDetailsScreen from '../pages/social/GroupDetailsScreen';
import ChallengesScreen from '../pages/social/ChallengesScreen';
import ChallengeDetailsScreen from '../pages/social/ChallengeDetailsScreen';
import SocialProfileScreen from '../pages/social/SocialProfileScreen';
import CreateGroupScreen from '../pages/social/CreateGroupScreen';
import JoinGroupScreen from '../pages/social/JoinGroupScreen';

const Stack = createNativeStackNavigator();

const SocialStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Leaderboards"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} />
      <Stack.Screen name="ChallengeDetails" component={ChallengeDetailsScreen} />
      <Stack.Screen name="SocialProfile" component={SocialProfileScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
    </Stack.Navigator>
  );
};

export default SocialStack;


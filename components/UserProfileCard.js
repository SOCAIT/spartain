import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';

const UserProfileCard = ({ authState, navigation }) => {
  // Helper function to get goal display text
  const getGoalText = (target) => {
    const goals = {
      'FL': 'Fat Loss',
      'MG': 'Muscle Gain',
      'WL': 'Weight Loss',
      'ST': 'Strength',
      'EN': 'Endurance',
    };
    return goals[target] || 'Not Set';
  };

  const handleEditPress = () => {
    navigation.navigate("EditProfile", { authState });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handleEditPress}
      activeOpacity={0.8}
    >
      {/* Background Gradient Effect */}
      <View style={styles.gradientOverlay} />
      
      {/* Main Content */}
      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {authState.profile_photo ? (
              <Image
                source={{ uri: authState.profile_photo }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialIcons name="person" size={50} color="#FF6A00" />
              </View>
            )}
            <View style={styles.statusIndicator} />
          </View>

          {/* User Name & Premium Badge */}
          <View style={styles.userNameSection}>
            <Text style={styles.userName} numberOfLines={1}>
              {authState.username || 'User'}
            </Text>
            {authState.isSubscribed && (
              <View style={styles.premiumBadge}>
                <MaterialIcons name="workspace-premium" size={16} color="#FFD700" />
                <Text style={styles.premiumText}>Pro</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.quickStatsRow}>
          {/* Current Weight */}
          <View style={styles.quickStatItem}>
            <View style={styles.quickStatIconContainer}>
              <MaterialIcons name="monitor-weight" size={24} color="#FF6A00" />
            </View>
            <Text style={styles.quickStatValue}>
              {authState.latest_body_measurement?.weight_kg || '--'} kg
            </Text>
            <Text style={styles.quickStatLabel}>Current Weight</Text>
          </View>

          {/* Goal */}
          <View style={styles.quickStatItem}>
            <View style={styles.quickStatIconContainer}>
              <MaterialIcons name="flag" size={24} color="#4CD964" />
            </View>
            <Text style={styles.quickStatValue}>
              {getGoalText(authState.user_target)}
            </Text>
            <Text style={styles.quickStatLabel}>Your Goal</Text>
          </View>

          {/* Streak */}
          {/* <View style={styles.quickStatItem}>
            <View style={styles.quickStatIconContainer}>
              <MaterialIcons name="local-fire-department" size={24} color="#FF9500" />
            </View>
            <Text style={styles.quickStatValue}>
              {authState.streak || 0}
            </Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </View> */}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <View style={styles.subscriptionContainer}>
        {/* Subscription Status */}
        <View style={styles.subscriptionStatusContainer}>
          <View style={styles.subscriptionInfo}>
            <MaterialIcons 
              name={authState.isSubscribed ? "workspace-premium" : "lock"} 
              size={22} 
              color={authState.isSubscribed ? "#FFD700" : "#999"} 
            />
            <View style={styles.subscriptionTextContainer}>
              <Text style={styles.subscriptionStatusLabel}>
                {authState.isSubscribed ? 'Premium Plan' : 'Free Plan'}
              </Text>
              <Text style={styles.subscriptionStatusValue}>
                {authState.isSubscribed 
                  ? 'All features unlocked' 
                  : 'Upgrade to unlock all features'}
              </Text>
            </View>
          </View>
          {!authState.isSubscribed && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('SubscriptionDetails')}
              activeOpacity={0.7}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name="edit" size={18} color="#FFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
  },
  content: {
    padding: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6A00',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  userNameSection: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  quickStatIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickStatValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatLabel: {
    color: '#999',
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  subscriptionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  subscriptionTextContainer: {
    marginLeft: 12,
    // flex: 1,
  },
  subscriptionStatusLabel: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  subscriptionStatusValue: {
    color: '#999',
    fontSize: 12,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6A00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A00',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UserProfileCard;


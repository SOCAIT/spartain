import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChallengeCard = ({ challenge, onPress }) => {
  const getDaysRemaining = () => {
    if (!challenge.endDate) return null;
    const now = new Date();
    const end = new Date(challenge.endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialIcons name="emoji-events" size={24} color={COLORS.darkOrange} />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{challenge.title}</Text>
          {daysRemaining !== null && (
            <Text style={styles.daysRemaining}>
              {daysRemaining === 0 ? 'Ends today' : `${daysRemaining} days left`}
            </Text>
          )}
        </View>

        {challenge.badge && (
          <View style={styles.badgeIcon}>
            <Text style={styles.badgeEmoji}>{challenge.badge}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.participants}>
          <MaterialIcons name="people" size={16} color={COLORS.lightGray5} />
          <Text style={styles.participantText}>
            {challenge.participantCount || 0} participants
          </Text>
        </View>

        <View style={[
          styles.statusBadge,
          { backgroundColor: challenge.joined ? COLORS.greenPrimary + '20' : COLORS.darkOrange + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: challenge.joined ? COLORS.greenPrimary : COLORS.darkOrange }
          ]}>
            {challenge.joined ? 'Joined' : 'Join Now'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.darkOrange + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  daysRemaining: {
    color: COLORS.lightGray5,
    fontSize: 12,
  },
  badgeIcon: {
    marginLeft: 8,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  description: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChallengeCard;


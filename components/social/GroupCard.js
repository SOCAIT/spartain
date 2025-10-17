import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GroupCard = ({ group, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: group.image || 'https://via.placeholder.com/80' }}
        style={styles.groupImage}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{group.name}</Text>
          {group.isPrivate && (
            <MaterialIcons name="lock" size={16} color={COLORS.lightGray5} />
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {group.description || 'No description'}
        </Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialIcons name="people" size={16} color={COLORS.darkOrange} />
            <Text style={styles.statText}>{group.memberCount || 0} members</Text>
          </View>
          
          {group.challengeCount > 0 && (
            <View style={styles.stat}>
              <MaterialIcons name="flag" size={16} color={COLORS.darkOrange} />
              <Text style={styles.statText}>{group.challengeCount} challenges</Text>
            </View>
          )}
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={COLORS.lightGray5} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.lightDark,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
    flex: 1,
  },
  description: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginLeft: 4,
  },
});

export default GroupCard;


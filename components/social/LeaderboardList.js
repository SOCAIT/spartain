import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl } from 'react-native';
import { COLORS } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LeaderboardList = ({ 
  data = [], 
  type = 'prs', 
  scope = 'global',
  onRefresh,
  refreshing = false,
  onLoadMore,
}) => {
  const renderRankBadge = (rank) => {
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    if (rank <= 3) {
      return <Text style={styles.medalEmoji}>{medals[rank]}</Text>;
    }
    return <Text style={styles.rankText}>#{rank}</Text>;
  };

  const renderChangeIndicator = (change) => {
    if (!change || change === 0) return null;
    const isPositive = change > 0;
    return (
      <View style={[styles.changeContainer, isPositive ? styles.changeUp : styles.changeDown]}>
        <MaterialIcons 
          name={isPositive ? 'arrow-upward' : 'arrow-downward'} 
          size={12} 
          color={isPositive ? COLORS.greenPrimary : COLORS.red} 
        />
        <Text style={[styles.changeText, { color: isPositive ? COLORS.greenPrimary : COLORS.red }]}>
          {Math.abs(change)}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.leaderboardRow}>
      <View style={styles.rankBadge}>
        {renderRankBadge(item.rank || index + 1)}
      </View>
      
      <Image 
        source={{ uri: item.avatar || 'https://via.placeholder.com/40' }} 
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.handle}>{item.handle || item.username}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{item.value}</Text>
        {item.unit && <Text style={styles.unit}>{item.unit}</Text>}
      </View>
      
      {renderChangeIndicator(item.change)}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="people-outline" size={64} color={COLORS.lightGray5} />
      <Text style={styles.emptyText}>No leaderboard data yet</Text>
      <Text style={styles.emptySubtext}>Be the first to set a record!</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={COLORS.darkOrange}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rankBadge: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalEmoji: {
    fontSize: 24,
  },
  rankText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
    backgroundColor: COLORS.lightDark,
  },
  userInfo: {
    flex: 1,
  },
  handle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginTop: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 8,
  },
  value: {
    color: COLORS.darkOrange,
    fontSize: 18,
    fontWeight: 'bold',
  },
  unit: {
    color: COLORS.lightGray5,
    fontSize: 12,
    marginLeft: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeUp: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  changeDown: {
    backgroundColor: 'rgba(210, 43, 43, 0.15)',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: COLORS.lightGray5,
    fontSize: 14,
    marginTop: 8,
  },
});

export default LeaderboardList;


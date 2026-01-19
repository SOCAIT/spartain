import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { Icon } from '@rneui/themed';

const RankItem = ({ rank, username, score, isCurrentUser }) => (
    <View style={[styles.item, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.leftSide}>
            <View style={styles.rankContainer}>
                {rank <= 3 ? (
                    <Icon 
                        name="medal" 
                        type="material-community" 
                        color={rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'} 
                        size={24} 
                    />
                ) : (
                    <Text style={styles.rankText}>{rank}</Text>
                )}
            </View>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.username} numberOfLines={1}>{username}</Text>
        </View>
        <Text style={styles.score} numberOfLines={1}>{score}</Text>
    </View>
);

const LeaderboardPreview = ({ leaderboardData, currentUserId }) => {
    // Sort and take top 5
    const topUsers = leaderboardData?.entries 
        ? leaderboardData.entries.slice(0, 5) 
        : [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <View style={styles.card}>
                {topUsers.length > 0 ? (
                    topUsers.map((entry, index) => (
                        <RankItem 
                            key={index}
                            rank={entry.rank}
                            username={entry.user.username}
                            score={entry.score}
                            isCurrentUser={entry.user.id === currentUserId}
                        />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No leaderboard data available.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
        paddingHorizontal: 16,
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    card: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#3C3C3E',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3C3C3E',
    },
    currentUserItem: {
        backgroundColor: 'rgba(255, 106, 0, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 106, 0, 0.3)',
        marginVertical: 2,
    },
    leftSide: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    rankContainer: {
        width: 36,
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        color: '#999',
        fontWeight: 'bold',
        fontSize: 16,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    username: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    score: {
        color: COLORS.darkOrange,
        fontWeight: 'bold',
        fontSize: 16,
        minWidth: 50,
        textAlign: 'right',
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
        padding: 30,
        fontSize: 14,
    }
});

export default LeaderboardPreview;

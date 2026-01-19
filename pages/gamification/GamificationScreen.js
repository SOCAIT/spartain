import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, SafeAreaView, StatusBar, Text } from 'react-native';
import { COLORS } from '../../constants';
import { AuthContext } from '../../helpers/AuthContext';
import * as GamificationService from '../../services/GamificationService';
import PointsCard from '../../components/gamification/PointsCard';
import StreakCard from '../../components/gamification/StreakCard';
import AchievementRow from '../../components/gamification/AchievementRow';
import LeaderboardPreview from '../../components/gamification/LeaderboardPreview';
import SectionHeader from '../../components/SectionHeader';
import { useFocusEffect } from '@react-navigation/native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const GamificationScreen = ({ navigation }) => {
    const { authState } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // State for gamification data
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);

    const loadData = async () => {
        if (!authState?.user?.id) return;
        
        try {
            // Fetch stats and leaderboard in parallel
            const [statsData, leaderboardData] = await Promise.all([
                GamificationService.getUserStats(authState.user.id),
                GamificationService.getOverallLeaderboard()
            ]);

            setStats(statsData);
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error("Failed to load gamification data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [authState?.user?.id])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ArrowHeaderNew navigation={navigation} title="Your Progress" />
            <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                showsVerticalScrollIndicator={false} // Hide scroll bar for cleaner look
            >
                <PointsCard 
                    userScore={stats?.user_score}
                    currentLevel={stats?.current_level}
                    pointsToNextLevel={stats?.points_to_next_level}
                />

                <StreakCard streaks={stats?.streaks} />

                <AchievementRow 
                    achievements={stats?.achievements} 
                    onSeeAll={() => {
                        // Navigate to full achievements list if implemented
                        console.log("See all achievements");
                    }} 
                />

                <LeaderboardPreview 
                    leaderboardData={leaderboard} 
                    currentUserId={authState?.user?.id} 
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1E',
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 80,
    }
});

export default GamificationScreen;


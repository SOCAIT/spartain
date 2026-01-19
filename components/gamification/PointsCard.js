import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SIZES } from '../../constants';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

const PointsCard = ({ userScore, currentLevel, pointsToNextLevel }) => {
    const totalPoints = userScore?.total_points || 0;
    const level = currentLevel || 1;
    const needed = pointsToNextLevel || 100;
    
    // Calculate progress (assuming next level threshold is current points + needed)
    // This logic might need adjustment based on how the backend returns "points_to_next_level"
    // If backend returns just the remaining points, we need the total required for the level to calculate percentage.
    // For now, let's assume a fixed level up requirement or just show the raw numbers.
    const progress = 0.7; // Placeholder or calculate if total requirement is known

    return (
        <LinearGradient
            colors={[COLORS.darkOrange || '#FF6A00', COLORS.orangeLight || '#FF8533']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.headerRow}>
                <View style={styles.scoreSection}>
                    <Text style={styles.label}>Total Score</Text>
                    <Text style={styles.points} numberOfLines={1}>{totalPoints.toLocaleString()}</Text>
                </View>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText} numberOfLines={1}>Level {level}</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Next Level</Text>
                    <Text style={styles.progressValue} numberOfLines={1}>{needed} pts needed</Text>
                </View>
                <Progress.Bar 
                    progress={progress} 
                    width={width - 80} // Account for card margins and padding
                    color="#FFF" 
                    unfilledColor="rgba(255,255,255,0.3)" 
                    borderWidth={0}
                    height={8}
                    borderRadius={4}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    scoreSection: {
        flex: 1,
        marginRight: 12,
    },
    label: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    points: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    levelBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    levelText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressContainer: {
        marginTop: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '500',
    },
    progressValue: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default PointsCard;

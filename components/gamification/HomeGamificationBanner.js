import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@rneui/themed';
import { COLORS } from '../../constants';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

const HomeGamificationBanner = ({ onPress, userStats }) => {
    // Default values if no stats yet
    const level = userStats?.current_level || 1;
    const points = userStats?.user_score?.total_points || 0;
    const needed = userStats?.points_to_next_level || 100;
    
    // Simple progress calculation
    const progress = 0.5; // Placeholder

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.wrapper}>
            <LinearGradient
                colors={['#2C2C2E', '#1C1C1E']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Top row: Badge, Points, Chevron */}
                <View style={styles.topRow}>
                    <View style={styles.leftSection}>
                        <View style={styles.badge}>
                            <Icon name="trophy" type="font-awesome" color="#FFD700" size={14} />
                            <Text style={styles.levelText}>Lvl {level}</Text>
                        </View>
                        <Text style={styles.pointsText} numberOfLines={1}>{points} pts</Text>
                    </View>
                    <Icon name="chevron-right" type="material-community" color="#666" size={20} />
                </View>
                

                {/* Bottom row: Next level progress */}
                <View style={styles.bottomRow}>
                    <Text style={styles.nextLevelText} numberOfLines={1}>
                        Next Level: {needed} pts
                    </Text>
                    <Progress.Bar 
                        progress={progress} 
                        width={width - 64} // Full width minus margins and padding
                        color={COLORS.darkOrange} 
                        unfilledColor="rgba(255,255,255,0.1)" 
                        borderWidth={0}
                        height={6}
                        borderRadius={3}
                        style={styles.progressBar}
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 12,
        marginBottom: 20,
    },
    container: {
        height: 120,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    levelText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 13,
    },
    pointsText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    bottomRow: {
        width: '100%',
    },
    nextLevelText: {
        color: '#999',
        fontSize: 11,
        marginBottom: 8,
    },
    progressBar: {
        width: '100%',
    },
});

export default HomeGamificationBanner;

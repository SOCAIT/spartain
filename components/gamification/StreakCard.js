import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { Icon } from '@rneui/themed';

const StreakItem = ({ type, count, icon, color }) => (
    <View style={styles.streakItem}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Icon name={icon} type="material-community" color={color} size={22} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.count} numberOfLines={1}>{count} Days</Text>
            <Text style={styles.type} numberOfLines={1}>{type}</Text>
        </View>
        <Icon name="fire" type="material-community" color={count > 0 ? COLORS.darkOrange : '#666'} size={18} />
    </View>
);

const StreakCard = ({ streaks }) => {
    // Default streaks if none provided
    const defaultStreaks = [
        { streak_type: 'workout', current_streak: 0, icon: 'dumbbell', color: '#4CAF50', label: 'Workout' },
        { streak_type: 'nutrition', current_streak: 0, icon: 'food-apple', color: '#FF9800', label: 'Nutrition' },
    ];

    const displayStreaks = streaks && streaks.length > 0 ? streaks.map(s => ({
        ...s,
        icon: s.streak_type === 'workout' ? 'dumbbell' : s.streak_type === 'nutrition' ? 'food-apple' : 'scale-bathroom',
        color: s.streak_type === 'workout' ? '#4CAF50' : s.streak_type === 'nutrition' ? '#FF9800' : '#2196F3',
        label: s.streak_type.charAt(0).toUpperCase() + s.streak_type.slice(1)
    })) : defaultStreaks;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Active Streaks</Text>
            <View style={styles.grid}>
                {displayStreaks.map((streak, index) => (
                    <StreakItem 
                        key={index}
                        type={streak.label}
                        count={streak.current_streak}
                        icon={streak.icon}
                        color={streak.color}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        marginHorizontal: 16,
        marginTop: 10,
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    streakItem: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3C3C3E',
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    count: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: -0.3,
    },
    type: {
        color: '#999',
        fontSize: 11,
        marginTop: 2,
    },
});

export default StreakCard;

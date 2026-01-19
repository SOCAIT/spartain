import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../constants';

const AchievementItem = ({ name, icon, earned, onPress }) => (
    <TouchableOpacity style={[styles.item, !earned && styles.locked]} onPress={onPress}>
        <View style={styles.iconCircle}>
            <Text style={styles.emoji}>{icon || '🏆'}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
    </TouchableOpacity>
);

const AchievementRow = ({ achievements, onSeeAll }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recent Achievements</Text>
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {achievements && achievements.length > 0 ? (
                    achievements.map((item, index) => (
                        <AchievementItem 
                            key={index}
                            name={item.achievement.name}
                            icon={item.achievement.icon}
                            earned={true}
                            onPress={() => {}}
                        />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No achievements earned yet. Start working out!</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 40, // Increased bottom margin
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: FONTS.bold,
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    item: {
        width: 100,
        marginRight: 15,
        alignItems: 'center',
    },
    locked: {
        opacity: 0.5,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3C3C3E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: COLORS.gold || '#FFD700',
    },
    emoji: {
        fontSize: 24,
    },
    name: {
        color: '#FFF',
        fontSize: 12,
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
        marginLeft: 16,
    }
});

export default AchievementRow;


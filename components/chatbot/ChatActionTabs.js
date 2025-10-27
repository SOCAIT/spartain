import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

export default function ChatActionTabs({ onActionPress }) {
  return (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onActionPress('AIWorkoutPlan')}
        >
          <Text style={styles.tabText}>Create Workout Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => onActionPress('AINutritionPlan')}
        >
          <Text style={styles.tabText}>Create Nutrition Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: COLORS.dark,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.99,
    shadowRadius: 10,
  },
  tab: {
    marginHorizontal: 5,
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabText: {
    color: '#FFF',
    fontSize: 12,
  },
});


import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const DaySelector = ({ selectedDay, setSelectedDay }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.dayContainer}>
      {days.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayButton,
            selectedDay === day && styles.selectedDayButton,
          ]}
          onPress={() => setSelectedDay(day)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  selectedDayButton: {
    backgroundColor: '#87ceeb',
  },
  dayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
  },
});

export default DaySelector;

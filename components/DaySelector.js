import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

const DaySelector = ({ selectedDay, onDaySelect, setSelectedDay }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get current day of week (0-6, where 0 is Sunday)
  const getCurrentDay = () => {
    const today = new Date().getDay();
    // Convert Sunday (0) to 6, and shift other days back by 1 to match our array
    return today === 0 ? 6 : today - 1;
  };

  // Get day number for a specific day of the week
  const getDayNumber = (dayIndex) => {
    const today = new Date();
    const currentDay = today.getDay();
    const currentDate = today.getDate();
    
    // Calculate the date for the given day of the week
    const dayDiff = (dayIndex + 1) - (currentDay === 0 ? 7 : currentDay);
    const targetDate = new Date(today);
    targetDate.setDate(currentDate + dayDiff);
    
    return targetDate.getDate();
  };

  // Set current day as selected on component mount
  useEffect(() => {
    if (selectedDay === undefined || selectedDay === null) {
      const currentDay = days[getCurrentDay()];
      if (setSelectedDay) {
        setSelectedDay(currentDay);
      } else if (onDaySelect) {
        onDaySelect(currentDay);
      }
    }
  }, []);

  const handleDaySelect = (day) => {
    if (setSelectedDay) {
      setSelectedDay(day);
    } else if (onDaySelect) {
      onDaySelect(day);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
            ]}
            onPress={() => handleDaySelect(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
            <Text
              style={[
                styles.monthText,
                selectedDay === day && styles.selectedMonthText,
              ]}
            >
              {getDayNumber(index)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightDark,
    borderRadius: 12,
    padding: 8,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  selectedDayButton: {
    backgroundColor: COLORS.darkOrange,
  },
  dayText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  monthText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 2,
  },
  selectedMonthText: {
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default DaySelector;

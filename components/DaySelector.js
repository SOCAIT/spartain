import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants';

/**
 * Enhanced DaySelector with animations and improved visuals
 */
const DaySelector = ({ selectedDay, onDaySelect, setSelectedDay }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Animation values for each day
  const scaleAnims = useRef(days.map(() => new Animated.Value(1))).current;
  
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

  // Check if a day is today
  const isToday = (dayIndex) => {
    return dayIndex === getCurrentDay();
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

  const handleDaySelect = (day, index) => {
    // Animate the selected day
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (setSelectedDay) {
      setSelectedDay(day);
    } else if (onDaySelect) {
      onDaySelect(day);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {days.map((day, index) => {
          const isSelected = selectedDay === day;
          const isTodayDay = isToday(index);
          
          return (
            <Animated.View
              key={day}
              style={[
                styles.dayButtonWrapper,
                { transform: [{ scale: scaleAnims[index] }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDayButton,
                  isTodayDay && !isSelected && styles.todayButton,
                ]}
                onPress={() => handleDaySelect(day, index)}
                activeOpacity={0.7}
              >
                {/* Selected indicator dot */}
                {isSelected && <View style={styles.selectedIndicator} />}
                
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isTodayDay && !isSelected && styles.todayText,
                  ]}
                >
                  {day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.selectedDateText,
                    isTodayDay && !isSelected && styles.todayDateText,
                  ]}
                >
                  {getDayNumber(index)}
                </Text>
                
                {/* Today indicator */}
                {isTodayDay && (
                  <View style={[
                    styles.todayDot,
                    isSelected && styles.todayDotSelected,
                  ]} />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 12,
  },
  
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusMd,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  
  dayButtonWrapper: {
    flex: 1,
    marginHorizontal: 2,
  },
  
  dayButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: SIZES.radiusSm,
    position: 'relative',
  },
  
  selectedDayButton: {
    backgroundColor: COLORS.darkOrange,
    ...SHADOWS.glowSm,
  },
  
  todayButton: {
    backgroundColor: COLORS.orangeMuted,
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  
  dayText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  
  selectedDayText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  
  todayText: {
    color: COLORS.darkOrange,
    fontWeight: '600',
  },
  
  dateText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  
  selectedDateText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  
  todayDateText: {
    color: COLORS.darkOrange,
  },
  
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.darkOrange,
  },
  
  todayDotSelected: {
    backgroundColor: COLORS.white,
  },
});

export default DaySelector;

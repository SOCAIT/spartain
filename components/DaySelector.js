import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { COLORS } from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from './IconButton';

const DaySelector = ({ selectedDay = 0, onDaySelect = () => {} }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Get current date
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create an array of days in the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Create an array of day names (Monday to Sunday)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get today's date
  const todayDate = today.getDate();

  // Get current week's days
  const getCurrentWeekDays = () => {
    const currentDay = today.getDay();
    // Adjust to make Monday the first day (0)
    const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;
    const weekStart = today.getDate() - adjustedDay;
    return Array.from({ length: 7 }, (_, i) => weekStart + i);
  };

  const weekDays = getCurrentWeekDays();

  const renderDayButton = (day) => {
    const isToday = day === todayDate;
    const isValidDay = day > 0 && day <= daysInMonth;

    if (!isValidDay) return <View key={day} style={styles.emptyDay} />;

    // Get the day of the week (0-6) for this date, with Monday as 0
    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const isSelected = adjustedDayOfWeek === selectedDay;

    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayButton,
          isSelected && styles.selectedDay,
          isToday && styles.today,
        ]}
        onPress={() => {
          if (typeof onDaySelect === 'function') {
            onDaySelect(adjustedDayOfWeek);
          }
          setModalVisible(false);
        }}
      >
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayText,
          ]}
        >
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekView}>
        <View style={styles.dayNamesContainer}>
          {dayNames.map((dayName) => (
            <Text key={dayName} style={styles.dayName}>
              {dayName}
            </Text>
          ))}
        </View>
        <View style={styles.daysContainer}>
          {weekDays.map(renderDayButton)}
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={styles.calendarButton}
      >
        <Icon name="calendar-month" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
              <IconButton name="close" onPress={() => setModalVisible(false)} />
            </View>
            <View style={styles.dayNamesContainer}>
              {dayNames.map((dayName) => (
                <Text key={dayName} style={styles.dayName}>
                  {dayName}
                </Text>
              ))}
            </View>
            <View style={styles.modalDaysContainer}>
              {Array(firstDayOfMonth).fill(null).map((_, index) => (
                <View key={`empty-${index}`} style={styles.emptyDay} />
              ))}
              {days.map(renderDayButton)}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekView: {
    flex: 1,
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    width: 35,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 17.5,
    backgroundColor: COLORS.dark,
  },
  selectedDay: {
    backgroundColor: COLORS.darkOrange,
    transform: [{ scale: 1.1 }],
    shadowColor: COLORS.darkOrange,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  today: {
    borderWidth: 2,
    borderColor: COLORS.darkOrange,
  },
  dayText: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.7,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    opacity: 1,
  },
  todayText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyDay: {
    width: 35,
    height: 35,
    margin: 2,
  },
  calendarButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

export default DaySelector;

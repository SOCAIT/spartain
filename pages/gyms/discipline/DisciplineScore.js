import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants';

const DisciplineScore = () => {
  const logs = [
    { date: 'Sept 10', workout: true, meal: true, hydration: true },
    { date: 'Sept 9', workout: true, meal: false, hydration: true },
    // More logs
  ];

  const calculateDisciplineScore = () => {
    const completed = logs.filter(log => log.workout && log.meal && log.hydration).length;
    return (completed / logs.length) * 100;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discipline Score: {calculateDisciplineScore()}%</Text>

      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <View style={styles.logRow}>
            <Text style={styles.logText}>{item.date}</Text>
            <Text style={styles.logText}>Workout: {item.workout ? '✔️' : '❌'}</Text>
            <Text style={styles.logText}>Meal: {item.meal ? '✔️' : '❌'}</Text>
            <Text style={styles.logText}>Hydration: {item.hydration ? '✔️' : '❌'}</Text>
          </View>
        )}
        keyExtractor={(item) => item.date}
      />

      <Text style={styles.recommendation}>Recommendation: Stick to meal plans for better results!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.dark,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logText: {
    fontSize: 16,
    color: '#555',
  },
  recommendation: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#ff9800',
  },
});

export default DisciplineScore;

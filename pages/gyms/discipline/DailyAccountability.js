import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ProgressBarAndroid } from 'react-native';

const DailyAccountability = () => {
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [mealCompleted, setMealCompleted] = useState(false);
  const [hydrationCompleted, setHydrationCompleted] = useState(false);

  const calculateProgress = () => {
    let completed = 0;
    if (workoutCompleted) completed++;
    if (mealCompleted) completed++;
    if (hydrationCompleted) completed++;
    return completed / 3;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Accountability</Text>
      <Text style={styles.streakText}>Streak: 5 Days 🔥</Text>

      <View style={styles.taskRow}>
        <Text style={styles.taskText}>Workout Complete</Text>
        <Switch value={workoutCompleted} onValueChange={setWorkoutCompleted} />
      </View>
      <View style={styles.taskRow}>
        <Text style={styles.taskText}>Meal Plan Adhered</Text>
        <Switch value={mealCompleted} onValueChange={setMealCompleted} />
      </View>
      <View style={styles.taskRow}>
        <Text style={styles.taskText}>Hydration Goal Met</Text>
        <Switch value={hydrationCompleted} onValueChange={setHydrationCompleted} />
      </View>

      <ProgressBarAndroid styleAttr="Horizontal" color="#4caf50" progress={calculateProgress()} />

      <Text style={styles.message}>
        {calculateProgress() === 1 ? "Great Job! You're all set! 🎉" : "Keep pushing, you're almost there!"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  streakText: {
    fontSize: 18,
    color: '#f57c00',
    marginBottom: 20,
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#555',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#4caf50',
  },
});

export default DailyAccountability;

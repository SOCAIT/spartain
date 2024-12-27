import React, { useState } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS } from '../../constants';

import axios from 'axios'
import { backend_url } from '../../config/config';

const ExerciseLogModal = ({ exerciseName, user, visible, onClose }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState(new Animated.Value(0));

  const handleSaveLog = async () => {
    if (weight && reps && sets) {

      const currentDate = new Date().toISOString();

          // Prepare the request body
      const requestBody = {
        exercise: { name: exerciseName },
        user: user,  // Assuming the user ID is 1
        sets: sets,
        reps: reps,
        other: "none",
        weight: weight,
        date: currentDate  // Automatically determined date
      };

      try {
        // Make the POST request
        const response = await axios.post(
          `${backend_url}exercise-log/`,  // Replace `graphql/` with the correct endpoint if needed
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer YOUR_AUTH_TOKEN`, // Add if authentication is required
            },
          }
        );
    
        // Handle the response
        console.log("Response Data:", response.data);
      } catch (error) {
        // Handle any errors
        console.error("Request Error:", error.response ? error.response.data : error.message);
      }
    
      setFeedbackMessage(`Log saved: ${sets} sets of ${reps} reps at ${weight} kg.`);

      triggerFeedback(true); // Green for success
      setWeight('');
      setReps('');
      setSets('');
    } else {
      setFeedbackMessage('Error: Please fill in all fields.');
      triggerFeedback(false); // Red for error
    }
  };

  const triggerFeedback = (success) => {
    setFeedbackColor(new Animated.Value(success ? 0 : 1));
    Animated.timing(feedbackColor, {
      toValue: success ? 0 : 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setFeedbackMessage('');
    }, 5000); // Feedback message disappears after 3 seconds
  };

  const feedbackBackgroundColor = feedbackColor.interpolate({
    inputRange: [0,1],
    outputRange: ['#4caf50', '#ff4d4d'], // Green for success, Red for error
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Log Exercise</Text>

          {feedbackMessage ? (
            <Animated.View style={[styles.feedbackContainer, { backgroundColor: feedbackBackgroundColor }]}>
              <Text style={styles.feedbackText}>{feedbackMessage}</Text>
            </Animated.View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            placeholderTextColor={COLORS.lightGray5}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <TextInput
            style={styles.input}
            placeholder="Reps"
            placeholderTextColor={COLORS.lightGray5}
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />

          <TextInput
            style={styles.input}
            placeholder="Sets"
            placeholderTextColor={COLORS.lightGray5}
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
          />

          <TouchableOpacity onPress={handleSaveLog} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Log</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: COLORS.dark,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  feedbackContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  feedbackText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: COLORS.white,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.darkOrange,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExerciseLogModal;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const FindTrainersScreen = ({ navigation }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request location permission and get current location
    Geolocation.requestAuthorization('whenInUse')
      .then(status => {
        if (status === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              fetchTrainers(latitude, longitude);
            },
            error => {
              console.error(error);
              setError('Failed to get location');
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          setError('Location permission denied');
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to request location permission');
        setLoading(false);
      });
  }, []);

  const fetchTrainers = (latitude, longitude) => {
    axios
      .get(`YOUR_API_ENDPOINT/trainer-nearby`, {
        params: { lat: latitude, lng: longitude },
      })
      .then(response => {
        setTrainers(response.data.trainers); // Assuming response.data.trainers is the list
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch trainers');
        setLoading(false);
      });
  };

  const initiateChat = (trainer) => {
    // Navigate to chat screen with the selected trainer
    navigation.navigate('TrainerChatScreen', { trainerId: trainer.id, trainerName: trainer.name });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Trainers</Text>

      <FlatList
        data={trainers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.trainerItem}>
            <Text style={styles.trainerName}>{item.name}</Text>
            <Text style={styles.trainerDistance}>{item.distance} km away</Text>
            <TouchableOpacity style={styles.chatButton} onPress={() => initiateChat(item)}>
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  trainerItem: {
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  trainerName: {
    color: '#fff',
    fontSize: 18,
  },
  trainerDistance: {
    color: '#aaa',
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FindTrainersScreen;

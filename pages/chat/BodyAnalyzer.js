import React, { useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { backend_url } from '../../config/config';
import { set } from 'react-hook-form';
import { AuthContext } from '../../helpers/AuthContext';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const BodyAnalyzerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {authState, setAuthState } = useContext(AuthContext)

  const [measurements, setMeasurements] = useState({
    weight: 70, // kg
    bodyFat: 15, // %
    muscleMass: 35, // kg
    circumference: 90, // cm
  });

  // Function to fetch current metrics from your API
  const fetchCurrentMetrics = async () => {
    // try {
    //   const response = await fetch(backend_url );
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch metrics');
    //   }
    //   const data = await response.json();
    //   setMeasurements(data);
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert('Error', 'Failed to fetch current metrics.');
    // }

    console.log(authState.latest_body_measurement)

    // updating existing data
    setMeasurements({
      ...measurements,
      weight: authState.latest_body_measurement.weight_kg, // kg

    })
  };

  // Fetch metrics when the screen mounts
  useEffect(() => {
    fetchCurrentMetrics();
  }, []);

  // Update measurements if returned from the CameraScreen
  useEffect(() => {
    if (route.params?.measurements) {
      setMeasurements(route.params.measurements);
    }
  }, [route.params?.measurements]);

  return (
    <View style={styles.containerMain}>
              <ArrowHeaderNew navigation={navigation} title={"Analyze & Scan your body"} />

    <View style={styles.container}>
        {/* <TouchableOpacity style={styles.refreshButton} onPress={fetchCurrentMetrics}>
          <Icon name="refresh-outline" size={25} color="#007AFF" />
        </TouchableOpacity> */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}> 
          <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('CameraScreen')}
          > 
          <Icon name="scan-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
        
      <View style={styles.measurementsContainer}>
        <View style={styles.card}>
          <Icon name="scale-outline" size={40}  color={COLORS.darkOrange}/>
          <Text style={styles.value}>{measurements.weight} kg</Text>
          <Text style={styles.label}>Weight</Text>
        </View>
        <View style={styles.card}>
          <Icon name="water-outline" size={40}  color={COLORS.darkOrange} />
          <Text style={styles.value}>{measurements.bodyFat}%</Text>
          <Text style={styles.label}>Body Fat</Text>
        </View>
        <View style={styles.card}>
          <Icon name="barbell-outline" size={40} color={COLORS.darkOrange} />
          <Text style={styles.value}>{measurements.muscleMass} kg</Text>
          <Text style={styles.label}>Muscle Mass</Text>
        </View>
        <View style={styles.card}>
          <Icon name="resize-outline" size={40} color={COLORS.darkOrange} />
          <Text style={styles.value}>{measurements.circumference} cm</Text>
          <Text style={styles.label}>Circumference</Text>
        </View>
      </View>

      {/* Additional buttons for other features */}
      <View style={styles.additionalButtons}>
        <TouchableOpacity
          style={styles.additionalButton}
          onPress={() => navigation.navigate('ChartsScreen')}
        >
          <Icon name="stats-chart-outline" size={25} color={COLORS.darkOrange} />
          <Text style={styles.buttonLabel}>Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.additionalButton}
          onPress={() => navigation.navigate('HistoryScreen')}
        >
          <Icon name="time-outline" size={25} color={COLORS.darkOrange} />
          <Text style={styles.buttonLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.additionalButton}
          onPress={() => navigation.navigate('TipsScreen')}
        >
          <Icon name="information-circle-outline" size={25} color={COLORS.darkOrange} />
          <Text style={styles.buttonLabel}>Tips</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 0,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  refreshButton: {
    marginLeft: 10,
    padding: 8,
  },
  scanButton: {
    backgroundColor: COLORS.darkOrange,
    padding: 20,
    borderRadius: 50,
    marginBottom: 30,
    elevation: 3,
  },

  additionalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  additionalButton: {
    alignItems: 'center',
    color: COLORS.darkOrange,
  },
  buttonLabel: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.darkOrange
  },

  measurementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.primary,
    width: 140,
    height: 160,
    margin: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    paddingVertical: 10,
  },
  value: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
});

export default BodyAnalyzerScreen;
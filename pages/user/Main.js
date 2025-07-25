import React, {useEffect, useState,useContext} from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FitnessScore from '../../components/scores/FitnessScore';
import SectionHeader from '../../components/SectionHeader';
import CardOverlay from '../../components/workouts/CardOverlay';

import { COLORS } from '../../constants'
// import ProfileCard from '../components/ProfileCard'
import { AuthContext } from '../../helpers/AuthContext'
import BodyMeasurements from '../../components/scores/BodyMeasurents';
import ChartDisplay from '../../components/charts/ChartDisplay';
import CustomLineChart from '../../components/charts/CustomLineChart';
import CustomProgressChart from '../../components/charts/CustomProgressChart';
// Data collection postponed for now
// import { useDataCollection, useScreenTracking } from '../../hooks/useDataCollection';
// import DataCollectionTest from '../../components/DataCollectionTest';
import { useScreenTracking } from '../../hooks/useDataCollection';

const USER= {
   "username": "Lelouch",
   "height": 0,
   "gender": "M",
   "weight": 0,
   "age": 0
}

export default function MainScreen({navigation}) {
  const {authState} = useContext(AuthContext)
  const [bodyMeasurements, setBodyMeasurements] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  
  // Data collection postponed for now
  // const { collectTodayHealthData } = useDataCollection(); 
  useScreenTracking('MainScreen');

  const muscleMassData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [0, 75, 80, 85, 85, 90],
      },
      {
        data: [0],
        withDots: false,
      },
    ]
  };

  const fatLossData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [25, 20, 15, 10, 5, 7],
      },
      {
        data: [0],
        withDots: false,
      },
    ]
  };

  const muscleGroupData = {
    labels: ["Chest", "Back", "Delts", "Arms", "Abs", "Legs"],
    data: [0, 0.75, 0.80, 0.85, 0.85, 0.90] 
  };

  const charts = [
    { 
      id: 1, 
      title: "Muscle Mass", 
      component: <CustomLineChart chart_data={muscleMassData} />,
      backgroundColor: COLORS.dark,
      onPress: () => navigation.navigate("AnalyticalView", { 
        type: 'muscle',
        data: muscleMassData,
        userWeight: authState.latest_body_measurement?.weight_kg || 0
      })
    },
    { 
      id: 2, 
      title: "Fat Loss", 
      component: <CustomLineChart chart_data={fatLossData} />,
      backgroundColor: COLORS.dark,
      onPress: () => navigation.navigate("AnalyticalView", { 
        type: 'fat',
        data: fatLossData,
        userWeight: authState.latest_body_measurement?.weight_kg || 0
      })
    },
    { 
      id: 3, 
      title: "Muscle Groups", 
      component: <CustomProgressChart chart_data={muscleGroupData} />,
      backgroundColor: COLORS.dark,
      onPress: () => navigation.navigate("AnalyticalView", { 
        type: 'groups',
        data: muscleGroupData,
        userWeight: authState.latest_body_measurement?.weight_kg || 0
      })
    },
  ];

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
    
    // Test data collection on screen load
    console.log('MainScreen loaded - data collection should be working');
  }, [])

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingText}> {authState.username}</Text>

        {/* TODO: add notification container */}
        {/* <View style={styles.notificationContainer}>
          <Icon name="bell" size={24} color="#FFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>8</Text>
          </View>
        </View> */}
      </View>

      {/* User Info */}
      <TouchableOpacity 
        style={styles.userInfo} 
        onPress={() => {
          navigation.navigate("EditProfile", { authState });
        }}
      >
        <View style={styles.profileImageContainer}>
          {authState.profile_photo ? (
            <Image
              source={{ uri: authState.profile_photo }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="person" size={40} color="#FF6A00" />
            </View>
          )}
        </View>
        <View style={styles.userDetails}>
          <View style={styles.statusContainer}>
            <View style={styles.detailRow}>
              <MaterialIcons name="fitness-center" size={16} color="#FF6A00" />
              <Text style={styles.statusText}>Weight: {authState.latest_body_measurement?.weight_kg || 'N/A'} kg</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="flag" size={16} color="#FF6A00" />
              <Text style={styles.statusText}>Goal: {authState.user_target === 'FL' ? 'Fat Loss' : authState.user_target === 'MG' ? 'Muscle Gain' : authState.user_target === 'WL' ? 'Weight Loss' : authState.user_target === 'ST' ? 'Strength Training' : authState.user_target === 'EN' ? 'Endurance' : 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={16} color="#FF6A00" />
              <Text style={styles.statusText}>Gender: {authState.gender === 'M' ? 'Male' : authState.gender === 'F' ? 'Female' : authState.gender === 'O' ? 'Other' : 'N/A'}</Text>
            </View>
            <View style={styles.subscriptionContainer}>
              <View style={styles.subscriptionBadge}>
                <MaterialIcons name="star" size={14} color="#FFF" style={styles.subscriptionIcon} />
                <Text style={styles.subscriptionText}>Premium</Text>
              </View>
              <TouchableOpacity>
                <MaterialIcons name="edit" size={24} color="#FFF"/>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </TouchableOpacity>

      {/* Body Measurements */}
      <SectionHeader title={"User Info"} childComponent={<BodyMeasurements navigation={navigation} />} /> {/*  */}

      {/* Charts */}
      {/* <SectionHeader title={"Progress Charts"} childComponent={<ChartDisplay navigation={navigation} charts={charts} />} /> */}

      {/* Data Collection Test - Postponed for now */}
      {/* <DataCollectionTest /> */}

      {/* <SectionHeader title={"Fitness Scores"} childComponent={<FitnessScore />} /> */}
      {/* <View style={styles.carouselContainer}>
        <CustomCarousel items={charts} renderItem={renderChart} navigation={navigation} />
      </View> */}
      {/* <SectionHeader title={"Analytical View"} childComponent={<TouchableOpacity style={styles.analyticalButton} onPress={() => navigation.navigate("AnalyticalView")}><Text style={styles.analyticalText}>View Detailed Analysis</Text></TouchableOpacity>} /> */}
     

      {/* Progress */}

      {/* Workouts */}
      {/* <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Workouts (25)</Text>
          <TouchableOpacity>
            <MaterialIcons name="more-horiz" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <CardOverlay />
        
      </View> */}

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    //paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'ios' ? 30 : 0


  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2C2C2E',

    paddingHorizontal: 15,
  },
  dateContainer: {}, 
  dateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6A00',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6A00',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  greetingText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 10,
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 8,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  subscriptionBadge: {
    backgroundColor: '#FF6A00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionIcon: {
    marginRight: 4,
  },
  subscriptionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#FF6A00',
    fontSize: 14,
  },
  
  
  
  moreButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 20,
    padding: 10,
  },
  metricCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: 'center',
  },
  metricLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticalText: {
    color: '#FF6A00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  carouselContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  analyticalButton: {
    backgroundColor: '#FF6A00',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
});

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

  // const [user, setUser] = useState(USER)

  useEffect(() => {
    // setUser(prevUser => ({
    //   ...prevUser,
    //   username: authState.username,
    //   id: authState.id,
    //   age: authState.age,
    //   height: authState.height,
      
    // }));
    // Set current date
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, [])
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        <View style={styles.notificationContainer}>
          <Icon name="bell" size={24} color="#FFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>8</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate("EditProfile",  { authState })}>
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
          <Text style={styles.greetingText}> {authState.username}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.detailRow}>
              <MaterialIcons name="fitness-center" size={16} color="#FF6A00" />
              <Text style={styles.statusText}>Weight: {authState.latest_body_measurement?.weight_kg || 'N/A'} kg</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons name="flag" size={16} color="#FF6A00" />
              <Text style={styles.statusText}>Goal: {authState.user_target || 'N/A'}</Text>
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
      <SectionHeader title={"User Info"} childComponent={<BodyMeasurements navigation={navigation} />} />

      <SectionHeader title={"Fitness Scores"} childComponent={<FitnessScore />} />
     

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
    marginTop: 20,
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
});

import React, {useEffect, useState,useContext} from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FitnessScore from '../../components/scores/FitnessScore';
import SectionHeader from '../../components/SectionHeader';
import CardOverlay from '../../components/workouts/CardOverlay';

import { COLORS } from '../../constants'
// import ProfileCard from '../components/ProfileCard'
import { AuthContext } from '../../helpers/AuthContext'
const USER= {
   "username": "Lelouch",
   "height": 0,
   "gender": "M",
   "weight": 0,
   "age": 0
}

export default function MainScreen({navigation}) {
  const {authState} = useContext(AuthContext)

  // const [user, setUser] = useState(USER)

  useEffect(() => {
    // setUser(prevUser => ({
    //   ...prevUser,
    //   username: authState.username,
    //   id: authState.id,
    //   age: authState.age,
    //   height: authState.height,
      
    // }));
       

  }, [])
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>JUN 25, 2025</Text>
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

        <Image
          source={{ uri: 'https://via.placeholder.com/80' }} // Replace with the actual image URL
          style={styles.profileImage}
        />
        <View style={styles.userDetails}>
          <Text style={styles.greetingText}>Hello, {authState.username}!</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>88% Healthy</Text>
            <Icon name="star" size={14} color="#FFD700" style={styles.statusIcon} />
            <Text style={styles.statusText}>Pro</Text>
            <TouchableOpacity >
                <MaterialIcons  name="edit" size={24} color="#FFF"/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      
      <SectionHeader title={"Fitness Scores"} childComponent={<FitnessScore />} />

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
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  dateContainer: {},
  dateText: {
    color: '#FFF',
    fontSize: 14,
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
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userDetails: {
    marginLeft: 15,
  },
  greetingText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    marginRight: 5,
  },
  statusIcon: {
    marginHorizontal: 5,
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

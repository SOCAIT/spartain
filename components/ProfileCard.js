import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from './CustomButton';

const ProfileName = ({ iconName, username, onPress, onPressReport
 }) => {
  return (
    <TouchableOpacity style={styles.rowContainer} onPress={onPress} >
      <Icon name={iconName} size={24} color={COLORS.white} style={styles.icon} />
      <Text style={styles.username}>{username}</Text>
    </TouchableOpacity>
  );
};

const UserDetails = ({ iconName, age, height, weight, onPress, onPressReport }) => {
  return (
    <View>
    <TouchableOpacity style={styles.colContainer} onPress={onPress} >
      <View style={{flexDirection: "row"}}>
        <Text style={styles.username}>Age:{""}</Text> 
        <Text style={styles.username_weak}> {age}</Text>
      </View>
      <View style={{flexDirection: "row"}}>
        <Text style={styles.username}>Weight:</Text> 
        <Text style={styles.username_weak}>{weight} (kg) </Text>
      </View>

      <View style={{flexDirection: "row"}}>
        <Text style={styles.username}>Height:</Text> 
        <Text style={styles.username_weak}>{height} (cm) </Text>
      </View>

    </TouchableOpacity>

    <View style={styles.buttonContainer}>
      <CustomButton name={"Edit Profile"} onPress={onPress} />
      <CustomButton name={"Body Analysis Report"} onPress={onPressReport} />
    </View>
    


    </View>
  );
};
const ProfileCard = ({navigation, user, onPress, onPressReport}) => {
  return (
    <View style={styles.container}>
      {/* <MenuRow iconName="help-circle" settingName="Anti-Phishing Tutorial" onPress={onPress_a}/>
      <MenuRow iconName="information" settingName="Subscription Details" onPress={onPress_b}/>
      <MenuRow iconName="shield-checkmark" settingName="Privacy Policy" onPress={onPress_c}/> */}

      {/* Add more rows as needed */}
      <ProfileName  iconName="information" username={user.username} />

      <UserDetails age={user.age} weight={user.weight} height={user.height} onPress={onPress} onPressReport={onPressReport}/>


    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 20,
    width: "90%",
    borderRadius: SIZES.padding,
    backgroundColor: COLORS.lightDark  
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "90%",
    marginVertical: 8,
    borderBottomWidth: 0.4,
    padding: 5,
    borderColor: COLORS.white
  },

  colContainer: {
    // flexDirection: 'row',
    //alignItems: 'center',
    width: "90%",
    marginVertical: 8,
    // borderBottomWidth: 0.4,
    padding: 10,
    borderColor: COLORS.white
  },
  icon: {
    marginRight: 5,
  },
  username: {
    fontSize: 18,
    marginRight: 5,
    color: COLORS.white,
    fontWeight: 'bold'
  },

  username_weak: {
    fontSize: 18,
    marginRight: 5,
    color: COLORS.white,
  },
  buttonContainer:{
     flexDirection: "row",
     justifyContent: "space-around"
  }
 
});

export default ProfileCard;

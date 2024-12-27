import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuRow = ({ iconName, settingName, onPress }) => {
  return (
    <TouchableOpacity style={styles.rowContainer} onPress={onPress} >
      <Icon name={iconName} size={24} color={COLORS.white} style={styles.icon} />
      <Text style={styles.settingName}>{settingName}</Text>
    </TouchableOpacity>
  );
};

const StylishMenu = ({navigation, onPress_a, onPress_b, onPress_c, onPress_d}) => {
  return (
    <View style={styles.container}>


      <MenuRow iconName="help-circle" settingName="Anti-Phishing Tutorial" onPress={onPress_a}/>
      <MenuRow iconName="information" settingName="Subscription Details" onPress={onPress_b}/>
      <MenuRow iconName="shield-checkmark" settingName="Privacy Policy" onPress={onPress_c}/>

      {/* Add more rows as needed */}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginTop: 10,
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
  icon: {
    marginRight: 5,
  },
  settingName: {
    fontSize: 16,
    color: COLORS.white
  },
});

export default StylishMenu;

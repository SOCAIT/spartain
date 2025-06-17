import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../helpers/AuthContext';
import { COLORS } from '../../constants';

const BodyMeasurements = ({navigation}) => {
  const { authState } = useContext(AuthContext);
  // Fallback defaults if values are not available in authState
  const height = authState.height || 175;
  const weight = authState.weight || 70;
  const age = authState.age || 30;
  const gender = authState.gender || "M";

  const metrics = [
    // { value: `${height} cm`, label: "Height", backgroundColor: '#6A1B9A', iconName: "straighten", iconType: "Material" },
    { value: `Edit Info`, label: "Update your info (age, target goal, activity level)", backgroundColor: COLORS.lightDark, iconName: "edit", iconType: "Material", onPress: () => navigation.navigate("EditProfile", { authState }) },
    { value: `Body Analyzer`, label: "scan body, measure your progress", backgroundColor: COLORS.lightDark, iconName: "body", iconType: "Ionicon", onPress: () => navigation.navigate("BodyAnalyzer") },
    // { value: `Body Analyzer`, label: "scan body, measure your progress", backgroundColor: COLORS.lightDark, iconName: "fitness-center", iconType: "Material", onPress: () => navigation.navigate("BodyAnalyzer") },


   
  ];

  return (
    <ScrollView horizontal={true} style={styles.metricsScrollContainer} showsHorizontalScrollIndicator={false}>
      {metrics.map((metric, index) => (
        <TouchableOpacity key={index} style={[styles.metricCard, { backgroundColor: metric.backgroundColor }]} onPress={metric.onPress}>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          {metric.iconType === "Material" ? (
            <MaterialIcons name={metric.iconName} size={24} color="#FFF" style={styles.metricIcon} />
          ) : metric.iconType=='Ionicon' ?( <Ionicons name={metric.iconName} size={24} color="#FFF" style={styles.metricIcon} />) : (
            <Icon name={metric.iconName} size={24} color="#FFF" style={styles.metricIcon} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  metricsScrollContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  metricCard: {
    width: 160, // Adjust width as needed
    borderRadius: 10,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: 10, // Space between cards
  },
  metricValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#FFF',
    fontSize: 12,
  },
  metricIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default BodyMeasurements;
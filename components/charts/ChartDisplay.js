import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';

const ChartDisplay = ({ navigation, charts }) => {
  return (
    <ScrollView horizontal={true} style={styles.metricsScrollContainer} showsHorizontalScrollIndicator={false}>
      {charts.map((chart) => (
        <TouchableOpacity 
          key={chart.id} 
          style={[styles.metricCard, { backgroundColor: chart.backgroundColor }]}
          onPress={chart.onPress}
        >
          <Text style={styles.metricTitle}>{chart.title}</Text>
          <View style={styles.chartWrapper}>
            {chart.component}
          </View>
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
    width: 300,
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    //height: "auto",
    justifyContent: 'space-between',
  },
  metricTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChartDisplay; 
import { View, Text, ScrollView,FlatList ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomCarousel = ({items, renderItem, navigation}) => {


  return (
    
    <FlatList
    data={items}
    renderItem={({ item }) => {return renderItem(item, navigation)}}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={true}
    keyExtractor={(item, index) => index.toString()} // Use a unique key if possible
    style={styles.metricsScrollContainer}
  />
    // {/* <ScrollView style={styles.metricsScrollContainer} showsHorizontalScrollIndicator horizontal>
    //      {items.map((item) => {
        
    //         return renderItem(item, navigation)
    //      })}
  // </ScrollView> */}
  ) 
}

const styles = StyleSheet.create({
    metricsScrollContainer: {
        flexDirection: 'row',
      },
      metricCard: {
        width: 250, // Adjust width as needed for the cards
        borderRadius: 10,
        padding: 15,
        justifyContent: 'space-between',
        marginRight: 10, // Add space between metric cards
      },
      metricValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
      },
      metricLabel: {
        color: '#FFF',
        fontSize: 14,
      },
      metricIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
})

export default CustomCarousel
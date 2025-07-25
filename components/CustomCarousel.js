import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState, useCallback } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomCarousel = ({items = [], renderItem, navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  // If items is undefined or empty, render nothing
  if (!items || items.length === 0) {
    return null;
  }

  // Custom render wrapper to ensure consistent width and alignment
  const renderItemWithWrapper = ({ item }) => (
    <View style={styles.itemWrapper}>
      {renderItem(item, navigation)}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItemWithWrapper}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        style={styles.metricsScrollContainer}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        snapToAlignment="center"
        snapToInterval={260} // Width of card (250) + padding (10)
        decelerationRate="fast"
        scrollEventThrottle={16}
      />
      <View style={styles.indicatorContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  metricsScrollContainer: {
    flexDirection: 'row',
    width: '100%',
    flexGrow: 0, // Prevent taking up extra space
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5, // Small padding between items
    width: 260, // Fixed width for proper scrolling (250 + 10 padding)
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FF6A00',
  },
  metricCard: {
    width: 250,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: 0, // Remove right margin
  },
  metricValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center', // Center the label text
  },
  metricIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default CustomCarousel
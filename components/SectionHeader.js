import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants';

/**
 * Enhanced SectionHeader with accent styling
 */
const SectionHeader = ({ title, childComponent, onSeeAll, showSeeAll = false }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          {/* Accent dot */}
          <View style={styles.accentDot} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        
        {showSeeAll && onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {childComponent && (
        <View style={styles.childStyle}> 
          {childComponent}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.darkOrange,
    marginRight: 10,
  },
  
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  
  childStyle: {
    alignItems: 'center',
  },
  
  seeAllText: {
    color: COLORS.darkOrange,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SectionHeader;

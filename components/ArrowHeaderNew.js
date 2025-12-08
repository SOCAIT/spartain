import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS, SIZES } from '../constants';

/**
 * Enhanced ArrowHeader with modern styling
 */
function ArrowHeaderNew({ navigation, title, paddingTop, rightIcon, onRightIconPress }) {
  return (
    <View style={[styles.header, paddingTop && { paddingTop }]}>
      {/* Back button with glow */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back-ios" size={18} color={COLORS.white} style={styles.backIcon} />
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.headerText} numberOfLines={1}>
        {title}
      </Text>
      
      {/* Right Icon */}
      {rightIcon && onRightIconPress ? (
        <TouchableOpacity 
          style={styles.rightButton} 
          onPress={onRightIconPress}
          activeOpacity={0.7}
        >
          <MaterialIcons name={rightIcon} size={22} color={COLORS.white} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  backButton: {
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusSm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.sm,
  },
  
  backIcon: {
    marginLeft: 4, // Optical alignment for iOS arrow
  },
  
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
    letterSpacing: -0.3,
  },
  
  rightButton: {
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusSm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.sm,
  },
  
  placeholder: {
    width: 40,
    height: 40,
  },
});
  
export default ArrowHeaderNew;

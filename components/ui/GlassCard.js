import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../constants';

/**
 * GlassCard - A modern frosted glass effect card component
 * 
 * @param {object} style - Additional styles to apply
 * @param {ReactNode} children - Content inside the card
 * @param {boolean} accentBorder - Show orange accent border on left
 * @param {boolean} glowEffect - Add subtle orange glow
 * @param {string} variant - 'default' | 'elevated' | 'outlined'
 * @param {function} onPress - Optional press handler
 */
const GlassCard = ({ 
  children, 
  style, 
  accentBorder = false,
  glowEffect = false,
  variant = 'default',
  onPress,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...styles.elevated,
          ...SHADOWS.lg,
        };
      case 'outlined':
        return styles.outlined;
      default:
        return styles.default;
    }
  };

  const content = (
    <>
      {/* Glass overlay effect */}
      <View style={styles.glassOverlay} />
      
      {/* Accent border on left */}
      {accentBorder && <View style={styles.accentBorder} />}
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.container,
          getVariantStyles(),
          glowEffect && styles.glowEffect,
          style,
        ]}
        {...props}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View 
      style={[
        styles.container,
        getVariantStyles(),
        glowEffect && styles.glowEffect,
        style,
      ]}
      {...props}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    position: 'relative',
  },
  
  glassOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderTopRightRadius: SIZES.radiusMd,
    borderBottomRightRadius: SIZES.radiusMd,
  },
  
  default: {
    backgroundColor: COLORS.darkCard,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  
  elevated: {
    backgroundColor: COLORS.darkElevated,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.orangeBorder,
  },
  
  glowEffect: {
    ...SHADOWS.glowSm,
  },
  
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.darkOrange,
    borderTopLeftRadius: SIZES.radiusMd,
    borderBottomLeftRadius: SIZES.radiusMd,
  },
  
  content: {
    padding: SIZES.padding,
  },
});

export default GlassCard;

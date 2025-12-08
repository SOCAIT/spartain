import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

/**
 * Enhanced CustomButton with modern styling and variants
 * 
 * @param {string} name - Button text
 * @param {function} onPress - Press handler
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Take full width
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {object} style - Additional styles
 */
const CustomButton = ({
  name,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 12,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 16,
        };
      default: // md
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 14,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: styles.secondaryButton,
          text: styles.secondaryText,
        };
      case 'outline':
        return {
          button: styles.outlineButton,
          text: styles.outlineText,
        };
      case 'danger':
        return {
          button: styles.dangerButton,
          text: styles.dangerText,
        };
      case 'success':
        return {
          button: styles.successButton,
          text: styles.buttonText,
        };
      default: // primary
        return {
          button: styles.primaryButton,
          text: styles.buttonText,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyles.button,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        variant === 'primary' && !disabled && SHADOWS.glowSm,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? COLORS.white : COLORS.darkOrange} 
          size="small" 
        />
      ) : (
        <Text 
          style={[
            variantStyles.text, 
            { fontSize: sizeStyles.fontSize },
            textStyle,
          ]}
        >
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radiusSm,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  
  fullWidth: {
    alignSelf: 'stretch',
  },
  
  primaryButton: {
    backgroundColor: COLORS.darkOrange,
  },
  
  secondaryButton: {
    backgroundColor: COLORS.darkCard,
    borderWidth: 1,
    borderColor: COLORS.orangeBorder,
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.darkOrange,
  },
  
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  
  successButton: {
    backgroundColor: COLORS.success,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  
  secondaryText: {
    color: COLORS.darkOrange,
    fontWeight: '600',
  },
  
  outlineText: {
    color: COLORS.darkOrange,
    fontWeight: '600',
  },
  
  dangerText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default CustomButton;

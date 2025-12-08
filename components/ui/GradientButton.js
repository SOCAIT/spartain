import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../constants';

/**
 * GradientButton - A modern button with glow effect
 * 
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Take full width
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {ReactNode} leftIcon - Icon on left
 * @param {ReactNode} rightIcon - Icon on right
 * @param {boolean} glow - Add glow effect
 */
const GradientButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  glow = true,
  style,
  textStyle,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: SIZES.body5,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: SIZES.body2,
        };
      default: // md
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: SIZES.body3,
        };
    }
  };

  const sizeStyles = getSizeStyles();

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
      case 'ghost':
        return {
          button: styles.ghostButton,
          text: styles.ghostText,
        };
      default: // primary
        return {
          button: styles.primaryButton,
          text: styles.buttonText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.buttonBase,
        variantStyles.button,
        { 
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        glow && variant === 'primary' && !disabled && SHADOWS.glowSm,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? COLORS.white : COLORS.darkOrange} 
          size="small" 
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text 
            style={[
              variantStyles.text, 
              { fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
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
  
  ghostButton: {
    backgroundColor: 'transparent',
  },
  
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconLeft: {
    marginRight: 8,
  },
  
  iconRight: {
    marginLeft: 8,
  },
  
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  secondaryText: {
    color: COLORS.darkOrange,
    fontWeight: '600',
  },
  
  outlineText: {
    color: COLORS.darkOrange,
    fontWeight: '600',
  },
  
  ghostText: {
    color: COLORS.darkOrange,
    fontWeight: '600',
  },
  
  disabled: {
    opacity: 0.5,
  },
});

export default GradientButton;

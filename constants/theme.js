import { Dimensions, Platform } from "react-native";
const {width, height} = Dimensions.get("window");

export const COLORS = {
  // ========================================
  // CORE DARK PALETTE - Layered depth system
  // ========================================
  dark: '#1C1C1E',              // Main background (original iOS dark)
  darkCard: '#252528',          // Card backgrounds
  darkElevated: '#2E2E32',      // Elevated surfaces
  darkMuted: '#38383D',         // Muted/secondary backgrounds
  darkBorder: '#3A3A3F',        // Subtle borders
  
  // Legacy support (keep for compatibility)
  primary: "#1E1F20",
  secondary: "#ffffff",
  lightDark: "#252a2e",
  
  // ========================================
  // ORANGE SPECTRUM - Brand accent with depth
  // ========================================
  darkOrange: "#FF6A00",        // Primary brand orange
  orange: '#FF6A00',            // Alias
  orangeLight: '#FF8533',       // Hover/highlight states
  orangeBright: '#FF9A4D',      // Emphasis
  orangeDark: '#E55A00',        // Pressed states
  orangeDeep: '#CC4D00',        // Deep accent
  
  // Orange effects
  orangeGlow: 'rgba(255, 106, 0, 0.25)',
  orangeGlowStrong: 'rgba(255, 106, 0, 0.4)',
  orangeBorder: 'rgba(255, 106, 0, 0.3)',
  orangeMuted: 'rgba(255, 106, 0, 0.12)',
  orangeOverlay: 'rgba(255, 106, 0, 0.08)',
  
  // ========================================
  // TEXT COLORS - Clear hierarchy
  // ========================================
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textDisabled: '#52525B',
  cream: '#FFF5EB',             // Warm off-white for contrast
  
  // Legacy
  black: '#1E1F20',
  white: '#FFFFFF',
  
  // ========================================
  // GRAYS - Utility colors
  // ========================================
  lightGray: "#F5F5F6",
  lightGray2: "#F6F6F7",
  lightGray3: "#EFEFF1",
  lightGray4: "#F8F8F9",
  lightGray5: "#a9a9a9",
  transparent: "transparent",
  darkgray: "#898C95",
  placeholder: "#6B7280",
  
  // ========================================
  // SEMANTIC COLORS
  // ========================================
  success: "#22C55E",
  successMuted: "rgba(34, 197, 94, 0.15)",
  error: "#EF4444",
  errorMuted: "rgba(239, 68, 68, 0.15)",
  warning: "#F59E0B",
  warningMuted: "rgba(245, 158, 11, 0.15)",
  info: "#3B82F6",
  infoMuted: "rgba(59, 130, 246, 0.15)",
  
  // Legacy semantic
  red: "#EF4444",
  green: "#22C55E",
  greenPrimary: "#22C55E",
  darkRed: "#410f8e",
  
  // ========================================
  // HEALTH DASHBOARD COLORS
  // ========================================
  purple: "#A855F7",
  purpleMuted: "rgba(168, 85, 247, 0.15)",
  teal: "#14B8A6",
  tealMuted: "rgba(20, 184, 166, 0.15)",
  blue: "#3B82F6",
  lightBlue: "#0EA5E9",
  cyan: "#06B6D4",
  darkBlue: "#1D4ED8",
  
  // ========================================
  // GLASS EFFECT COLORS
  // ========================================
  glassBg: 'rgba(37, 37, 40, 0.8)',
  glassLight: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
};

// ========================================
// GRADIENTS - Pre-defined gradient arrays
// ========================================
export const GRADIENTS = {
  // Orange gradients
  orangePrimary: ['#FF8533', '#FF6A00'],
  orangeIntense: ['#FF9A4D', '#E55A00'],
  orangeSubtle: ['rgba(255, 106, 0, 0.2)', 'rgba(255, 106, 0, 0.05)'],
  
  // Dark gradients
  darkCard: ['#2E2E32', '#252528'],
  darkBackground: ['#1C1C1E', '#252528'],
  darkOverlay: ['rgba(28, 28, 30, 0.9)', 'rgba(28, 28, 30, 0.7)'],
  
  // Glass effect
  glass: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'],
};

// ========================================
// SPACING - 8px grid system
// ========================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ========================================
// SIZES
// ========================================
export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,           // Standardized radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
  padding: 16,
  padding2: 12,
  
  // Font sizes - Type scale
  largeTitle: 48,
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 15,
  body3: 14,
  body4: 13,
  body5: 12,
  caption: 11,
  tiny: 10,
  
  // App dimensions
  width,
  height
};

// ========================================
// TYPOGRAPHY - Modern font system
// ========================================
export const FONTS = {
  // Display - Bold headlines
  displayLarge: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.largeTitle,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: -1,
  },
  displayMedium: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.h1,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  
  // Headlines
  h1: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.h1,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.h2,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.h3,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.h4,
    fontWeight: '600',
    lineHeight: 24,
  },
  h5: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.h5,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.body1,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.body3,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.body5,
    fontWeight: '400',
    lineHeight: 18,
  },
  
  // Labels & Buttons
  labelLarge: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.body3,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.body5,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.caption,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Caption
  caption: {
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    fontSize: SIZES.caption,
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Legacy support
  largeTitle: { fontFamily: "System", fontSize: SIZES.largeTitle, lineHeight: 56, fontWeight: '700' },
  body1: { fontFamily: "System", fontSize: SIZES.body1, lineHeight: 24 },
  body2: { fontFamily: "System", fontSize: SIZES.body2, lineHeight: 22 },
  body3: { fontFamily: "System", fontSize: SIZES.body3, lineHeight: 20 },
  body4: { fontFamily: "System", fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontFamily: "System", fontSize: SIZES.body5, lineHeight: 18 },
};

// ========================================
// SHADOWS - Elevation system
// ========================================
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  // Orange glow shadow
  glow: {
    shadowColor: COLORS.darkOrange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  glowSm: {
    shadowColor: COLORS.darkOrange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
};

// ========================================
// ANIMATION CONFIGS
// ========================================
export const ANIMATIONS = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 180,
    mass: 0.8,
  },
  timing: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
};

const appTheme = { COLORS, SIZES, FONTS, GRADIENTS, SPACING, SHADOWS, ANIMATIONS };

export default appTheme;

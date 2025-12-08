import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, SIZES } from '../../constants';

/**
 * NutritionCard - Displays nutrition information with option to add to daily log
 * 
 * @param {object} nutritionData - { calories, protein/proteins, carbs, fat/fats, name? }
 * @param {function} onAdd - Callback when user taps add button
 */
const NutritionCard = ({ nutritionData, onAdd }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  if (!nutritionData) return null;

  // Normalize data keys
  const calories = parseFloat(nutritionData.calories) || 0;
  const protein = parseFloat(nutritionData.protein || nutritionData.proteins) || 0;
  const carbs = parseFloat(nutritionData.carbs) || 0;
  const fats = parseFloat(nutritionData.fat || nutritionData.fats) || 0;
  const name = nutritionData.name || 'Meal';

  const handleAdd = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    setIsAdded(true);
    onAdd && onAdd(nutritionData);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="food-apple" size={18} color={COLORS.darkOrange} />
          </View>
          <View>
            <Text style={styles.title} numberOfLines={1}>{name}</Text>
            <Text style={styles.subtitle}>Nutrition Info</Text>
          </View>
        </View>
        <View style={styles.caloriesBadge}>
          <MaterialIcons name="local-fire-department" size={14} color={COLORS.orangeLight} />
          <Text style={styles.caloriesText}>{Math.round(calories)}</Text>
          <Text style={styles.caloriesUnit}>kcal</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Macros Grid */}
      <View style={styles.macrosGrid}>
        <MacroItem 
          icon="grain" 
          label="Carbs" 
          value={carbs} 
          color={COLORS.info}
        />
        <MacroItem 
          icon="fitness-center" 
          label="Protein" 
          value={protein} 
          color={COLORS.success}
        />
        <MacroItem 
          icon="opacity" 
          label="Fats" 
          value={fats} 
          color={COLORS.warning}
        />
      </View>

      {/* Add Button */}
      <TouchableOpacity 
        style={[styles.addButton, isAdded && styles.addedButton]}
        onPress={handleAdd}
        activeOpacity={0.8}
        disabled={isAdded}
      >
        <MaterialIcons 
          name={isAdded ? "check-circle" : "add-circle-outline"} 
          size={18} 
          color={isAdded ? COLORS.success : COLORS.white} 
        />
        <Text style={[styles.addButtonText, isAdded && styles.addedButtonText]}>
          {isAdded ? 'Added to Daily Log' : 'Add to Daily Log'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * MacroItem - Individual macro nutrient display
 */
const MacroItem = ({ icon, label, value, color }) => (
  <View style={styles.macroItem}>
    <View style={[styles.macroIconContainer, { backgroundColor: `${color}20` }]}>
      <MaterialIcons name={icon} size={16} color={color} />
    </View>
    <Text style={styles.macroValue}>{Math.round(value)}g</Text>
    <Text style={styles.macroLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.orangeMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    maxWidth: 140,
  },

  subtitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },

  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orangeMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  caloriesText: {
    color: COLORS.orangeLight,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
  },

  caloriesUnit: {
    color: COLORS.orangeLight,
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.darkBorder,
    marginVertical: 14,
  },

  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  macroItem: {
    alignItems: 'center',
    flex: 1,
  },

  macroIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  macroValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  macroLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 12,
    borderRadius: SIZES.radiusSm,
    ...SHADOWS.glowSm,
  },

  addedButton: {
    backgroundColor: COLORS.successMuted,
    ...SHADOWS.none,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  addedButtonText: {
    color: COLORS.success,
  },
});

export default NutritionCard;


import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, SIZES } from '../../../constants';

const MealCardOverlay = ({ meal, navigation, onAddMeal }) => {
  // Extract meal data
  const mealData = meal?.meal || {};
  const mealName = mealData.name || 'Meal';
  
  // Get quantity - if 0 or undefined, treat as 1
  const quantity = meal?.quantity && meal.quantity > 0 ? meal.quantity : 1;
  
  const viewMeal = () => {
    navigation.navigate("MealView", { meal: meal.meal, quantity });
  };
  
  // Multiply nutrition values by quantity
  const baseCalories = parseFloat(mealData.calories) || 0;
  const baseProtein = parseFloat(mealData.proteins) || 0;
  const baseCarbs = parseFloat(mealData.carbs) || 0;
  const baseFats = parseFloat(mealData.fats) || 0;
  
  const calories = baseCalories * quantity;
  const protein = baseProtein * quantity;
  const carbs = baseCarbs * quantity;
  const fats = baseFats * quantity;

  // Truncate name if too long
  const displayName = mealName.length > 28 ? mealName.slice(0, 25).trim() + '...' : mealName;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={viewMeal}
      activeOpacity={0.85}
    >
      {/* Left accent border */}
      <View style={styles.accentBorder} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Header with icon and title */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="food" size={16} color={COLORS.darkOrange} />
            {quantity > 1 && (
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>x{quantity}</Text>
              </View>
            )}
          </View>
          <Text style={styles.mealTitle} numberOfLines={2} ellipsizeMode="tail">
            {displayName}
          </Text>
        </View>
        
        {/* Calorie Badge */}
        <View style={styles.calorieBadge}>
          <MaterialIcons name="local-fire-department" size={14} color={COLORS.orangeLight} />
          <Text style={styles.calorieText}>{Math.round(calories)}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>
        
        {/* Macros Row */}
        <View style={styles.macrosRow}>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.macroValue}>{Math.round(protein)}g</Text>
            <Text style={styles.macroLabel}> P</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: COLORS.info }]} />
            <Text style={styles.macroValue}>{Math.round(carbs)}g</Text>
            <Text style={styles.macroLabel}> C</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.macroValue}>{Math.round(fats)}g</Text>
            <Text style={styles.macroLabel}> F</Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={(e) => {
              e.stopPropagation();
              onAddMeal && onAddMeal(mealData);
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={18} color={COLORS.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.viewButton} 
            onPress={(e) => {
              e.stopPropagation();
              viewMeal();
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chevron-right" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: 165,
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusMd,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    position: 'relative',
    ...SHADOWS.md,
  },
  
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.darkOrange,
    zIndex: 1,
  },
  
  content: {
    flex: 1,
    padding: 12,
    paddingLeft: 16,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: COLORS.orangeMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  
  quantityBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: COLORS.darkOrange,
    borderRadius: 8,
    minWidth: 18,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  
  quantityText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  
  mealTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orangeMuted,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  
  calorieText: {
    color: COLORS.orangeLight,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  
  calorieUnit: {
    color: COLORS.orangeLight,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
  },
  
  macroValue: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  
  macroLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  
  addButton: {
    backgroundColor: COLORS.darkOrange,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowSm,
  },
  
  viewButton: {
    backgroundColor: COLORS.darkMuted,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MealCardOverlay;

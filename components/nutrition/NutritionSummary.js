import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../constants';
import CircularProgress from '../charts/CircularProgress';
import InfoIcon from '../InfoIcon';

/**
 * Enhanced NutritionSummary with modern glass effect design
 */
const NutritionSummary = ({ currentNutrition, targetNutrition, navigation, onReset }) => {
  // Calculate percentage (floor percentage, or 0 if no target)
  const getPercentage = (current, target) => {
    if (target > 0) {
      const pct = Math.floor((Number(current) / Number(target)) * 100);
      return pct > 100 ? 100 : pct;
    }
    return 0;
  };

  // Format macro values to a single decimal place for display
  const formatValue = (value) => {
    const numeric = Number(value);
    if (!isFinite(numeric)) return '0';
    return Math.round(numeric).toString();
  };

  const caloriePercentage = getPercentage(currentNutrition.calories, targetNutrition.calories);

  return (
    <View style={styles.container}>
      {/* Card with glass effect */}
      <View style={styles.card}>
        {/* Accent border */}
        <View style={styles.accentBorder} />
        
        {/* Glass overlay */}
        <View style={styles.glassOverlay} />
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Daily Nutrition</Text>
            <Text style={styles.subtitle}>Track your macros</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NutritionInput')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>+ Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={onReset}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, styles.resetButtonText]}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Calorie Display */}
        <View style={styles.calorieSection}>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieValue}>
              {formatValue(currentNutrition.calories)}
            </Text>
            <Text style={styles.calorieTarget}>
              / {formatValue(targetNutrition.calories)} kcal
            </Text>
            <InfoIcon type="calories" size={14} />
          </View>
          
          <View style={styles.progressContainer}>
            <CircularProgress
              percentage={caloriePercentage}
              size={60}
              strokeWidth={5}
              color={COLORS.darkOrange}
            />
          </View>
        </View>

        {/* Macro Cards */}
        <View style={styles.macrosContainer}>
          {/* Protein */}
          <MacroCard
            label="Protein"
            current={currentNutrition.proteins}
            target={targetNutrition.proteins}
            color={COLORS.success}
            formatValue={formatValue}
            getPercentage={getPercentage}
          />
          
          {/* Carbs */}
          <MacroCard
            label="Carbs"
            current={currentNutrition.carbs}
            target={targetNutrition.carbs}
            color={COLORS.info}
            formatValue={formatValue}
            getPercentage={getPercentage}
          />
          
          {/* Fats */}
          <MacroCard
            label="Fats"
            current={currentNutrition.fats}
            target={targetNutrition.fats}
            color={COLORS.warning}
            formatValue={formatValue}
            getPercentage={getPercentage}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * MacroCard - Individual macro nutrient display
 */
const MacroCard = ({ label, current, target, color, formatValue, getPercentage }) => {
  const percentage = getPercentage(current, target);
  
  return (
    <View style={styles.macroCard}>
      <View style={styles.macroHeader}>
        <View style={[styles.macroIndicator, { backgroundColor: color }]} />
        <Text style={styles.macroLabel}>{label}</Text>
      </View>
      
      <Text style={styles.macroValue}>
        {formatValue(current)}
        <Text style={styles.macroTarget}>/{formatValue(target)}g</Text>
      </Text>
      
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: color,
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.md,
  },
  
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.darkOrange,
  },
  
  glassOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  actionButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
    ...SHADOWS.glowSm,
  },
  
  actionButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.error,
    ...SHADOWS.none,
  },
  
  resetButtonText: {
    color: COLORS.error,
  },
  
  calorieSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkBorder,
  },
  
  calorieInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  
  calorieValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -1,
  },
  
  calorieTarget: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  
  progressContainer: {
    ...SHADOWS.glowSm,
  },
  
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  
  macroCard: {
    flex: 1,
    backgroundColor: COLORS.darkElevated,
    borderRadius: SIZES.radiusSm,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  macroIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  
  macroLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  
  macroTarget: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  
  progressBar: {
    height: 4,
    backgroundColor: COLORS.darkBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default NutritionSummary;

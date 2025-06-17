import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import CircularProgress from '../charts/CircularProgress';
import InfoIcon from '../InfoIcon';

const NutritionSummary = ({ currentNutrition, targetNutrition, navigation }) => {
  // Calculate percentage (floor percentage, or 0 if no target)
  const getPercentage = (current, target) => {
    if (target > 0) {
      return Math.floor((current / target) * 100);
    }
    return 0;
  };

  return (
    <View style={styles.nutritionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.nutritionSummaryTitle}>Daily Nutrition Info</Text>
        {/* Button to navigate to the screen for adding a meal */}
        <TouchableOpacity 
          style={styles.updateNutritionButton} 
          onPress={() => navigation.navigate('NutritionInput')}
        >
          <Text style={styles.updatedNutritionButtonText}>update info</Text>
        </TouchableOpacity>
      </View>

      {/* Main Summary for Calories */}
      <View style={styles.nutritionSummary}>
        <View style={styles.nutritionTextContainer}>
          <View style={styles.valueWithIcon}>
            <Text style={styles.nutritionValue}>
              {currentNutrition.calories} / {targetNutrition.calories}
            </Text>
            <InfoIcon type="calories" size={14} />
          </View>
          <Text style={styles.nutritionLabel}>CALORIES (kcal)</Text>
        </View>
        <CircularProgress
            percentage={getPercentage(
                currentNutrition.calories,
                targetNutrition.calories
            )}
            size={50}
            strokeWidth={4}
            color={COLORS.darkOrange}
        />
      </View>

      {/* Details for Carbs, Proteins, Fats */}
      <View style={styles.nutritionDetails}>
        {/* Carbs */}
        <View style={styles.nutritionDetailItem}>
          <View style={styles.nutritionDetailText}>
            <View style={styles.valueWithIcon}>
              <Text style={styles.nutritionDetailValue}>
                {currentNutrition.carbs} / {targetNutrition.carbs}
              </Text>
              <InfoIcon type="macronutrients" size={12} />
            </View>
            <Text style={styles.nutritionDetailLabel}>Carbs (g)</Text>
          </View>
          <CircularProgress
            percentage={getPercentage(
                currentNutrition.carbs,
                targetNutrition.carbs
            )}
            size={35}
            strokeWidth={3}
            color={COLORS.darkOrange}
            />
        </View>
        {/* Proteins */}
        <View style={styles.nutritionDetailItem}>
          <View style={styles.nutritionDetailText}>
            <View style={styles.valueWithIcon}>
              <Text style={styles.nutritionDetailValue}>
                {currentNutrition.proteins} / {targetNutrition.proteins} 
              </Text>
              <InfoIcon type="macronutrients" size={12} />
            </View>
            <Text style={styles.nutritionDetailLabel}>Protein g</Text>
          </View>
          <CircularProgress
            percentage={getPercentage(
                currentNutrition.proteins,
                targetNutrition.proteins
            )}
            size={35}
            strokeWidth={3}
            color={COLORS.darkOrange}
            />
        </View>
        {/* Fats */}
        <View style={styles.nutritionDetailItem}>
          <View style={styles.nutritionDetailText}>
            <View style={styles.valueWithIcon}>
              <Text style={styles.nutritionDetailValue}>
                {currentNutrition.fats} / {targetNutrition.fats} 
              </Text>
              <InfoIcon type="macronutrients" size={12} />
            </View>
            <Text style={styles.nutritionDetailLabel}>Fats (g)</Text>
          </View>
          <CircularProgress
            percentage={getPercentage(
                currentNutrition.fats,
                targetNutrition.fats
            )}
            size={35}
            strokeWidth={3}
            color={COLORS.darkOrange} 
            />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    nutritionContainer: {
        backgroundColor: COLORS.lightDark,
        paddingHorizontal: 5,
        paddingVertical: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
 
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  nutritionSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  updateNutritionButton: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updatedNutritionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  nutritionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  nutritionTextContainer: {
    flexDirection: 'column',
  },
  valueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#777',
  },
  percentageCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    backgroundColor: 'transparent', // optional
  },
  percentageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nutritionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
  },
  nutritionDetailText: {
    flex: 1,
  },
  nutritionDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  nutritionDetailLabel: {
    fontSize: 12,
    color: '#777',
  },
  percentageCircleSmall: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: COLORS.darkOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 2,
    backgroundColor: 'transparent', // optional
  },
  percentageTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
});

export default NutritionSummary;
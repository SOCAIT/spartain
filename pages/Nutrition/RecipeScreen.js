import React, { useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Modal } from 'react-native';
import InstructionsModal from '../../components/modals/InstructionModal';
import { COLORS } from '../../constants';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const RecipeScreen = ({navigation, route}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);

  const { meal, quantity: passedQuantity } = route.params;
  
  // Get quantity - if 0 or undefined, treat as 1
  const quantity = passedQuantity && passedQuantity > 0 ? passedQuantity : 1;

  console.log(meal, 'Quantity:', quantity);

  const addMealToDiary = async () => {
    try {
      // Multiply by quantity for total intake
      const macros = {
        calories: (parseFloat(meal.calories) || 0) * quantity,
        carbs: (parseFloat(meal.carbs) || 0) * quantity,
        proteins: (parseFloat(meal.proteins) || 0) * quantity,
        fats: (parseFloat(meal.fats) || 0) * quantity,
      };

      const todayStr = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem('@currentNutrition');
      let base = { calories: 0, carbs: 0, proteins: 0, fats: 0 };

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayStr) {
          base = parsed.nutrition;
        }
      }

      const updated = {
        calories: base.calories + macros.calories,
        carbs: base.carbs + macros.carbs,
        proteins: base.proteins + macros.proteins,
        fats: base.fats + macros.fats,
      };

      await AsyncStorage.setItem(
        '@currentNutrition',
        JSON.stringify({ date: todayStr, nutrition: updated }),
      );

      // Navigate back to NutritionPlan with update so it can increment its local state
      navigation.navigate('NutritionPlan', { updatedNutrition: macros });
      Alert.alert('Added', 'Meal added to today\'s nutrition diary!');
    } catch (err) {
      console.error('Error adding meal to diary', err);
      Alert.alert('Error', 'Could not add meal to diary.');
    }
  };

  const ingredientsList = useMemo(() => {
    if (Array.isArray(meal?.ingredients) && meal.ingredients.length > 0) {
      return meal.ingredients.filter(Boolean);
    }
    if (typeof meal?.ingredients === 'string' && meal.ingredients.trim().length > 0) {
      return meal.ingredients
        .split(/[\n,]/)
        .map(item => item.replace(/^[•\-]\s*/, '').trim())
        .filter(Boolean);
    }
    if (typeof meal?.recipe === 'string' && meal.recipe.toLowerCase().includes('ingredients')) {
      const parts = meal.recipe.split(/ingredients:/i);
      if (parts.length > 1) {
        return parts[1]
          .split(/[\n,]/)
          .map(item => item.replace(/^[•\-]\s*/, '').trim())
          .filter(Boolean);
      }
    }
    if (typeof meal?.recipe === 'string' && meal.recipe.trim().length > 0) {
      return [meal.recipe.trim()];
    }
    return [];
  }, [meal]);


  // Base (per serving) values
  const baseCalories = parseFloat(meal.calories) || 0;
  const baseCarbs = parseFloat(meal.carbs) || 0;
  const baseProteins = parseFloat(meal.proteins) || 0;
  const baseFats = parseFloat(meal.fats) || 0;
  
  // Total values (multiplied by quantity)
  const totalCalories = Math.round(baseCalories * quantity);
  const totalCarbs = Math.round(baseCarbs * quantity);
  const totalProteins = Math.round(baseProteins * quantity);
  const totalFats = Math.round(baseFats * quantity);

  const macros = [
    { label: 'Carbs', value: `${Math.round(baseCarbs)} g`, total: `${totalCarbs} g` },
    { label: 'Proteins', value: `${Math.round(baseProteins)} g`, total: `${totalProteins} g` },
    { label: 'Fats', value: `${Math.round(baseFats)} g`, total: `${totalFats} g` },
    { label: 'Calories', value: `${Math.round(baseCalories)} kcal`, total: `${totalCalories} kcal` },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ArrowHeaderNew navigation={navigation} title={meal.name} />
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Meal Spotlight</Text>
          </View>
          <View style={styles.calorieContainer}>
            {quantity > 1 && (
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>x{quantity}</Text>
              </View>
            )}
            <Text style={styles.calorieText}>{totalCalories} kcal</Text>
          </View>
        </View>
        <Text style={styles.title}>{meal.name}</Text>
        {!!meal.description && <Text style={styles.description}>{meal.description}</Text>}
        {quantity > 1 && (
          <Text style={styles.perServingNote}>
            {Math.round(baseCalories)} kcal per serving
          </Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Directions</Text>
          <Text style={styles.sectionSubtitle}>
            {ingredientsList.length > 0 ? `${ingredientsList.length} ingredients` : 'Prep guidance'}
          </Text>
        </View>
        <Text style={styles.sectionBody}>
          View the full list of ingredients or step-by-step cooking instructions, then log this meal to your diary.
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.secondaryButtonText}>View Steps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setIngredientsModalVisible(true)}
            disabled={ingredientsList.length === 0}
          >
            <Text style={[styles.secondaryButtonText, ingredientsList.length === 0 && styles.disabledText]}>
              Ingredients
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.primaryButton, styles.addButton]} onPress={addMealToDiary}>
          <Text style={styles.buttonText}>
            {quantity > 1 ? `Add ${quantity} Servings` : 'Add Intake'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total Macros (when quantity > 1) */}
      {quantity > 1 && (
        <View style={[styles.sectionCard, styles.totalCard]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Total Intake</Text>
            <Text style={styles.sectionSubtitle}>{quantity} servings</Text>
          </View>
          <View style={styles.macroGrid}>
            {macros.map(({ label, total }) => (
              <View key={`total-${label}`} style={[styles.macroItem, styles.totalMacroItem]}>
                <Text style={[styles.macroValue, styles.totalMacroValue]}>{total}</Text>
                <Text style={styles.macroLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Per Serving Macros */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Macros</Text>
          <Text style={styles.sectionSubtitle}>per serving</Text>
        </View>
        <View style={styles.macroGrid}>
          {macros.map(({ label, value }) => (
            <View key={label} style={styles.macroItem}>
              <Text style={styles.macroValue}>{value}</Text>
              <Text style={styles.macroLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {ingredientsList.length > 0 && (
        <Modal visible={ingredientsModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Ingredients</Text>
              <ScrollView style={styles.modalScroll}>
                {ingredientsList.map((item, index) => (
                  <View key={`${item}-${index}`} style={styles.ingredientRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.ingredientText}>{item}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIngredientsModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <InstructionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        instructions={
          '' + (meal.steps === ''
            ? "No steps provided. Ask the SyntraFit Hermes to provide you with the recipe or even a Youtube video :) |Try this prompt: Give me the instructions (or find me a Youtube video) to make " + meal.name + " recipe"
            : meal.steps)
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.dark,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: COLORS.lightDark,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 106, 0, 0.14)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.35)',
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityBadge: {
    backgroundColor: COLORS.darkOrange,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  quantityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  calorieText: {
    color: COLORS.darkOrange,
    fontSize: 18,
    fontWeight: '700',
  },
  perServingNote: {
    color: COLORS.lightGray5,
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: COLORS.lightGray3,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2f3133',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: COLORS.lightGray5,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  totalCard: {
    borderColor: COLORS.darkOrange,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 106, 0, 0.08)',
  },
  macroItem: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#383838',
    marginBottom: 12,
  },
  totalMacroItem: {
    backgroundColor: 'rgba(255, 106, 0, 0.12)',
    borderColor: 'rgba(255, 106, 0, 0.3)',
  },
  macroValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  totalMacroValue: {
    color: COLORS.darkOrange,
  },
  macroLabel: {
    color: '#a9a9a9',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 10,
  },
  ingredientText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionBody: {
    color: COLORS.lightGray5,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: COLORS.darkOrange,
    borderWidth: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3c3c3c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#1f1f1f',
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  disabledText: {
    color: COLORS.darkgray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: COLORS.lightDark,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: COLORS.darkOrange,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecipeScreen;

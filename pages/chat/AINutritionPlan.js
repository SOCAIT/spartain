import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image, Modal, Platform } from 'react-native';
import ArrowHeaderNew from '../../components/ArrowHeaderNew';

const dummyNutritionPlan = {
  days: [
    {
      day: 0,
      meals: [
        {
          name: "Oatmeal with Protein Powder",
          recipe: "Mix 1 cup of oats with water, add a scoop of protein powder, and top with berries.",
          description: "High-protein oatmeal breakfast.",
          calories: 600,
          proteins: 30,
          carbs: 60,
          fats: 15,
          sequence: 1,
          day: "mon",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Oatmeal"
        },
        {
          name: "Chicken Quinoa Salad",
          recipe: "Combine grilled chicken breast, cooked quinoa, mixed greens, avocado, cucumber, and a vinaigrette dressing.",
          description: "Light and nutritious salad for lunch.",
          calories: 700,
          proteins: 40,
          carbs: 70,
          fats: 20,
          sequence: 2,
          day: "mon",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Salad"
        },
        {
          name: "Protein Shake",
          recipe: "Blend a scoop of protein powder with almond milk, a banana, and a tablespoon of peanut butter.",
          description: "Post-workout protein shake.",
          calories: 500,
          proteins: 35,
          carbs: 40,
          fats: 15,
          sequence: 3,
          day: "mon",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Shake"
        },
        {
          name: "Steak with Sweet Potatoes",
          recipe: "Grill a lean steak and serve with baked sweet potatoes and steamed broccoli.",
          description: "Hearty dinner for muscle repair.",
          calories: 800,
          proteins: 60,
          carbs: 60,
          fats: 25,
          sequence: 4,
          day: "mon",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Steak"
        }
      ]
    },
    {
      day: 1,
      meals: [
        {
          name: "Greek Yogurt Parfait",
          recipe: "Layer Greek yogurt with granola, mixed berries, and a drizzle of honey.",
          description: "Protein-rich breakfast parfait.",
          calories: 550,
          proteins: 25,
          carbs: 50,
          fats: 20,
          sequence: 1,
          day: "tue",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Parfait"
        },
        {
          name: "Turkey Wrap",
          recipe: "Whole wheat wrap with turkey breast, avocado, spinach, and hummus.",
          description: "Balanced lunch wrap.",
          calories: 650,
          proteins: 35,
          carbs: 55,
          fats: 25,
          sequence: 2,
          day: "tue",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Wrap"
        },
        {
          name: "Salmon with Quinoa",
          recipe: "Grilled salmon fillet with quinoa and roasted vegetables.",
          description: "Omega-3 rich dinner.",
          calories: 750,
          proteins: 45,
          carbs: 65,
          fats: 30,
          sequence: 3,
          day: "tue",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Salmon"
        },
        {
          name: "Protein Bar",
          recipe: "High-protein bar with nuts and dark chocolate.",
          description: "Convenient protein snack.",
          calories: 300,
          proteins: 20,
          carbs: 25,
          fats: 15,
          sequence: 4,
          day: "tue",
          image: "https://placehold.co/200x200/FF6A00/FFFFFF?text=Bar"
        }
      ]
    }
  ]
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AINutritionPlanScreen({ navigation }) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const generateNewPlan = () => {
    setLoading(true);
    setTimeout(() => {
      setNutritionPlan(dummyNutritionPlan);
      setLoading(false);
    }, 1500);
  };

  const savePlan = () => {
    navigation.goBack();
  };

  const openMealModal = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const renderMeal = (meal) => (
    <TouchableOpacity 
      style={styles.mealContainer}
      onPress={() => openMealModal(meal)}
    >
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealDescription}>{meal.description}</Text>
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.calories}</Text>
            <Text style={styles.macroLabel}>cal</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.proteins}g</Text>
            <Text style={styles.macroLabel}>protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.carbs}g</Text>
            <Text style={styles.macroLabel}>carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.fats}g</Text>
            <Text style={styles.macroLabel}>fats</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ArrowHeaderNew navigation={navigation} title="AI Nutrition Plan" />
      
      {!nutritionPlan && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Get a personalized nutrition plan generated by AI
          </Text>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateNewPlan}
          >
            <Text style={styles.generateButtonText}>Generate Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6A00" />
          <Text style={styles.loadingText}>Generating your plan...</Text>
        </View>
      )}

      {nutritionPlan && !loading && (
        <ScrollView style={styles.planContainer}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.regenerateButton]}
              onPress={generateNewPlan}
            >
              <Text style={styles.actionButtonText}>Generate New Plan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={savePlan}
            >
              <Text style={styles.actionButtonText}>Save Plan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aiDescriptionContainer}>
            <Text style={styles.aiDescriptionText}>
              The SyntraFit AI model has analyzed your dietary preferences and goals to create a personalized nutrition plan. This plan is designed to help you achieve optimal results while maintaining a balanced and enjoyable diet.
            </Text>
          </View>

          {nutritionPlan.days.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{daysOfWeek[day.day]}</Text>
              {day.meals.map((meal, mealIndex) => (
                renderMeal(meal)
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMeal?.name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalMealInfo}>
                <Text style={styles.modalDescription}>{selectedMeal?.description}</Text>
                <Text style={styles.modalRecipeTitle}>Recipe:</Text>
                <Text style={styles.modalRecipe}>{selectedMeal?.recipe}</Text>
                <View style={styles.modalMacrosContainer}>
                  <View style={styles.modalMacroItem}>
                    <Text style={styles.modalMacroValue}>{selectedMeal?.calories}</Text>
                    <Text style={styles.modalMacroLabel}>calories</Text>
                  </View>
                  <View style={styles.modalMacroItem}>
                    <Text style={styles.modalMacroValue}>{selectedMeal?.proteins}g</Text>
                    <Text style={styles.modalMacroLabel}>protein</Text>
                  </View>
                  <View style={styles.modalMacroItem}>
                    <Text style={styles.modalMacroValue}>{selectedMeal?.carbs}g</Text>
                    <Text style={styles.modalMacroLabel}>carbs</Text>
                  </View>
                  <View style={styles.modalMacroItem}>
                    <Text style={styles.modalMacroValue}>{selectedMeal?.fats}g</Text>
                    <Text style={styles.modalMacroLabel}>fats</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#FF6A00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  planContainer: {
    flex: 1,
    padding: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  regenerateButton: {
    backgroundColor: '#2C2C2E',
  },
  saveButton: {
    backgroundColor: '#FF6A00',
  },
  actionButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiDescriptionContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  aiDescriptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  dayContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dayTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealContainer: {
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealDescription: {
    color: '#FF6A00',
    fontSize: 14,
    marginTop: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroLabel: {
    color: '#FF6A00',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalMealInfo: {
    padding: 10,
  },
  modalDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 15,
  },
  modalRecipeTitle: {
    color: '#FF6A00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalRecipe: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalMacrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalMacroItem: {
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  modalMacroValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalMacroLabel: {
    color: '#FF6A00',
    fontSize: 12,
  },
});

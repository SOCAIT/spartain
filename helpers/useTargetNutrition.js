import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Custom hook to ensure target_nutrition_data is always properly formatted
export const useTargetNutrition = () => {
  const { authState } = useContext(AuthContext);
  
  // Default target nutrition data with zero values
  const defaultTargetNutrition = {
    target_calories: 0,
    target_carbs: 0,
    target_protein: 0,
    target_fats: 0
  };

  // Ensure target_nutrition_data is never null/undefined and has all required fields
  const targetNutritionData = authState.target_nutrition_data || defaultTargetNutrition;
  
  // Double-check each field to ensure no null/undefined values
  const safeTargetNutrition = {
    target_calories: targetNutritionData.target_calories || 0,
    target_carbs: targetNutritionData.target_carbs || 0,
    target_protein: targetNutritionData.target_protein || 0,
    target_fats: targetNutritionData.target_fats || 0
  };

  return safeTargetNutrition;
};

// Helper function that can be used in components that need the converted format
export const getTargetNutrition = (targetNutritionObj) => {
  // Provide defaults if the object is null/undefined
  const safeObj = targetNutritionObj || {
    target_calories: 0,
    target_carbs: 0,
    target_protein: 0,
    target_fats: 0
  };

  return {
    calories: safeObj.target_calories || 0,
    carbs: safeObj.target_carbs || 0,
    proteins: safeObj.target_protein || 0,
    fats: safeObj.target_fats || 0,
  };
}; 
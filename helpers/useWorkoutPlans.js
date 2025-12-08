import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Custom hook to access selected plans from AuthContext
 * This makes it easy to use selected workout and nutrition plans across any screen
 * 
 * @returns {object} Object containing:
 *   - selectedWorkoutPlan: Currently selected workout plan
 *   - selectedNutritionPlan: Currently selected nutrition plan
 *   - updateSelectedPlans: Function to update both plans
 * 
 * @example
 * const { selectedWorkoutPlan, selectedNutritionPlan, updateSelectedPlans } = useWorkoutPlans();
 */
export const useWorkoutPlans = () => {
  const { authState, updateSelectedPlans } = useContext(AuthContext);
  
  return {
    selectedWorkoutPlan: authState?.selectedWorkoutPlan || null,
    selectedNutritionPlan: authState?.selectedNutritionPlan || null,
    updateSelectedPlans,
  };
};


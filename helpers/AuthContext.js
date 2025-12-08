// import {createContext} from 'react'

// export  const AuthContext = createContext("")
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { backend_url } from '../config/config';

export const AuthContext = createContext();

// Helper function to ensure authState has no null attributes where they shouldn't be
const sanitizeAuthState = (state) => {
  // Default target nutrition data with zero values instead of null
  const defaultTargetNutrition = {
    target_calories: 0,
    target_carbs: 0,
    target_protein: 0,
    target_fats: 0
  };

  // Default latest body measurement with zero values instead of null
  const defaultBodyMeasurement = {
    weight: 0,
    weight_kg: 0,
    bodyFat: 0,
    muscleMass: 0,
    circumference: 0
  };

  // Extract user data (some components access authState.user.property, others access authState.property directly)
  const userData = state.user || {};

  // Ensure target_nutrition_data is never null, always has default values
  const sanitizedTargetNutrition = state.target_nutrition_data || defaultTargetNutrition;

  return {
    ...state,
    // Ensure user object exists with basic properties
    user: state.user ? {
      ...state.user,
      id: userData.id || 0,
      username: userData.username || '',
      age: userData.age || 0,
      height_cm: userData.height_cm || 0,
      gender: userData.gender || 'M',
      user_target: userData.user_target || 'MG',
      activity_level: userData.activity_level || 'M',
      profile_photo: userData.profile_photo || '',
      latest_body_measurement: userData.latest_body_measurement || defaultBodyMeasurement
    } : null,
    // Also provide top-level access for backward compatibility (some components expect authState.username directly)
    id: userData.id || 0,
    username: userData.username || '',
    age: userData.age || 0,
    height: userData.height_cm || 0, // Note: some components use 'height' instead of 'height_cm'
    height_cm: userData.height_cm || 0,
    gender: userData.gender || 'M',
    user_target: userData.user_target || 'MG',
    activity_level: userData.activity_level || 'M',
    profile_photo: userData.profile_photo || '',
    dietary_preferences: userData.dietary_preferences || '',
    latest_body_measurement: userData.latest_body_measurement || defaultBodyMeasurement,
    latest_body_measurement: {
      // weight: userData.latest_body_measurement.weight || 0,
      // weight_kg: userData.latest_body_measurement.weight_kg || 0,
      // bodyFat: userData.latest_body_measurement.body_fat_percentage || 0,
      // muscleMass: userData.latest_body_measurement.muscle_mass_kg || 0,
      // circumference: userData.latest_body_measurement.circumference_cm || 0,
    } ,
    // Ensure target_nutrition_data is never null, use defaults if null/undefined
    target_nutrition_data: sanitizedTargetNutrition,
  };
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(sanitizeAuthState({
    token: null,
    authenticated: false,
    user: null,
    target_nutrition_data: null,
    isSubscribed: false,
    subscriptionExpiry: null,
    selectedWorkoutPlan: null,
    selectedNutritionPlan: null,
  }));

  useEffect(() => {
    loadToken();
    // Note: Subscription status is now managed by RevenueCat hook, not here
  }, []);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userResponse = await axios.get(`${backend_url}user/`);
        
        // TODO: When backend subscription endpoint is ready, replace this with:
        // const subscriptionResponse = await axios.get(`${backend_url}subscription-status/`);
        // const isSubscribed = subscriptionResponse.data.is_subscribed;
        // const subscriptionExpiry = subscriptionResponse.data.expiry_date;
        
        const savedWorkoutPlan = await AsyncStorage.getItem('selectedWorkoutPlan');
        const savedNutritionPlan = await AsyncStorage.getItem('selectedNutritionPlan');
        
        setAuthState(sanitizeAuthState({
          token,
          authenticated: true,
          user: userResponse.data,
          target_nutrition_data: userResponse.data.target_nutrition_data,
          isSubscribed: await AsyncStorage.getItem('isSubscribed') === 'true',
          subscriptionExpiry: await AsyncStorage.getItem('subscriptionExpiry'),
          selectedWorkoutPlan: savedWorkoutPlan ? JSON.parse(savedWorkoutPlan) : null,
          selectedNutritionPlan: savedNutritionPlan ? JSON.parse(savedNutritionPlan) : null,
        }));
      }
    } catch (error) {
      console.error('Error loading token:', error);
      setAuthState(sanitizeAuthState({
        token: null,
        authenticated: false,
        user: null,
        target_nutrition_data: null,
        isSubscribed: false,
        subscriptionExpiry: null,
      }));
    }
  };

  // Subscription status is now managed entirely by RevenueCat via useSubscription.revenuecat hook
  // AsyncStorage is only used for offline caching, not validation
  // The hook calls updateSubscriptionStatus() to keep AuthContext in sync

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backend_url}token/`, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      await AsyncStorage.setItem('token', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      const userResponse = await axios.get(`${backend_url}user/`);

      // TODO: When backend subscription endpoint is ready, add:
      // const subscriptionResponse = await axios.get(`${backend_url}subscription-status/`);
      // const isSubscribed = subscriptionResponse.data.is_subscribed;
      // const subscriptionExpiry = subscriptionResponse.data.expiry_date;

      const savedWorkoutPlan = await AsyncStorage.getItem('selectedWorkoutPlan');
      const savedNutritionPlan = await AsyncStorage.getItem('selectedNutritionPlan');
      
      setAuthState(sanitizeAuthState({
        token: access,
        authenticated: true,
        user: userResponse.data,
        target_nutrition_data: userResponse.data.target_nutrition_data,
        isSubscribed: await AsyncStorage.getItem('isSubscribed') === 'true',
        subscriptionExpiry: await AsyncStorage.getItem('subscriptionExpiry'),
        selectedWorkoutPlan: savedWorkoutPlan ? JSON.parse(savedWorkoutPlan) : null,
        selectedNutritionPlan: savedNutritionPlan ? JSON.parse(savedNutritionPlan) : null,
      }));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('selectedWorkoutPlan');
      await AsyncStorage.removeItem('selectedNutritionPlan');
      delete axios.defaults.headers.common['Authorization'];
      setAuthState(sanitizeAuthState({
        token: null,
        authenticated: false,
        user: null,
        target_nutrition_data: null,
        //isSubscribed: false,
        subscriptionExpiry: null,
        selectedWorkoutPlan: null,
        selectedNutritionPlan: null,
      }));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Update subscription status in AuthContext
   * Called by RevenueCat subscription hook to keep app state in sync
   * 
   * @param {boolean} isSubscribed - Whether user has active subscription
   * @param {string|null} expiryDate - ISO date string of subscription expiry
   */
  const updateSubscriptionStatus = async (isSubscribed, expiryDate = null) => {
    try {
      console.log('[AuthContext] Updating subscription status:', {
        isSubscribed,
        expiryDate
      });
      
      // Store in AsyncStorage for offline caching only (NOT for validation)
      await AsyncStorage.setItem('isSubscribed', isSubscribed.toString());
      if (expiryDate) {
        await AsyncStorage.setItem('subscriptionExpiry', expiryDate);
      } else {
        await AsyncStorage.removeItem('subscriptionExpiry');
      }
      
      // Update AuthContext state
      setAuthState(prev => sanitizeAuthState({
        ...prev,
        isSubscribed,
        subscriptionExpiry: expiryDate,
        user: prev.user ? { ...prev.user, is_subscribed: isSubscribed } : prev.user,
      }));
      
      console.log('[AuthContext] Subscription status updated successfully');
      
      // TODO: When backend subscription endpoint is ready, also sync with backend:
      // await axios.post(`${backend_url}subscription/sync/`, {
      //   is_subscribed: isSubscribed,
      //   expiry_date: expiryDate
      // });
    } catch (error) {
      console.error('[AuthContext] Error updating subscription status:', error);
    }
  };

  /**
   * Update selected plans in AuthContext
   * This persists the plan selections across app sessions
   * 
   * @param {object} selectedWorkoutPlan - The currently selected workout plan
   * @param {object} selectedNutritionPlan - The currently selected nutrition plan
   */
  const updateSelectedPlans = async (selectedWorkoutPlan, selectedNutritionPlan) => {
    try {
      console.log('[AuthContext] Updating selected plans:', {
        workoutPlanId: selectedWorkoutPlan?.id || selectedWorkoutPlan?.value,
        workoutPlanName: selectedWorkoutPlan?.label || selectedWorkoutPlan?.name,
        nutritionPlanId: selectedNutritionPlan?.id || selectedNutritionPlan?.value,
        nutritionPlanName: selectedNutritionPlan?.label || selectedNutritionPlan?.name,
      });
      
      // Store in AsyncStorage for persistence
      if (selectedWorkoutPlan) {
        await AsyncStorage.setItem('selectedWorkoutPlan', JSON.stringify(selectedWorkoutPlan));
      } else {
        await AsyncStorage.removeItem('selectedWorkoutPlan');
      }
      
      if (selectedNutritionPlan) {
        await AsyncStorage.setItem('selectedNutritionPlan', JSON.stringify(selectedNutritionPlan));
      } else {
        await AsyncStorage.removeItem('selectedNutritionPlan');
      }
      
      // Update AuthContext state
      setAuthState(prev => sanitizeAuthState({
        ...prev,
        selectedWorkoutPlan: selectedWorkoutPlan || null,
        selectedNutritionPlan: selectedNutritionPlan || null,
      }));
      
      console.log('[AuthContext] Selected plans updated successfully');
    } catch (error) {
      console.error('[AuthContext] Error updating selected plans:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      // Make API call to delete account
      const response = await axios.delete(`${backend_url}user/delete/`);
      
      if (response.status === 200 || response.status === 204) {
        // Clear all local data
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('isSubscribed');
        await AsyncStorage.removeItem('subscriptionExpiry');
        await AsyncStorage.removeItem('selectedWorkoutPlan');
        await AsyncStorage.removeItem('selectedNutritionPlan');
        delete axios.defaults.headers.common['Authorization'];
        
        // Reset auth state
        setAuthState(sanitizeAuthState({
          token: null,
          authenticated: false,
          user: null,
          target_nutrition_data: null,
          isSubscribed: false,
          subscriptionExpiry: null,
          selectedWorkoutPlan: null,
          selectedNutritionPlan: null,
        }));
        
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete account' };
      }
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete account',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState: (newState) => setAuthState(sanitizeAuthState(newState)),
        login,
        logout,
        updateSubscriptionStatus,
        updateSelectedPlans,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

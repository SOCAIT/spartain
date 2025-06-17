// import {createContext} from 'react'

// export  const AuthContext = createContext("")
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { backend_url } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: false,
    user: null,
    target_nutrition_data: null,
    isSubscribed: false,
    subscriptionExpiry: null,
  });

  useEffect(() => {
    loadToken();
    loadSubscriptionStatus();
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
        
        setAuthState({
          token,
          authenticated: true,
          user: userResponse.data,
          target_nutrition_data: userResponse.data.target_nutrition_data,
          isSubscribed: await AsyncStorage.getItem('isSubscribed') === 'true',
          subscriptionExpiry: await AsyncStorage.getItem('subscriptionExpiry'),
        });
      }
    } catch (error) {
      console.error('Error loading token:', error);
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
        target_nutrition_data: null,
        isSubscribed: false,
        subscriptionExpiry: null,
      });
    }
  };

  const loadSubscriptionStatus = async () => {
    try {
      // TODO: When backend subscription endpoint is ready, replace this with:
      // const response = await axios.get(`${backend_url}subscription-status/`);
      // const isSubscribed = response.data.is_subscribed;
      // const subscriptionExpiry = response.data.expiry_date;
      
      const isSubscribed = await AsyncStorage.getItem('isSubscribed') === 'true';
      const subscriptionExpiry = await AsyncStorage.getItem('subscriptionExpiry');
      
      if (subscriptionExpiry) {
        // Check if subscription has expired
        const expiryDate = new Date(subscriptionExpiry);
        const now = new Date();
        if (now > expiryDate) {
          // Subscription has expired
          await AsyncStorage.setItem('isSubscribed', 'false');
          await AsyncStorage.removeItem('subscriptionExpiry');
          setAuthState(prev => ({
            ...prev,
            isSubscribed: false,
            subscriptionExpiry: null,
          }));
          return;
        }
      }

      setAuthState(prev => ({
        ...prev,
        isSubscribed,
        subscriptionExpiry,
      }));
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  };

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

      setAuthState({
        token: access,
        authenticated: true,
        user: userResponse.data,
        target_nutrition_data: userResponse.data.target_nutrition_data,
        isSubscribed: await AsyncStorage.getItem('isSubscribed') === 'true',
        subscriptionExpiry: await AsyncStorage.getItem('subscriptionExpiry'),
      });

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
      delete axios.defaults.headers.common['Authorization'];
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
        target_nutrition_data: null,
        isSubscribed: false,
        subscriptionExpiry: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateSubscriptionStatus = async (isSubscribed, expiryDate = null) => {
    try {
      // TODO: When backend subscription endpoint is ready, replace this with:
      // const response = await axios.post(`${backend_url}update-subscription/`, {
      //   is_subscribed: isSubscribed,
      //   expiry_date: expiryDate
      // });
      // const updatedStatus = response.data;
      
      await AsyncStorage.setItem('isSubscribed', isSubscribed.toString());
      if (expiryDate) {
        await AsyncStorage.setItem('subscriptionExpiry', expiryDate);
      }
      
      setAuthState(prev => ({
        ...prev,
        isSubscribed,
        subscriptionExpiry: expiryDate,
      }));
    } catch (error) {
      console.error('Error updating subscription status:', error);
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
        delete axios.defaults.headers.common['Authorization'];
        
        // Reset auth state
        setAuthState({
          token: null,
          authenticated: false,
          user: null,
          target_nutrition_data: null,
          isSubscribed: false,
          subscriptionExpiry: null,
        });
        
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
        login,
        logout,
        updateSubscriptionStatus,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

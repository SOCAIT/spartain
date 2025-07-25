// services/DataCollectionService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
// import HealthKitService from './HealthKitService';
import axios from 'axios';
import { data_collection_url } from '../config/config';

const DataCollectionService = {
  // Collect health metrics data
  collectHealthData: async (startDate, endDate) => {
    try {
      console.log('📊 Starting health data collection...');
      console.log('📅 Date range:', startDate.toISOString(), 'to', endDate.toISOString());
      
      console.log('🏥 Requesting HealthKit data...');
      const [steps, heartRates] = await Promise.all([
        HealthKitService.getSteps(startDate, endDate),
        HealthKitService.getHeartRates(startDate, endDate)
      ]);

      console.log('📈 HealthKit data received:');
      console.log('- Steps entries:', steps?.length || 0);
      console.log('- Heart rate entries:', heartRates?.length || 0);

      const userId = await DataCollectionService.getUserId();
      console.log('👤 User ID:', userId);
      
      if (!userId) {
        console.log('⚠️ No user ID found, skipping health data collection');
        return null;
      }

      const healthData = {
        user_id: userId,
        timestamp: new Date().toISOString(),
        data_type: 'health_metrics',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        metrics: {
          steps: {
            total: steps.reduce((sum, entry) => sum + (entry.value || 0), 0),
            data_points: steps.length,
            average_per_day: steps.length > 0 ? steps.reduce((sum, entry) => sum + (entry.value || 0), 0) / steps.length : 0
          },
          heart_rate: {
            average: heartRates.length > 0 ? heartRates.reduce((sum, entry) => sum + (entry.value || 0), 0) / heartRates.length : 0,
            max: heartRates.length > 0 ? Math.max(...heartRates.map(hr => hr.value || 0)) : 0,
            min: heartRates.length > 0 ? Math.min(...heartRates.map(hr => hr.value || 0)) : 0,
            data_points: heartRates.length
          }
        },
        raw_data: {
          steps: steps,
          heart_rates: heartRates
        }
      };

      console.log('💾 Storing health data locally...');
      await DataCollectionService.storeHealthDataLocally(healthData);
      
      console.log('🌐 Attempting to sync to server...');
      const syncResult = await DataCollectionService.syncHealthDataToServer(healthData);
      
      console.log('✅ Health data collection completed. Sync success:', syncResult.success);
      
      return {
        ...healthData,
        sync_success: syncResult.success
      };
    } catch (error) {
      console.error('❌ Error collecting health data:', error);
      console.error('❌ Error details:', error.stack);
      return null;
    }
  },

  // Store health data locally as backup
  storeHealthDataLocally: async (healthData) => {
    try {
      const existingData = await AsyncStorage.getItem('@health_data_backup') || '[]';
      const dataArray = JSON.parse(existingData);
      dataArray.push(healthData);
      
      // Keep only last 30 entries locally to manage storage
      if (dataArray.length > 30) {
        dataArray.splice(0, dataArray.length - 30);
      }
      
      await AsyncStorage.setItem('@health_data_backup', JSON.stringify(dataArray));
      console.log('💾 Health data stored locally');
    } catch (error) {
      console.error('Error storing health data locally:', error);
    }
  },

  // Sync health data to server
  syncHealthDataToServer: async (healthData) => {
    try {
      const authToken = await DataCollectionService.getAuthToken();
      if (!authToken) {
        console.log('⚠️ No auth token found, cannot sync to server');
        return { success: false, error: 'No auth token' };
      }

      console.log('🚀 Syncing health data to server...');

      const response = await axios.post(`${data_collection_url}api/v1/ml-training-data/`, healthData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 15000 // 15 second timeout
      });

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Health data synced successfully to server');
        return { success: true, response: response.data };
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error syncing health data to server:', error.message);
      
      // Queue for retry if immediate sync fails
      await DataCollectionService.queueHealthDataForRetry(healthData);
      return { success: false, error: error.message };
    }
  },

  // Queue failed health data for retry
  queueHealthDataForRetry: async (healthData) => {
    try {
      const retryQueue = await AsyncStorage.getItem('@health_retry_queue') || '[]';
      const queueArray = JSON.parse(retryQueue);
      queueArray.push({
        ...healthData,
        retry_count: (healthData.retry_count || 0) + 1,
        queued_at: new Date().toISOString()
      });
      
      // Limit retry queue size
      if (queueArray.length > 20) {
        queueArray.splice(0, queueArray.length - 20);
      }
      
      await AsyncStorage.setItem('@health_retry_queue', JSON.stringify(queueArray));
      console.log('📝 Health data queued for retry');
    } catch (error) {
      console.error('Error queuing health data for retry:', error);
    }
  },

  // Retry failed health data syncs
  retryFailedHealthSyncs: async () => {
    try {
      const retryQueue = await AsyncStorage.getItem('@health_retry_queue') || '[]';
      const queueArray = JSON.parse(retryQueue);
      
      if (queueArray.length === 0) return;

      console.log(`🔄 Retrying ${queueArray.length} failed health data syncs`);
      
      const successfulSyncs = [];
      const failedSyncs = [];

      for (const healthData of queueArray) {
        // Skip if too many retries
        if (healthData.retry_count > 3) {
          console.log('⚠️ Dropping health data after 3 failed retries');
          continue;
        }

        const result = await DataCollectionService.syncHealthDataToServer(healthData);
        if (result.success) {
          successfulSyncs.push(healthData);
        } else {
          failedSyncs.push(healthData);
        }
      }

      // Update retry queue with only failed items
      await AsyncStorage.setItem('@health_retry_queue', JSON.stringify(failedSyncs));
      
      if (successfulSyncs.length > 0) {
        console.log(`✅ Successfully retried ${successfulSyncs.length} health data syncs`);
      }
    } catch (error) {
      console.error('Error retrying failed health syncs:', error);
    }
  },

  // Collect health data for the last 7 days
  collectRecentHealthData: async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days
    
    return await DataCollectionService.collectHealthData(startDate, endDate);
  },

  // Collect health data for today
  collectTodayHealthData: async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return await DataCollectionService.collectHealthData(startOfDay, endOfDay);
  },

  // Get health data statistics from server
  getHealthDataStats: async () => {
    try {
      const authToken = await DataCollectionService.getAuthToken();
      if (!authToken) return null;

      const response = await axios.get(`${data_collection_url}api/v1/ml-training-data/stats/storage`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error getting health data stats:', error);
      return null;
    }
  },

  // Helper functions
  getUserId: async () => {
    try {
      // Try to get from auth token first
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Decode JWT to get user ID (basic decode, not verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id || payload.sub || payload.id;
      }
      
      // Fallback to stored user data
      const userData = await AsyncStorage.getItem('@user_data');
      return userData ? JSON.parse(userData).id : null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  },

  getAuthToken: async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Get locally stored health data
  getStoredHealthData: async (limit = 10) => {
    try {
      const data = await AsyncStorage.getItem('@health_data_backup') || '[]';
      const dataArray = JSON.parse(data);
      return dataArray.slice(-limit); // Return last N entries
    } catch (error) {
      console.error('Error getting stored health data:', error);
      return [];
    }
  },

  // Clear local health data
  clearLocalHealthData: async () => {
    try {
      await AsyncStorage.removeItem('@health_data_backup');
      await AsyncStorage.removeItem('@health_retry_queue');
      console.log('Local health data cleared');
    } catch (error) {
      console.error('Error clearing local health data:', error);
    }
  },

  // Check server health
  checkServerHealth: async () => {
    try {
        const response = await axios.get(`${data_collection_url}api/v1/health`, {
        timeout: 5000
      });
      return { healthy: true, response: response.data };
    } catch (error) {
      console.error('Server health check failed:', error);
      return { healthy: false, error: error.message };
    }
  }
};

export default DataCollectionService; 
import { useEffect, useContext } from 'react';
import DataCollectionService from '../services/DataCollectionService';
import { AuthContext } from '../helpers/AuthContext';

export const useDataCollection = () => {
  const { authState } = useContext(AuthContext);

  // Auto-retry failed health data syncs periodically
  useEffect(() => {
    const retryInterval = setInterval(() => {
      DataCollectionService.retryFailedHealthSyncs();
    }, 120000); // Retry every 2 minutes

    return () => clearInterval(retryInterval);
  }, []);

  return {
    // Collect health data for today
    collectTodayHealthData: async () => {
      try {
        return await DataCollectionService.collectTodayHealthData();
      } catch (error) {
        console.error('Error collecting today health data:', error);
        return null;
      }
    },

    // Collect recent health data (last 7 days)
    collectRecentHealthData: async () => {
      try {
        return await DataCollectionService.collectRecentHealthData();
      } catch (error) {
        console.error('Error collecting recent health data:', error);
        return null;
      }
    },

    // Collect health data for a custom date range
    collectHealthData: async (startDate, endDate) => {
      try {
        return await DataCollectionService.collectHealthData(startDate, endDate);
      } catch (error) {
        console.error('Error collecting health data:', error);
        return null;
      }
    },

    // Get health data statistics from server
    getHealthStats: async () => {
      try {
        return await DataCollectionService.getHealthDataStats();
      } catch (error) {
        console.error('Error getting health stats:', error);
        return null;
      }
    },

    // Manually retry failed syncs
    retryFailedSyncs: async () => {
      try {
        await DataCollectionService.retryFailedHealthSyncs();
      } catch (error) {
        console.error('Error retrying failed syncs:', error);
      }
    },

    // Check server health
    checkServerHealth: async () => {
      try {
        return await DataCollectionService.checkServerHealth();
      } catch (error) {
        console.error('Error checking server health:', error);
        return { healthy: false, error: error.message };
      }
    },

    // Get locally stored health data
    getStoredHealthData: async (limit = 10) => {
      try {
        return await DataCollectionService.getStoredHealthData(limit);
      } catch (error) {
        console.error('Error getting stored health data:', error);
        return [];
      }
    },

    // Clear local health data
    clearLocalData: async () => {
      try {
        await DataCollectionService.clearLocalHealthData();
      } catch (error) {
        console.error('Error clearing local data:', error);
      }
    }
  };
};

// Screen tracking hook - simplified (no longer tracks screens since we focus on health data only)
export const useScreenTracking = (screenName) => {
  useEffect(() => {
    // Screen tracking disabled - focusing only on health data collection
    console.log(`Screen tracking disabled for: ${screenName}`);
  }, [screenName]);
}; 
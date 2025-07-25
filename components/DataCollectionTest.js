// components/DataCollectionTest.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDataCollection } from '../hooks/useDataCollection';
import { COLORS } from '../constants';

const DataCollectionTest = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [serverHealth, setServerHealth] = useState(null);
  
  const { 
    collectTodayHealthData,
    collectRecentHealthData,
    getHealthStats,
    checkServerHealth,
    getStoredHealthData,
    retryFailedSyncs,
    clearLocalData
  } = useDataCollection();

  const testTodayHealthData = async () => {
    setIsCollecting(true);
    try {
      const result = await collectTodayHealthData();
      setLastResult(result);
      if (result) {
        Alert.alert('Success', `Today's health data collected!\nSteps: ${result.metrics.steps.total}\nSync: ${result.sync_success ? 'Success' : 'Failed'}`);
      } else {
        Alert.alert('Info', 'No health data available or permissions not granted');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to collect today health data');
    } finally {
      setIsCollecting(false);
    }
  };

  const testRecentHealthData = async () => {
    setIsCollecting(true);
    try {
      const result = await collectRecentHealthData();
      setLastResult(result);
      if (result) {
        Alert.alert('Success', `Recent health data collected (7 days)!\nSteps: ${result.metrics.steps.total}\nSync: ${result.sync_success ? 'Success' : 'Failed'}`);
      } else {
        Alert.alert('Info', 'No health data available');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to collect recent health data');
    } finally {
      setIsCollecting(false);
    }
  };

  const testHealthStats = async () => {
    setIsCollecting(true);
    try {
      const result = await getHealthStats();
      setLastResult(result);
      if (result) {
        Alert.alert('Success', 'Health stats retrieved from server!');
      } else {
        Alert.alert('Info', 'No stats available from server');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get health stats');
    } finally {
      setIsCollecting(false);
    }
  };

  const testServerHealth = async () => {
    setIsCollecting(true);
    try {
      const result = await checkServerHealth();
      setServerHealth(result);
      if (result.healthy) {
        Alert.alert('Success', 'Server is healthy!');
      } else {
        Alert.alert('Warning', `Server health check failed: ${result.error}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check server health');
    } finally {
      setIsCollecting(false);
    }
  };

  const testStoredData = async () => {
    setIsCollecting(true);
    try {
      const result = await getStoredHealthData(5);
      setLastResult(result);
      Alert.alert('Success', `Retrieved ${result.length} stored health data entries`);
    } catch (error) {
      Alert.alert('Error', 'Failed to get stored data');
    } finally {
      setIsCollecting(false);
    }
  };

  const testRetrySync = async () => {
    setIsCollecting(true);
    try {
      await retryFailedSyncs();
      Alert.alert('Success', 'Retry sync completed!');
    } catch (error) {
      Alert.alert('Error', 'Failed to retry sync');
    } finally {
      setIsCollecting(false);
    }
  };

  const testClearData = async () => {
    Alert.alert(
      'Confirm Clear',
      'Are you sure you want to clear all local health data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearLocalData();
              setLastResult(null);
              Alert.alert('Success', 'Local health data cleared!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Data Collection Test</Text>
      
      {serverHealth && (
        <View style={[styles.healthIndicator, { backgroundColor: serverHealth.healthy ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.healthText}>
            Server: {serverHealth.healthy ? 'Healthy' : 'Unhealthy'}
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, isCollecting && styles.buttonDisabled]} 
        onPress={testTodayHealthData}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>
          {isCollecting ? 'Collecting...' : 'Collect Today\'s Health Data'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isCollecting && styles.buttonDisabled]} 
        onPress={testRecentHealthData}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>
          {isCollecting ? 'Collecting...' : 'Collect Recent Health Data (7 days)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isCollecting && styles.buttonDisabled]} 
        onPress={testHealthStats}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>
          {isCollecting ? 'Loading...' : 'Get Health Stats from Server'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isCollecting && styles.buttonDisabled]} 
        onPress={testServerHealth}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>
          {isCollecting ? 'Checking...' : 'Check Server Health'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isCollecting && styles.buttonDisabled]} 
        onPress={testStoredData}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>Get Stored Health Data</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isCollecting && styles.buttonDisabled]} 
        onPress={testRetrySync}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>Retry Failed Syncs</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.buttonDanger, isCollecting && styles.buttonDisabled]} 
        onPress={testClearData}
        disabled={isCollecting}
      >
        <Text style={styles.buttonText}>Clear Local Data</Text>
      </TouchableOpacity>

      {lastResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Last Result:</Text>
          <ScrollView style={styles.resultScroll} nestedScrollEnabled>
            <Text style={styles.resultText}>
              {JSON.stringify(lastResult, null, 2)}
            </Text>
          </ScrollView>
        </View>
      )}

      <Text style={styles.note}>
        📱 Health data is collected from HealthKit (iOS) and stored locally + synced to server
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    maxHeight: 600,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  healthIndicator: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: 'center',
  },
  healthText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary || '#FF6A00',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  resultTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultScroll: {
    maxHeight: 150,
  },
  resultText: {
    color: '#00FF00',
    fontSize: 11,
    fontFamily: 'Courier',
  },
  note: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default DataCollectionTest; 
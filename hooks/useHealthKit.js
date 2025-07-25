// src/hooks/useHealthKit.js
import { useState, useEffect } from 'react';
import HealthKitService from '../services/HealthKitService';

export function useHealthKitData({ startDate, endDate }) {
  const [steps, setSteps] = useState([]);
  const [hr, setHr] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      try {
        const [stepData, hrData] = await Promise.all([
          HealthKitService.getSteps(startDate, endDate),
          HealthKitService.getHeartRates(startDate, endDate),
        ]);
        if (!mounted) return;
        setSteps(stepData);
        setHr(hrData);
      } catch (e) {
        if (mounted) setError(e);
      }
    }
    fetch();
    return () => {
      mounted = false;
    };
  }, [startDate, endDate]);

  return { steps, hr, error };
} 
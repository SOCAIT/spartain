import { Platform } from 'react-native';
import Sahha, { SahhaSensor, SahhaBiomarkerCategory, SahhaBiomarkerType, SahhaEnvironment, SahhaScoreType } from 'sahha-react-native';
import { SAHHA_APP_ID, SAHHA_APP_SECRET, SAHHA_EXTERNAL_ID, hasSahhaCredentials } from '../config/sahha';

export interface ExtendedHealthData {
  // Vitals
  bpm: number | null;
  heartRateSleep: number | null;
  hrv: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  vo2Max: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  
  // Activity
  steps: number | null;
  floorsClimbed: number | null;
  activeEnergyBurned: number | null;
  totalEnergyBurned: number | null;
  activeDuration: number | null;
  exerciseTime: number | null;
  
  // Body Composition
  weight: number | null;
  height: number | null;
  bmi: number | null;
  bodyFat: number | null;
  leanBodyMass: number | null;
  
  // Sleep
  sleepDuration: number | null;
  sleepEfficiency: number | null;
  sleepLatency: number | null;
  sleepDeepDuration: number | null;
  sleepRemDuration: number | null;
  sleepLightDuration: number | null;
  
  // Temperature
  bodyTemperature: number | null;
  
  // Scores
  sleepScore: number | null;
  wellbeingScore: number | null;
  activityScore: number | null;
  readinessScore: number | null;
}

export async function runSahhaMinimalTest(
  addLog?: (msg: string) => void,
): Promise<ExtendedHealthData>{
  const log = (msg: string) => {
    console.log(msg);
    try { addLog && addLog(msg); } catch {}
  };
  if (Platform.OS !== 'ios') {
    throw new Error(`Health data is only available on iOS for this test. Platform: ${Platform.OS}`);
  }

  await new Promise<void>((resolve, reject) => {
    Sahha.configure({ environment: SahhaEnvironment.sandbox }, (error: string, success: boolean) => {
      if (error) return reject(new Error(error));
      if (!success) return reject(new Error('Sahha.configure failed'));
      log('[SAHHA] configured sandbox');
      resolve();
    });
  });

  // Authenticate if credentials are provided; otherwise skip and rely on local sensors only
  if (hasSahhaCredentials()) {
    await new Promise<void>((resolve, reject) => {
      Sahha.authenticate(SAHHA_APP_ID, SAHHA_APP_SECRET, SAHHA_EXTERNAL_ID, (error: string, success: boolean) => {
        if (error) return reject(new Error(error));
        if (!success) return reject(new Error('Sahha.authenticate failed'));
        log('[SAHHA] authenticated');
        resolve();
      });
    });
  }

  // Enable all relevant sensors
  const sensorsToEnable = [
    SahhaSensor.heart_rate,
    SahhaSensor.resting_heart_rate,
    SahhaSensor.heart_rate_variability_sdnn,
    SahhaSensor.steps,
    SahhaSensor.floors_climbed,
    SahhaSensor.active_energy_burned,
    SahhaSensor.total_energy_burned,
    SahhaSensor.sleep,
    SahhaSensor.weight,
    SahhaSensor.height,
    SahhaSensor.body_mass_index,
    SahhaSensor.body_fat,
    SahhaSensor.lean_body_mass,
    SahhaSensor.vo2_max,
    SahhaSensor.oxygen_saturation,
    SahhaSensor.respiratory_rate,
    SahhaSensor.blood_pressure_systolic,
    SahhaSensor.blood_pressure_diastolic,
    SahhaSensor.body_temperature,
    SahhaSensor.exercise_time,
  ];

  await new Promise<void>((resolve, reject) => {
    Sahha.enableSensors(sensorsToEnable, (error: string, _status) => {
      if (error) return reject(new Error(error));
      log('[SAHHA] sensors enabled');
      resolve();
    });
  });

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);

  // Helper to get biomarker
  const getBiomarker = (type: SahhaBiomarkerType, category: SahhaBiomarkerCategory, aggregate: 'last' | 'sum' | 'avg' = 'last') => {
    return new Promise<number | null>((resolve) => {
      Sahha.getBiomarkers([category], [type], start.getTime(), end.getTime(), (error: string, value: string) => {
        if (error) {
          log(`[SAHHA][getBiomarker] ${type} error: ${error}`);
          return resolve(null);
        }
        try {
          const arr = JSON.parse(value) as Array<{ value?: number }>;
          if (!Array.isArray(arr) || arr.length === 0) return resolve(null);
          
          if (aggregate === 'sum') {
            const total = arr.reduce((sum, item) => sum + (item?.value ?? 0), 0);
            resolve(Number.isFinite(total) ? total : null);
          } else if (aggregate === 'avg') {
            const total = arr.reduce((sum, item) => sum + (item?.value ?? 0), 0);
            const avg = total / arr.length;
            resolve(Number.isFinite(avg) ? avg : null);
          } else {
            const last = arr[arr.length - 1];
            resolve(last?.value ?? null);
          }
        } catch {
          log(`[SAHHA][getBiomarker] ${type} parse error`);
          resolve(null);
        }
      });
    });
  };

  // Get all scores and extract factors
  const getScores = () => new Promise<{ 
    sleep: number | null; 
    wellbeing: number | null; 
    activity: number | null; 
    readiness: number | null;
    factors: Map<string, number>;
  }>((resolve) => {
    const scoreTypes = [
      SahhaScoreType.sleep,
      SahhaScoreType.wellbeing,
      SahhaScoreType.activity,
      SahhaScoreType.readiness,
    ];
    Sahha.getScores(
      scoreTypes as any,
      start.getTime(),
      end.getTime(),
      (error: string, value: string) => {
        if (error) {
          log(`[SAHHA][getScores] error: ${error}`);
          return resolve({ sleep: null, wellbeing: null, activity: null, readiness: null, factors: new Map() });
        }
        log(`[SAHHA][getScores] raw: ${value}`);
        try {
          const arr = JSON.parse(value) as Array<{ 
            type?: string; 
            score?: number; 
            value?: number; 
            factors?: Array<{ name: string; value: number; unit?: string }> 
          }>;
          
          const findScore = (t: string) => {
            const item = arr.find(i => i.type === t);
            if (!item) return null;
            const s = (typeof item.score === 'number' ? item.score : item.value) as number | undefined;
            return typeof s === 'number' ? s : null;
          };
          
          // Extract all factors from all scores
          const factorsMap = new Map<string, number>();
          arr.forEach(scoreItem => {
            if (scoreItem.factors && Array.isArray(scoreItem.factors)) {
              scoreItem.factors.forEach(factor => {
                if (factor.name && typeof factor.value === 'number') {
                  // Use the most recent value or average if multiple
                  if (!factorsMap.has(factor.name)) {
                    factorsMap.set(factor.name, factor.value);
                  }
                }
              });
            }
          });
          
          log(`[SAHHA][getScores] extracted ${factorsMap.size} factors`);
          
          resolve({
            sleep: findScore('sleep'),
            wellbeing: findScore('wellbeing'),
            activity: findScore('activity'),
            readiness: findScore('readiness'),
            factors: factorsMap,
          });
        } catch (e) {
          log('[SAHHA][getScores] parse error');
          resolve({ sleep: null, wellbeing: null, activity: null, readiness: null, factors: new Map() });
        }
      }
    );
  });

  // Fetch all data in parallel
  const [
    bpm,
    heartRateSleep,
    hrv,
    respiratoryRate,
    oxygenSaturation,
    vo2Max,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    steps,
    floorsClimbed,
    activeEnergyBurned,
    totalEnergyBurned,
    activeDuration,
    exerciseTime,
    weight,
    height,
    bmi,
    bodyFat,
    leanBodyMass,
    sleepDuration,
    sleepEfficiency,
    sleepLatency,
    sleepDeepDuration,
    sleepRemDuration,
    sleepLightDuration,
    bodyTemperature,
    scores,
  ] = await Promise.all([
    // Vitals
    getBiomarker(SahhaBiomarkerType.heart_rate_resting, SahhaBiomarkerCategory.vitals, 'avg'),
    getBiomarker(SahhaBiomarkerType.heart_rate_sleep, SahhaBiomarkerCategory.vitals, 'avg'),
    getBiomarker(SahhaBiomarkerType.heart_rate_variability_sdnn, SahhaBiomarkerCategory.vitals, 'avg'),
    getBiomarker(SahhaBiomarkerType.respiratory_rate, SahhaBiomarkerCategory.vitals, 'avg'),
    getBiomarker(SahhaBiomarkerType.oxygen_saturation, SahhaBiomarkerCategory.vitals, 'avg'),
    getBiomarker(SahhaBiomarkerType.vo2_max, SahhaBiomarkerCategory.vitals, 'last'),
    getBiomarker(SahhaBiomarkerType.blood_pressure_systolic, SahhaBiomarkerCategory.vitals, 'avg'),
    getBiomarker(SahhaBiomarkerType.blood_pressure_diastolic, SahhaBiomarkerCategory.vitals, 'avg'),
    // Activity
    getBiomarker(SahhaBiomarkerType.steps, SahhaBiomarkerCategory.activity, 'sum'),
    getBiomarker(SahhaBiomarkerType.floors_climbed, SahhaBiomarkerCategory.activity, 'sum'),
    getBiomarker(SahhaBiomarkerType.active_energy_burned, SahhaBiomarkerCategory.activity, 'sum'),
    getBiomarker(SahhaBiomarkerType.total_energy_burned, SahhaBiomarkerCategory.activity, 'sum'),
    getBiomarker(SahhaBiomarkerType.active_duration, SahhaBiomarkerCategory.activity, 'sum'),
    getBiomarker(SahhaBiomarkerType.activity_high_intensity_duration, SahhaBiomarkerCategory.activity, 'sum'),
    // Body
    getBiomarker(SahhaBiomarkerType.weight, SahhaBiomarkerCategory.body, 'last'),
    getBiomarker(SahhaBiomarkerType.height, SahhaBiomarkerCategory.body, 'last'),
    getBiomarker(SahhaBiomarkerType.body_mass_index, SahhaBiomarkerCategory.body, 'last'),
    getBiomarker(SahhaBiomarkerType.body_fat, SahhaBiomarkerCategory.body, 'last'),
    getBiomarker(SahhaBiomarkerType.lean_mass, SahhaBiomarkerCategory.body, 'last'),
    // Sleep
    getBiomarker(SahhaBiomarkerType.sleep_duration, SahhaBiomarkerCategory.sleep, 'avg'),
    getBiomarker(SahhaBiomarkerType.sleep_efficiency, SahhaBiomarkerCategory.sleep, 'avg'),
    getBiomarker(SahhaBiomarkerType.sleep_latency, SahhaBiomarkerCategory.sleep, 'avg'),
    getBiomarker(SahhaBiomarkerType.sleep_deep_duration, SahhaBiomarkerCategory.sleep, 'avg'),
    getBiomarker(SahhaBiomarkerType.sleep_rem_duration, SahhaBiomarkerCategory.sleep, 'avg'),
    getBiomarker(SahhaBiomarkerType.sleep_light_duration, SahhaBiomarkerCategory.sleep, 'avg'),
    getBiomarker(SahhaBiomarkerType.body_temperature_basal, SahhaBiomarkerCategory.vitals, 'avg'),
    // Scores
    getScores(),
  ]);

  // Helper function to get value from biomarker or factor fallback
  const getValue = (biomarkerValue: number | null, factorName: string, multiplier: number = 1): number | null => {
    if (biomarkerValue !== null) return biomarkerValue;
    const factorValue = scores.factors.get(factorName);
    return factorValue !== null && factorValue !== undefined ? factorValue * multiplier : null;
  };

  // Sleep duration needs special handling - factors are in minutes, biomarkers can be unreliable
  const getSleepDuration = () => {
    // Factor value is in minutes according to Sahha API - USE THIS FIRST as it's more reliable
    const factorValue = scores.factors.get('sleep_duration');
    if (factorValue !== null && factorValue !== undefined) {
      log(`[SAHHA][getSleepDuration] Using factor value: ${factorValue} minutes`);
      // Validate reasonable sleep duration (2-20 hours)
      if (factorValue >= 120 && factorValue <= 1200) {
        return factorValue * 60; // Convert minutes to seconds
      }
      log(`[SAHHA][getSleepDuration] Factor value out of reasonable range, ignoring`);
    }
    
    // Fallback to biomarker only if factor is not available
    if (sleepDuration !== null) {
      log(`[SAHHA][getSleepDuration] Biomarker value: ${sleepDuration}`);
      // Maximum reasonable sleep: 16 hours = 57600 seconds
      // Minimum reasonable sleep: 2 hours = 7200 seconds
      if (sleepDuration >= 7200 && sleepDuration <= 57600) {
        log(`[SAHHA][getSleepDuration] Biomarker value is reasonable (in seconds)`);
        return sleepDuration; // Already in seconds
      }
      // If it's a small number, might be in minutes
      if (sleepDuration >= 120 && sleepDuration <= 1200) {
        log(`[SAHHA][getSleepDuration] Biomarker appears to be in minutes, converting`);
        return sleepDuration * 60;
      }
      log(`[SAHHA][getSleepDuration] Biomarker value unreasonable (${sleepDuration}), ignoring`);
    }
    
    return null;
  };

  // Helper to validate and use reasonable values only
  const getValidValue = (value: number | null, min: number, max: number): number | null => {
    if (value === null) return null;
    if (value >= min && value <= max) return value;
    log(`[SAHHA] Value ${value} out of range [${min}, ${max}], rejecting`);
    return null;
  };

  return {
    bpm: getValue(bpm, 'resting_heart_rate'),
    heartRateSleep: getValue(heartRateSleep, 'heart_rate_sleep'),
    hrv,
    respiratoryRate,
    oxygenSaturation,
    vo2Max,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    steps: getValue(steps, 'steps'),
    floorsClimbed,
    activeEnergyBurned: getValue(activeEnergyBurned, 'active_calories'), // Sahha uses 'active_calories'
    totalEnergyBurned,
    activeDuration: getValue(activeDuration, 'active_hours', 3600), // Convert hours to seconds
    exerciseTime,
    weight,
    height,
    bmi,
    bodyFat,
    leanBodyMass,
    sleepDuration: getSleepDuration(), // Handled specially with validation
    sleepEfficiency: getValidValue(sleepEfficiency, 0, 100), // 0-100%
    sleepLatency: getValidValue(sleepLatency, 0, 7200), // 0-2 hours in seconds
    sleepDeepDuration: getValidValue(sleepDeepDuration, 0, 28800), // 0-8 hours in seconds
    sleepRemDuration: getValidValue(sleepRemDuration, 0, 14400), // 0-4 hours in seconds
    sleepLightDuration: getValidValue(sleepLightDuration, 0, 28800), // 0-8 hours in seconds
    bodyTemperature,
    sleepScore: scores.sleep,
    wellbeingScore: scores.wellbeing,
    activityScore: scores.activity,
    readinessScore: scores.readiness,
  };
}

export default { runSahhaMinimalTest };

export type SahhaSignupOptions = {
  environment?: SahhaEnvironment;
  externalId: string;
  getTokens?: () => Promise<{ profileToken: string; refreshToken: string }>;
  appId?: string;
  appSecret?: string;
  enableSensors?: SahhaSensor[];
  addLog?: (message: string) => void;
};

async function sendSahhaDataToBackend(token: string) {
  const { bpm, steps, sleepScore, wellbeingScore } = await runSahhaMinimalTest()

  const payload = {
    user_id: SAHHA_EXTERNAL_ID,
    biomarkers: [
      { type: 'heart_rate_resting', value: bpm, timestamp: new Date().toISOString() },
      { type: 'steps', value: steps, timestamp: new Date().toISOString() },
    ],
    scores: [
      { scoreType: 'sleep', score: sleepScore, timestamp: new Date().toISOString() },
      { scoreType: 'wellbeing', score: wellbeingScore, timestamp: new Date().toISOString() },
    ],
  }

  try {
    const res = await fetch('https://yourbackend.com/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    console.log('[SAHHA][upload]', json)
  } catch (e) {
    console.error('[SAHHA][upload] failed', e)
  }
}

/**
 * Reusable signup/auth helper for Sahha.
 * - In production, provide getTokens() to mint tokens on your backend and authenticate with authenticateToken.
 * - In sandbox/dev, omit getTokens() and provide appId + appSecret to authenticate directly.
 * Optionally enables sensors after auth.
 */
export async function sahhaSignup(options: SahhaSignupOptions): Promise<{ authenticated: boolean }>{
  const {
    environment = SahhaEnvironment.sandbox,
    externalId,
    getTokens,
    appId,
    appSecret,
    enableSensors,
    addLog,
  } = options;

  const log = (msg: string) => {
    console.log(msg);
    try { addLog && addLog(msg); } catch {}
  };

  if (Platform.OS !== 'ios') {
    throw new Error(`Sahha is only supported on iOS for this helper. Platform: ${Platform.OS}`);
  }

  // 1) Configure
  await new Promise<void>((resolve, reject) => {
    Sahha.configure({ environment }, (error: string, success: boolean) => {
      if (error) return reject(new Error(error));
      if (!success) return reject(new Error('Sahha.configure failed'));
      log(`[SAHHA][signup] configured ${environment}`);
      resolve();
    });
  });

  // 2) Authenticate (prefer tokens → production; otherwise use secrets → sandbox/dev)
  if (getTokens) {
    const { profileToken, refreshToken } = await getTokens();
    await new Promise<void>((resolve, reject) => {
      Sahha.authenticateToken(profileToken, refreshToken, (error: string, success: boolean) => {
        if (error) return reject(new Error(error));
        if (!success) return reject(new Error('Sahha.authenticateToken failed'));
        log('[SAHHA][signup] authenticated with tokens');
        resolve();
      });
    });
  } else {
    if (!appId || !appSecret || !externalId) {
      throw new Error('Missing auth configuration: provide getTokens() or appId + appSecret + externalId');
    }
    await new Promise<void>((resolve, reject) => {
      Sahha.authenticate(appId, appSecret, externalId, (error: string, success: boolean) => {
        if (error) return reject(new Error(error));
        if (!success) return reject(new Error('Sahha.authenticate failed'));
        log('[SAHHA][signup] authenticated with app secret (dev)');
        resolve();
      });
    });
  }

  // 3) Optionally enable sensors
  if (enableSensors && enableSensors.length > 0) {
    await new Promise<void>((resolve, reject) => {
      Sahha.enableSensors(enableSensors, (error: string) => {
        if (error) return reject(new Error(error));
        log(`[SAHHA][signup] sensors enabled: ${enableSensors.join(', ')}`);
        resolve();
      });
    });
  }

  return { authenticated: true };
}
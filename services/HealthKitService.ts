import { Platform } from 'react-native';
// import Sahha, { SahhaSensor, SahhaBiomarkerCategory, SahhaBiomarkerType, SahhaEnvironment, SahhaScoreType } from 'sahha-react-native';
// import { SAHHA_APP_ID, SAHHA_APP_SECRET, SAHHA_EXTERNAL_ID, hasSahhaCredentials } from '../config/sahha';

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
  log('[SAHHA] Minimal test skipped (Sahha removed)');
  
  return {
    bpm: null,
    heartRateSleep: null,
    hrv: null,
    respiratoryRate: null,
    oxygenSaturation: null,
    vo2Max: null,
    bloodPressureSystolic: null,
    bloodPressureDiastolic: null,
    steps: null,
    floorsClimbed: null,
    activeEnergyBurned: null,
    totalEnergyBurned: null,
    activeDuration: null,
    exerciseTime: null,
    weight: null,
    height: null,
    bmi: null,
    bodyFat: null,
    leanBodyMass: null,
    sleepDuration: null,
    sleepEfficiency: null,
    sleepLatency: null,
    sleepDeepDuration: null,
    sleepRemDuration: null,
    sleepLightDuration: null,
    bodyTemperature: null,
    sleepScore: null,
    wellbeingScore: null,
    activityScore: null,
    readinessScore: null,
  };
}

export default { runSahhaMinimalTest };

export type SahhaSignupOptions = {
  environment?: any;
  externalId: string;
  getTokens?: () => Promise<{ profileToken: string; refreshToken: string }>;
  appId?: string;
  appSecret?: string;
  enableSensors?: any[];
  addLog?: (message: string) => void;
};

async function sendSahhaDataToBackend(token: string) {
  // Skip
}

export async function sahhaSignup(options: SahhaSignupOptions): Promise<{ authenticated: boolean }>{
  return { authenticated: false };
}

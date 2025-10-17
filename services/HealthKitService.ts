import { Platform } from 'react-native';
import Sahha, { SahhaSensor, SahhaBiomarkerCategory, SahhaBiomarkerType, SahhaEnvironment, SahhaScoreType } from 'sahha-react-native';
import { SAHHA_APP_ID, SAHHA_APP_SECRET, SAHHA_EXTERNAL_ID, hasSahhaCredentials } from '../config/sahha';

export async function runSahhaMinimalTest(
  addLog?: (msg: string) => void,
): Promise<{ bpm: number | null; steps: number | null; sleepScore: number | null; wellbeingScore: number | null; raw: string }>{
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

  await new Promise<void>((resolve, reject) => {
    Sahha.enableSensors([SahhaSensor.heart_rate, SahhaSensor.steps], (error: string, _status) => {
      if (error) return reject(new Error(error));
      log('[SAHHA] sensors enabled: heart_rate, steps');
      resolve();
    });
  });

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);

  const getBpm = () => new Promise<number | null>((resolve, reject) => {
    Sahha.getBiomarkers([
      SahhaBiomarkerCategory.vitals,
    ], [
      SahhaBiomarkerType.heart_rate_resting,
    ], start.getTime(), end.getTime(), (error: string, value: string) => {
      if (error) return reject(new Error(error));
      try {
        const arr = JSON.parse(value) as Array<{ value?: number }>;
        const last = Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : undefined;
        log(`[SAHHA][getBiomarkers] heart_rate_resting raw: ${value}`);
        resolve(last?.value ?? null);
      } catch {
        log('[SAHHA][getBiomarkers] parse error');
        resolve(null);
      }
    })
  });

  const getSteps = () => new Promise<number | null>((resolve, reject) => {
    Sahha.getSamples(
      SahhaSensor.steps,
      start.getTime(),
      end.getTime(),
      (error: string, value: string) => {
        if (error) return reject(new Error(error));
        try {
          const arr = JSON.parse(value) as Array<{ value?: number }>;
          // Sum steps across the period
          const total = Array.isArray(arr) ? arr.reduce((sum, s) => sum + (s?.value ?? 0), 0) : 0;
          log(`[SAHHA][getSamples] steps raw: ${value}`);
          resolve(Number.isFinite(total) ? total : null);
        } catch {
          log('[SAHHA][getSamples] steps parse error');
          resolve(null);
        }
      }
    );
  });

  const getScores = () => new Promise<{ sleep: number | null; wellbeing: number | null }>((resolve, reject) => {
    const scoreTypes = [
      SahhaScoreType.sleep,
      SahhaScoreType.wellbeing,
      SahhaScoreType.activity,
    ];
    Sahha.getScores(
      scoreTypes as any,
      start.getTime(),
      end.getTime(),
      (error: string, value: string) => {
        if (error) return reject(new Error(error));
        log(`[SAHHA][getScores] raw: ${value}`);
        try {
          const arr = JSON.parse(value) as Array<{ type?: string; score?: number; value?: number; factors?: any[] }>;
          const findScore = (t: string) => {
            const item = arr.find(i => i.type === t);
            if (!item) return null;
            const s = (typeof item.score === 'number' ? item.score : item.value) as number | undefined;
            return typeof s === 'number' ? s : null;
          };
          const sleep = findScore('sleep');
          const wellbeing = findScore('wellbeing');
          const activity = findScore('activity');
          const firstFactors = arr[0]?.factors ? JSON.stringify(arr[0].factors.slice(0, 2)) : '';
          if (firstFactors) {
            log(`[SAHHA][getScores] sample factors: ${firstFactors}`);
          }
          log(`[SAHHA][getScores] parsed: sleep=${sleep}, wellbeing=${wellbeing}`);
          resolve({ sleep, wellbeing, activity });
        } catch (e) {
          log('[SAHHA][getScores] parse error');
          resolve({ sleep: null, wellbeing: null, activity: null });
        }
      }
    );
  });

  const [bpm, steps, scores] = await Promise.all([getBpm(), getSteps(), getScores()]);
  return { bpm, steps, sleepScore: scores.sleep, wellbeingScore: scores.wellbeing, raw: '' };
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
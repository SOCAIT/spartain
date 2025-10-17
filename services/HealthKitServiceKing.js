// src/services/HealthKitService.js
import { useHealthkitAuthorization, saveQuantitySample } from '@kingstinct/react-native-healthkit';

const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(['HKQuantityTypeIdentifierBloodGlucose'])

// make sure that you've requested authorization before requesting data, otherwise your app will crash
import { useMostRecentQuantitySample, HKQuantityTypeIdentifier, useMostRecentCategorySample } from '@kingstinct/react-native-healthkit';

const mostRecentBloodGlucoseSample = useMostRecentQuantitySample('HKQuantityTypeIdentifierBloodGlucose')
const lastBodyFatSample = useMostRecentQuantitySample('HKQuantityTypeIdentifierBodyFatPercentage')
const lastMindfulSession = useMostRecentCategorySample('HKCategoryTypeIdentifierMindfulSession')
const lastWorkout = useMostRecentWorkout()

// const PERMS = AppleHealthKit.Constants.Permissions;

// // const options = {
// //   permissions: {
// //     read: [
// //       PERMS.HeartRate,
// //       PERMS.StepCount,
// //       PERMS.ActiveEnergyBurned,
// //       // …etc
// //     ],
// //     write: [] // if you ever need to write data back
// //   }
// // };

// /* Permission options */
// const options = {
//   permissions: {
//     read: [AppleHealthKit.Constants.Permissions.HeartRate],
//     write: [AppleHealthKit.Constants.Permissions.Steps],
//   },
// }  

// const HealthKitService = {
//   isInitialized: false,

//   init: () =>
//     new Promise((resolve, reject) => {
//       if (HealthKitService.isInitialized) {
//         console.log('🏥 HealthKit: Already initialized');
//         resolve(true);
//       } else {
//         console.log('🏥 HealthKit: Initializing with permissions...');
//         AppleHealthKit.initHealthKit(options, (err) => {
//           if (err) {
//             console.error('🏥 HealthKit Initialization Error:', err);
//             return reject(err);
//           }
//           console.log('🏥 HealthKit: Successfully initialized');
//           HealthKitService.isInitialized = true;
//           resolve(true);
//         });
//       }
//     }),

//   getSteps: async (startDate, endDate) => {
//     console.log('🚶 HealthKit: Initializing for steps...');
//     await HealthKitService.init();
//     console.log('🚶 HealthKit: Getting step data from', startDate.toISOString(), 'to', endDate.toISOString());
//     return new Promise((resolve, reject) => {
//       AppleHealthKit.getDailyStepCountSamples(
//         { startDate, endDate },
//         (err, results) => {
//           if (err) {
//             console.error('🚶 HealthKit Steps Error:', err);
//             reject(err);
//           } else {
//             console.log('🚶 HealthKit Steps Success:', results?.length || 0, 'entries');
//             resolve(results);
//           }
//         }
//       );
//     });
//   },

//   getHeartRates: async (startDate, endDate) => {
//     console.log('💓 HealthKit: Initializing for heart rate...');
//     await HealthKitService.init();
//     console.log('💓 HealthKit: Getting heart rate data from', startDate.toISOString(), 'to', endDate.toISOString());
//     return new Promise((resolve, reject) => {
//       AppleHealthKit.getHeartRateSamples(
//         { startDate, endDate, unit: 'bpm' },
//         (err, results) => {
//           if (err) {
//             console.error('💓 HealthKit Heart Rate Error:', err);
//             reject(err);
//           } else {
//             console.log('💓 HealthKit Heart Rate Success:', results?.length || 0, 'entries');
//             resolve(results);
//           }
//         }
//       );
//     });
//   },

//   // …add any other wrappers you need
// };

// export default HealthKitService; 
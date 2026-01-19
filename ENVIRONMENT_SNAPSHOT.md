# Project Environment Snapshot - Jan 19, 2026

This file documents the exact working environment and package versions to prevent future "breaking" updates.

## System Environment
- **Node.js**: v23.11.0
- **NPM**: 10.9.2
- **OS**: Darwin (macOS) 24.6.0
- **Xcode**: 16.2 (SDK iphonesimulator18.2)

## Critical Pinned Package Versions
These versions are pinned in `package.json` to avoid compilation errors with the React Native 0.76.5 Codegen and Swift compatibility:

| Package | Version | Reason for Pinning |
| :--- | :--- | :--- |
| `react-native` | `0.76.5` | Core Framework |
| `react-native-vision-camera` | `4.6.4` | v4.7.3+ has Swift extension conflicts |
| `react-native-iap` | `12.16.2` | v12.16.4+ has `appTransactionID` member errors |
| `react-native-screens` | `4.10.0` | v4.20.0 breaks Codegen with "environment" prop type alias |
| `react-native-safe-area-context` | `5.4.0` | Compatibility with pinned screens version |

## Other Dependencies
- `@rneui/base`: `^4.0.0-rc.8`
- `@rneui/themed`: `^4.0.0-rc.8`
- `react-native-linear-gradient`: `^2.8.3`
- `react-native-progress`: `^5.0.1`
- `react-native-purchases`: `^9.4.2` (RevenueCat)

## Note on Sahha
The library `sahha-react-native` was removed to stabilize the build. Its implementation in `services/HealthKitService.ts` and `App.tsx` has been commented out or mocked.

## Maintenance Commands
If the project breaks after an `npm install`, always run:
```bash
# To reinstall exactly what is in the lockfile
npm ci

# To reset cache if modules are missing
npx react-native start --reset-cache

# To clean iOS build
cd ios && rm -rf Pods build && pod install && cd ..
```

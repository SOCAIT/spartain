# 🚀 Quick Start: Google Sign-In

## What's Been Done ✅

1. ✅ Added Google Sign-In and Apple Sign-In packages to `package.json`
2. ✅ Integrated social authentication buttons into Login and Signup screens
3. ✅ Updated `SocialAuthentication.js` component with proper error handling
4. ✅ Configured iOS `Info.plist` with URL scheme
5. ✅ Created comprehensive setup documentation

## What You Need To Do 📝

### 1. Install Dependencies (5 minutes)

```bash
# Install npm packages
npm install

# Install iOS pods
cd ios && pod install && cd ..
```

### 2. Get Google Client IDs (10 minutes)

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Create a new project (or select existing)
2. Enable **Google Sign-In API**
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**

Create **THREE** OAuth clients:
- ✅ **Android** (for Android app)
- ✅ **iOS** (for iOS app)  
- ✅ **Web** (for backend verification)

**For Android Client:**
```bash
# Get SHA-1 fingerprint
cd android
keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```
Copy the SHA-1 and use it when creating the Android OAuth client.

**Note down:**
- Android Client ID
- iOS Client ID
- Web Client ID

### 3. Update Configuration (2 minutes)

**File:** `components/authentication/SocialAuthentication.js`

Update lines 13-14:
```javascript
const GOOGLE_WEB_CLIENT_ID_DEV = "YOUR_WEB_CLIENT_ID_HERE"
const GOOGLE_WEB_CLIENT_ID_RELEASE = "YOUR_WEB_CLIENT_ID_RELEASE_HERE"
```

**File:** `ios/spartain/Info.plist`

Update line 101 with your **reversed iOS Client ID**:
```xml
<string>com.googleusercontent.apps.YOUR-IOS-CLIENT-ID</string>
```

### 4. Setup Backend (15 minutes)

Your backend needs to verify the Google ID token. Example code is in:
- `backend_example_google_auth.py`

**Quick Setup:**
```bash
# On your backend
pip install google-auth

# Add the endpoint from backend_example_google_auth.py
# Update GOOGLE_CLIENT_ID with your Web Client ID
```

### 5. Test It! (5 minutes)

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios
```

**Test Flow:**
1. Open the app
2. Go to Login screen
3. Tap "Sign in with Google" button
4. Select Google account
5. Should navigate to app!

## Expected Backend Response Format

Your backend endpoint `user/google_auth/` should return:

```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 123,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

## Troubleshooting 🔧

| Issue | Solution |
|-------|----------|
| "DEVELOPER_ERROR" on Android | SHA-1 doesn't match. Re-generate and update Google Console |
| iOS "No client ID" error | Update Info.plist with reversed iOS Client ID |
| Backend returns 400 | Web Client ID on backend doesn't match Google Console |
| "Play Services not available" | Use real device or emulator with Google Play |

## File Locations 📂

- **Setup Guide:** `GOOGLE_SIGNIN_SETUP.md` (comprehensive documentation)
- **Backend Example:** `backend_example_google_auth.py`
- **Quick Start:** This file
- **Component:** `components/authentication/SocialAuthentication.js`
- **Login Screen:** `pages/user/LoginNew.js`
- **Signup Screen:** `pages/user/SignupNew.js`

## Need More Help?

Check `GOOGLE_SIGNIN_SETUP.md` for detailed troubleshooting and advanced configuration.

---

**Total Setup Time:** ~30 minutes
**Difficulty:** Easy to Moderate


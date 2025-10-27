# Google Sign-In Authentication Flow

## Architecture Overview

```
┌──────────────────┐
│   Mobile App     │
│  (React Native)  │
└────────┬─────────┘
         │
         │ 1. User taps "Sign in with Google"
         │
         ▼
┌──────────────────┐
│  Google Sign-In  │
│   SDK/Service    │
└────────┬─────────┘
         │
         │ 2. Returns ID Token
         │
         ▼
┌──────────────────┐
│   Mobile App     │
│  (Receives Token)│
└────────┬─────────┘
         │
         │ 3. POST /user/google_auth/
         │    { code: idToken }
         │
         ▼
┌──────────────────┐
│  Your Backend    │
│   Django/REST    │
└────────┬─────────┘
         │
         │ 4. Verify token with Google
         │
         ▼
┌──────────────────┐
│   Google APIs    │
│ (Token Verify)   │
└────────┬─────────┘
         │
         │ 5. Return user info (email, name, etc.)
         │
         ▼
┌──────────────────┐
│  Your Backend    │
│ (Create/Get User)│
└────────┬─────────┘
         │
         │ 6. Generate JWT Token
         │    { access_token: "...", user: {...} }
         │
         ▼
┌──────────────────┐
│   Mobile App     │
│ (Save Token,     │
│  Navigate to App)│
└──────────────────┘
```

## Detailed Component Flow

### 1. Frontend Components

```
App.tsx
  └── Navigation
      └── Auth Stack
          ├── LoginNew.js
          │   └── SocialAuthentication.js
          │       ├── GoogleSigninButton
          │       └── AppleButton (iOS only)
          └── SignupNew.js
              └── SocialAuthentication.js
                  ├── GoogleSigninButton
                  └── AppleButton (iOS only)
```

### 2. Authentication Flow (Step by Step)

```javascript
// Step 1: User taps Google Sign-In button
<GoogleSigninButton onPress={handleGoogleSignIn} />

// Step 2: handleGoogleSignIn() called
const userInfo = await GoogleSignin.signIn();
// Returns: { idToken: "...", user: {...} }

// Step 3: Send idToken to backend
const response = await axios.post(
  backend_url + "user/google_auth/",
  { code: idToken }
);

// Step 4: Backend verifies token with Google
from google.oauth2 import id_token
idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

// Step 5: Backend creates/gets user and generates JWT
user = User.objects.get_or_create(email=idinfo['email'])
access_token = generate_jwt(user)

// Step 6: Frontend saves token and updates auth state
await AsyncStorage.setItem('token', response.data.access_token);
setAuthState({ authenticated: true, user: response.data.user });

// Step 7: Navigate to app
navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
```

## File Structure

```
spartain/
├── components/
│   └── authentication/
│       └── SocialAuthentication.js       ← Main social auth component
├── pages/
│   └── user/
│       ├── LoginNew.js                   ← Login screen (uses SocialAuth)
│       └── SignupNew.js                  ← Signup screen (uses SocialAuth)
├── helpers/
│   └── AuthContext.js                    ← Auth state management
├── config/
│   └── config.js                         ← Backend URL configuration
├── ios/
│   └── spartain/
│       └── Info.plist                    ← iOS Google URL scheme
├── android/
│   └── app/
│       ├── build.gradle                  ← Android config
│       └── src/main/AndroidManifest.xml  ← Android permissions
└── Documentation/
    ├── GOOGLE_SIGNIN_SETUP.md            ← Full setup guide
    ├── QUICK_START_GOOGLE_SIGNIN.md      ← Quick reference
    ├── SETUP_COMPLETE_NEXT_STEPS.md      ← What to do next
    ├── backend_example_google_auth.py    ← Backend code example
    └── GOOGLE_SIGNIN_FLOW.md             ← This file (architecture)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (Frontend)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LoginNew.js / SignupNew.js                                 │
│           │                                                  │
│           ├─> SocialAuthentication.js                       │
│           │         │                                        │
│           │         ├─> handleGoogleSignIn()                │
│           │         │         │                              │
│           │         │         ├─> GoogleSignin.signIn()     │
│           │         │         │   (Returns idToken)          │
│           │         │         │                              │
│           │         │         ├─> POST /user/google_auth/   │
│           │         │         │   { code: idToken }          │
│           │         │         │                              │
│           │         │         ├─> Receive JWT token         │
│           │         │         │                              │
│           │         │         ├─> AsyncStorage.setItem()    │
│           │         │         │                              │
│           │         │         └─> setAuthState()            │
│           │         │                                        │
│           │         └─> handleAppleSignIn()                 │
│           │                   (Same flow for Apple)          │
│           │                                                  │
│           └─> AuthContext                                   │
│                   └─> Global auth state                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Django)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  POST /user/google_auth/                                    │
│           │                                                  │
│           ├─> Receive idToken                               │
│           │                                                  │
│           ├─> Verify with Google                            │
│           │   id_token.verify_oauth2_token()                │
│           │                                                  │
│           ├─> Extract user info                             │
│           │   (email, name, google_id)                      │
│           │                                                  │
│           ├─> Create or get User                            │
│           │   User.objects.get_or_create()                  │
│           │                                                  │
│           ├─> Generate JWT token                            │
│           │   RefreshToken.for_user()                       │
│           │                                                  │
│           └─> Return response                               │
│               { access_token, user }                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google OAuth 2.0                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • Verifies idToken is valid                                │
│  • Returns user information                                 │
│  • Ensures token was issued by Google                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Requirements

### Google Cloud Console

```
Project: Your Project
  ├── APIs & Services
  │   └── Enabled APIs
  │       └── Google Sign-In API ✓
  │
  └── Credentials
      ├── Android OAuth 2.0 Client
      │   ├── Package Name: com.spartain
      │   └── SHA-1: [Your Debug SHA-1]
      │
      ├── iOS OAuth 2.0 Client
      │   └── Bundle ID: com.spartain
      │
      └── Web OAuth 2.0 Client
          └── (For backend verification)
```

### Mobile App Configuration

```javascript
// SocialAuthentication.js
GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID",
  offlineAccess: true,
  scopes: ['profile', 'email'],
});
```

```xml
<!-- ios/spartain/Info.plist -->
<key>CFBundleURLSchemes</key>
<array>
  <string>com.googleusercontent.apps.YOUR-IOS-CLIENT-ID</string>
</array>
```

### Backend Configuration

```python
# settings.py or .env
GOOGLE_CLIENT_ID = "YOUR_WEB_CLIENT_ID"

# views.py
from google.oauth2 import id_token
idinfo = id_token.verify_oauth2_token(
    token,
    requests.Request(),
    GOOGLE_CLIENT_ID
)
```

## Security Flow

```
┌────────────┐
│ Mobile App │
└─────┬──────┘
      │ 1. Request sign-in
      ▼
┌─────────────────┐
│ Google Sign-In  │
│     Service     │
└─────┬───────────┘
      │ 2. User authenticates
      │    with Google
      ▼
┌─────────────────┐
│  Google OAuth   │
│   (Verified)    │
└─────┬───────────┘
      │ 3. Return signed idToken
      ▼
┌────────────┐
│ Mobile App │
└─────┬──────┘
      │ 4. Send idToken to backend
      │    (Never store Google password!)
      ▼
┌─────────────────┐
│  Your Backend   │
└─────┬───────────┘
      │ 5. Verify idToken with Google
      │    (Ensures token is genuine)
      ▼
┌─────────────────┐
│  Google API     │
│  (Validates)    │
└─────┬───────────┘
      │ 6. Token valid, return user info
      ▼
┌─────────────────┐
│  Your Backend   │
│ (Create User,   │
│  Generate JWT)  │
└─────┬───────────┘
      │ 7. Send JWT to mobile
      ▼
┌────────────┐
│ Mobile App │
│ (Stores JWT,│
│  Navigates) │
└────────────┘
```

## Token Types Explained

### 1. Google ID Token
- **What**: JWT token from Google
- **Contains**: User info (email, name, picture, etc.)
- **Used for**: Verifying user identity with your backend
- **Lifespan**: ~1 hour
- **Security**: Signed by Google, verified by your backend

### 2. Your JWT Access Token
- **What**: JWT token from your backend
- **Contains**: User ID, permissions, etc.
- **Used for**: Authenticating API requests to your backend
- **Lifespan**: Configurable (e.g., 7 days)
- **Security**: Signed by your backend, stored in AsyncStorage

### 3. Refresh Token (Optional)
- **What**: Long-lived token
- **Contains**: User reference
- **Used for**: Getting new access tokens when they expire
- **Lifespan**: Long (e.g., 30 days)
- **Security**: Stored securely, can be revoked

## Error Handling Flow

```
User Taps Google Sign-In
        │
        ▼
    ┌───────────────────┐
    │  Check Platform   │
    └────┬─────────┬────┘
         │         │
    Android       iOS
         │         │
         ▼         ▼
┌──────────────┐  (No check needed)
│ hasPlayServices? │
└────┬─────┬───────┘
     │     │
    Yes    No → Show error
     │
     ▼
┌──────────────┐
│ GoogleSignin │
│   .signIn()  │
└────┬────┬────┘
     │    │
  Success  Fail
     │    │
     │    ├─> SIGN_IN_CANCELLED → (Silent, user cancelled)
     │    ├─> IN_PROGRESS → "Already signing in"
     │    ├─> PLAY_SERVICES_NOT_AVAILABLE → "Update Play Services"
     │    └─> Other → "Sign-in failed"
     │
     ▼
 Send to Backend
     │
     ▼
┌──────────────┐
│   Backend    │
│  Response    │
└────┬────┬────┘
     │    │
  Success  Fail
     │    │
     │    └─> Show error alert
     │
     ▼
Save Token & Navigate
```

## Testing Checklist

### Android
- [ ] SHA-1 fingerprint added to Google Console
- [ ] Android Client ID configured
- [ ] Test on real device with Google Play Services
- [ ] Test sign-in flow
- [ ] Test error cases (cancel, no network)

### iOS
- [ ] iOS Client ID created
- [ ] Reversed Client ID in Info.plist
- [ ] Test on real device or simulator
- [ ] Test sign-in flow
- [ ] Test Apple Sign-In (bonus)

### Backend
- [ ] Web Client ID configured
- [ ] Token verification working
- [ ] User creation/retrieval working
- [ ] JWT generation working
- [ ] Test with Postman/cURL first

### Integration
- [ ] Token saved to AsyncStorage
- [ ] AuthContext updated correctly
- [ ] Navigation to correct screen
- [ ] Onboarding flow respected
- [ ] Error messages user-friendly

---

**This flow diagram should help you understand the complete architecture!**


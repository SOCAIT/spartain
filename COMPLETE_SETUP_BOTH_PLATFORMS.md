# 🚀 Complete Setup - iOS & Android (30 Minutes)

## Why Different Setups for Each Platform?

Google needs to verify your app is legitimate:

- **iOS:** Uses Bundle ID + Apple certificates
- **Android:** Uses Package Name + SHA-1 fingerprint (your app's unique signature)

That's why you need **3 Client IDs total**:
1. Android Client ID
2. iOS Client ID  
3. Web Client ID (for backend)

---

## 📋 Prerequisites

### For Android Development:
```bash
# Check if Java is installed
java -version

# If not installed, install Java JDK:
# macOS: brew install openjdk@17
```

### For iOS Development:
- ✅ Xcode installed
- ✅ CocoaPods installed (already done)

---

## 🎯 Part 1: Get Your App Signatures

### Android SHA-1 Fingerprint

**Option A: If you have Java installed**
```bash
cd android
keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Look for the line that says:
```
SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:11:22:33:44
```

**Copy this SHA-1!**

**Option B: Using Android Studio**
1. Open Android Studio
2. Open your project: `/Users/socait/Desktop/MobileApps/spartain/android`
3. Click **Gradle** tab (right side)
4. Navigate to: `android → signingReport`
5. Double click `signingReport`
6. Copy the SHA1 from the output

**Option C: Install Java first (if needed)**
```bash
# macOS
brew install openjdk@17

# Then run Option A
```

### iOS Bundle ID

You can find this in Xcode or check your `Info.plist`. It's likely: `com.spartain`

To verify:
1. Open `ios/spartain.xcworkspace` in Xcode
2. Select project → Target "spartain"
3. Look at **Bundle Identifier**

---

## 🔑 Part 2: Create Google OAuth Clients (10 minutes)

### Go to Google Cloud Console

1. Visit: [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Name it: "SyntraFit" or whatever you prefer

### Enable Google Sign-In API

1. Click **"Enable APIs and Services"**
2. Search for: **"Google Sign-In API"** (or "Google+ API")
3. Click **Enable**

### Create OAuth 2.0 Client IDs

Click **Credentials** → **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client ID"**

---

### 1️⃣ Create Android Client ID

```
Application type: Android
Name: SyntraFit Android
Package name: com.spartain
SHA-1 certificate fingerprint: [Paste the SHA-1 from Part 1]
```

Click **CREATE**

**Save this Android Client ID** - You actually don't need it in your code (auto-linked), but good to have!

---

### 2️⃣ Create iOS Client ID

```
Application type: iOS
Name: SyntraFit iOS
Bundle ID: com.spartain (or whatever you found in Xcode)
```

Click **CREATE**

**📝 Copy the iOS Client ID** - looks like: `123456789-abc123xyz.apps.googleusercontent.com`

---

### 3️⃣ Create Web Client ID

```
Application type: Web application
Name: SyntraFit Backend
```

Click **CREATE**

**📝 Copy the Web Client ID** - looks like: `123456789-web123xyz.apps.googleusercontent.com`

---

## ⚙️ Part 3: Configure Your App (5 minutes)

### File 1: Update Web Client IDs

**Path:** `components/authentication/SocialAuthentication.js`

**Lines 13-14**, replace with YOUR Web Client ID:

```javascript
const GOOGLE_WEB_CLIENT_ID_DEV = "123456789-web123xyz.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID_RELEASE = "123456789-web123xyz.apps.googleusercontent.com"
```

*(Use the same Web Client ID for both dev and release for now)*

---

### File 2: Update iOS URL Scheme

**Path:** `ios/spartain/Info.plist`

**Line 101** (inside the `<array>` under `CFBundleURLSchemes`):

**Current:**
```xml
<string>com.googleusercontent.apps.1027987981704-rnglrifqhtar7o53i0jcvaiila060mfb</string>
```

**Replace with your REVERSED iOS Client ID:**

If your iOS Client ID is: `123456789-abc123xyz.apps.googleusercontent.com`

Then use: `com.googleusercontent.apps.123456789-abc123xyz`

**Example:**
```xml
<string>com.googleusercontent.apps.123456789-abc123xyz</string>
```

**That's it for app configuration!**

---

## 🔧 Part 4: Backend Setup (10 minutes)

Your backend needs to verify Google tokens.

### Install Package

```bash
pip install google-auth
```

### Add Endpoint

Create or update your Django view (see `backend_example_google_auth.py` for complete code):

```python
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

# Use your Web Client ID
GOOGLE_CLIENT_ID = "123456789-web123xyz.apps.googleusercontent.com"

@api_view(['POST'])
def google_auth(request):
    token = request.data.get('code')  # This is the idToken from mobile
    
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Extract user info
        email = idinfo['email']
        name = idinfo.get('name', '')
        google_id = idinfo['sub']
        
        # Create or get user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': name.split()[0] if name else '',
            }
        )
        
        # Generate your JWT token
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        return Response({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })
        
    except ValueError as e:
        return Response({'error': 'Invalid token'}, status=400)
```

### Add to URLs

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('user/google_auth/', views.google_auth, name='google_auth'),
]
```

---

## ✅ Part 5: Test Both Platforms

### Test iOS

```bash
npm run ios
```

1. App opens
2. Navigate to Login screen
3. Tap **"Sign in with Google"** button
4. Select Google account
5. ✅ Should navigate to app!

### Test Android

```bash
npm run android
```

1. App opens
2. Navigate to Login screen
3. Tap **"Sign in with Google"** button
4. Select Google account
5. ✅ Should navigate to app!

---

## 📊 Configuration Summary

| What | iOS Value | Android Value | Where Used |
|------|-----------|---------------|------------|
| Package/Bundle ID | `com.spartain` | `com.spartain` | Google Console |
| SHA-1 | ❌ Not needed | ✅ Required | Google Console (Android Client) |
| Client ID Type | iOS Client ID | Android Client ID | Google Console |
| Web Client ID | ✅ Required | ✅ Required | Your code + backend |
| URL Scheme | ✅ Reversed iOS ID | ❌ Not needed | Info.plist |

---

## 🎯 Checklist

```
[ ] Install Java (for Android SHA-1)
[ ] Get Android SHA-1 fingerprint
[ ] Get iOS Bundle ID
[ ] Create Google Cloud project
[ ] Enable Google Sign-In API
[ ] Create Android OAuth Client (with SHA-1)
[ ] Create iOS OAuth Client (with Bundle ID)
[ ] Create Web OAuth Client
[ ] Update SocialAuthentication.js (line 13-14) with Web Client ID
[ ] Update Info.plist (line 101) with reversed iOS Client ID
[ ] Install google-auth on backend
[ ] Add google_auth endpoint to backend
[ ] Test on iOS
[ ] Test on Android
```

---

## 🐛 Troubleshooting

### Android: "DEVELOPER_ERROR" or Code 10

**Problem:** SHA-1 doesn't match

**Solution:**
1. Re-generate SHA-1: `cd android && keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android`
2. Update in Google Console
3. Wait 5-10 minutes for changes to propagate

### iOS: "No client ID" or "Failed to get token"

**Problem:** Wrong Client ID in code or Info.plist

**Solution:**
1. Check `SocialAuthentication.js` line 13-14 has Web Client ID
2. Check `Info.plist` line 101 has reversed iOS Client ID
3. Make sure reversed format is correct: `com.googleusercontent.apps.YOUR-IOS-CLIENT-ID`

### Backend: 400 Bad Request

**Problem:** Token verification failed

**Solution:**
1. Backend must use the **Web Client ID** (not iOS or Android ID)
2. Check `GOOGLE_CLIENT_ID` in backend matches Google Console
3. Make sure `google-auth` package is installed

### Android: "Play Services not available"

**Problem:** Emulator doesn't have Google Play Services

**Solution:**
- Use a real Android device, OR
- Use an emulator with Google Play (Pixel devices work best)

---

## 📱 Platform Differences

### What's Same for Both:
- ✅ Same mobile code (`SocialAuthentication.js`)
- ✅ Same backend endpoint
- ✅ Same Web Client ID
- ✅ Same login flow

### What's Different:
- ❌ Different Client IDs in Google Console
- ❌ iOS needs URL scheme in Info.plist
- ❌ Android needs SHA-1 fingerprint
- ❌ Platform-specific buttons (Apple only on iOS)

---

## 🎉 Success!

Once configured, your users on **BOTH iOS and Android** can:
- Sign in with Google (one tap!)
- Sign in with Apple (iOS only)
- Use traditional email/password
- Seamless authentication experience

---

## 💡 Pro Tips

1. **For Production:** Use different Client IDs for dev and release builds
2. **For Release:** Get release SHA-1 with your production keystore
3. **Testing:** Use real devices when possible for most accurate testing
4. **Debugging:** Check backend logs and mobile console logs for detailed errors

---

## 📚 Reference

- Full implementation: `backend_example_google_auth.py`
- Architecture: `GOOGLE_SIGNIN_FLOW.md`
- iOS only: `IOS_ONLY_QUICK_SETUP.md`

---

**Time to Complete:** 30-45 minutes  
**Difficulty:** Moderate  
**Platforms:** Both iOS & Android ✅

Good luck! You've got this! 🚀


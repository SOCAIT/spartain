# 📱 iOS Only - Google Sign-In Setup (10 Minutes)

## Why You Don't Need Both Platforms

**You're absolutely right!** You only need to configure the platform you're developing on:

- **Developing on iOS?** → Only set up iOS configuration
- **Developing on Android?** → Only set up Android configuration
- **Building for both later?** → Set up both when you need them

For now, let's just get **iOS working** since that's what you're using!

---

## ✅ What's Already Done

1. ✅ All packages installed
2. ✅ iOS CocoaPods installed
3. ✅ UI components ready (Login/Signup screens)
4. ✅ Code implementation complete

## 🎯 What You Need (iOS Only - 10 Minutes)

### Step 1: Get Google Client IDs (5 minutes)

You need **TWO** Client IDs from Google:

1. **iOS Client ID** - For the iOS app
2. **Web Client ID** - For backend verification

#### How to Get Them:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Sign-In API**:
   - Click "Enable APIs and Services"
   - Search "Google Sign-In API"
   - Click Enable

4. Go to **Credentials** → Click **"+ Create Credentials"** → **"OAuth 2.0 Client ID"**

#### Create iOS Client ID:

```
Application type: iOS
Name: SyntraFit iOS
Bundle ID: com.spartain (or check your Xcode project)
```

Click **Create** → Copy the **iOS Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)

#### Create Web Client ID:

```
Application type: Web application
Name: SyntraFit Backend
```

Click **Create** → Copy the **Web Client ID**

**That's it! No Android setup needed!**

---

### Step 2: Update 2 Files (2 minutes)

#### File 1: Update Client IDs

**Path:** `components/authentication/SocialAuthentication.js`

Find lines **13-14** and replace with your Client IDs:

```javascript
// Replace these with YOUR Client IDs from Google Console
const GOOGLE_WEB_CLIENT_ID_DEV = "YOUR_WEB_CLIENT_ID_HERE"
const GOOGLE_WEB_CLIENT_ID_RELEASE = "YOUR_WEB_CLIENT_ID_HERE"
```

**Example:**
```javascript
const GOOGLE_WEB_CLIENT_ID_DEV = "123456-abc.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID_RELEASE = "123456-abc.apps.googleusercontent.com"
```

#### File 2: Update iOS URL Scheme

**Path:** `ios/spartain/Info.plist`

Find line **101** (inside `<array>` under `CFBundleURLSchemes`) and replace:

**Current:**
```xml
<string>com.googleusercontent.apps.1027987981704-rnglrifqhtar7o53i0jcvaiila060mfb</string>
```

**Replace with your REVERSED iOS Client ID:**

If your iOS Client ID is: `123456-abc.apps.googleusercontent.com`

Then use: `com.googleusercontent.apps.123456-abc`

**Example:**
```xml
<string>com.googleusercontent.apps.123456-abc</string>
```

**That's it! Just 2 files!**

---

### Step 3: Backend Setup (3 minutes)

Your backend needs to verify Google tokens. Quick setup:

```bash
# Install Google auth library
pip install google-auth
```

Add this endpoint to your backend (full code in `backend_example_google_auth.py`):

```python
from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = "YOUR_WEB_CLIENT_ID_HERE"  # Use Web Client ID

@api_view(['POST'])
def google_auth(request):
    token = request.data.get('code')
    
    # Verify token with Google
    idinfo = id_token.verify_oauth2_token(
        token, 
        requests.Request(), 
        GOOGLE_CLIENT_ID
    )
    
    email = idinfo['email']
    name = idinfo.get('name', '')
    
    # Create or get user
    user, created = User.objects.get_or_create(email=email)
    
    # Generate JWT
    access_token = generate_jwt_token(user)
    
    return Response({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })
```

---

### Step 4: Test on iOS! (2 minutes)

```bash
# Run on iOS
npm run ios
```

**Test Flow:**
1. App opens
2. Navigate to Login screen
3. You'll see:
   - 📧 Email/Password login
   - **"OR"** divider
   - 🔵 **Google Sign-In button**
   - 🍎 **Apple Sign-In button** (bonus!)
4. Tap "Sign in with Google"
5. Select your Google account
6. ✅ You're in!

---

## 🎯 Summary - What You Actually Need

| Item | iOS | Android | Why |
|------|-----|---------|-----|
| Google iOS Client ID | ✅ Yes | ❌ No | For iOS app |
| Google Web Client ID | ✅ Yes | ❌ No | For backend |
| Google Android Client ID | ❌ No | ✅ Yes | Only if building Android |
| SHA-1 Fingerprint | ❌ No | ✅ Yes | Only for Android |
| iOS URL Scheme | ✅ Yes | ❌ No | In Info.plist |
| Backend Endpoint | ✅ Yes | ✅ Yes | Same for both |

**For iOS only: You need 2 Client IDs, 2 file updates, and a backend endpoint. That's it!**

---

## 🤔 Why Do Docs Mention Both?

The comprehensive guides mention both platforms because:
- Some developers deploy to both iOS and Android
- The setup is similar but requires platform-specific IDs
- Better to document everything once

**But you can absolutely ignore Android setup if you're only on iOS!**

---

## ⚡ Quick Checklist (iOS Only)

```
[ ] Create Google Cloud project
[ ] Enable Google Sign-In API
[ ] Create iOS OAuth Client ID
[ ] Create Web OAuth Client ID
[ ] Update SocialAuthentication.js with Web Client ID
[ ] Update Info.plist with reversed iOS Client ID
[ ] Add backend endpoint (google_auth)
[ ] Test: npm run ios
[ ] Tap Google Sign-In button
[ ] Celebrate! 🎉
```

**Time: ~10 minutes**

---

## 🐛 iOS-Only Troubleshooting

### "No client ID" error
**Fix:** Check line 13-14 in `SocialAuthentication.js` has your Web Client ID

### "Failed to get authentication token"
**Fix:** Check line 101 in `Info.plist` has reversed iOS Client ID

### Backend returns 400
**Fix:** Make sure backend uses the same Web Client ID

---

## 📱 What About Android Later?

When you want to add Android support later:

1. Create Android OAuth Client ID in Google Console
2. Get SHA-1 fingerprint: 
   ```bash
   cd android
   keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
3. Add SHA-1 to Google Console
4. Done! No code changes needed.

**But you don't need this now!**

---

## 🎉 iOS Bonus: Apple Sign-In

Apple Sign-In already works on iOS! Just add the capability in Xcode:

1. Open `ios/spartain.xcworkspace` in Xcode
2. Select your target → **Signing & Capabilities**
3. Click **+ Capability**
4. Add **Sign in with Apple**
5. Done! The button appears automatically on iOS

**No configuration needed for Apple!**

---

## 💡 Understanding the Setup

### Why Two Client IDs?

1. **iOS Client ID** → Used by the iOS app to request sign-in
2. **Web Client ID** → Used by backend to verify the token is real

### Why Reversed Client ID in Info.plist?

iOS uses custom URL schemes to return from Google Sign-In back to your app. The reversed format is Apple's standard for URL schemes.

**Example:**
- iOS Client ID: `123456.apps.googleusercontent.com`
- Reversed: `com.googleusercontent.apps.123456`

This tells iOS: "When Google is done, open my app using this URL scheme"

---

## 🚀 You're Ready!

Just fill in your 2 Client IDs and you're done. The code is ready, packages are installed, everything works!

**Total Time:** 10 minutes  
**Platform:** iOS only  
**Complexity:** Easy!

---

**Next:** Open Google Cloud Console and grab those 2 Client IDs! 🎯


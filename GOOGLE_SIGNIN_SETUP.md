# Google Sign-In Setup Guide for React Native

## Overview
This guide will help you complete the setup of Google Sign-In for your SyntraFit mobile app on both iOS and Android platforms.

## ✅ What's Already Done

1. ✅ Google Sign-In packages added to `package.json`
2. ✅ SocialAuthentication component created and integrated into Login/Signup screens
3. ✅ iOS Info.plist configured with URL scheme
4. ✅ Basic Google Sign-In UI added to authentication screens

## 🚀 Steps to Complete Setup

### Step 1: Install Dependencies

Run the following commands to install the necessary packages:

```bash
npm install
cd ios && pod install && cd ..
```

### Step 2: Google Cloud Console Setup

#### Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing project
3. Enable the **Google+ API** (or **Google Sign-In API**)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**

#### For Android:

1. Select **Android** as application type
2. Enter your package name: `com.spartain`
3. Get your SHA-1 certificate fingerprint:
   
   **Debug SHA-1:**
   ```bash
   cd android
   keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
   
   **Release SHA-1 (for production):**
   ```bash
   keytool -list -v -keystore /path/to/your/keystore.jks -alias your-alias
   ```

4. Paste the SHA-1 fingerprint
5. Click **Create**
6. Copy the **Client ID** that's generated

#### For iOS:

1. Select **iOS** as application type
2. Enter your bundle identifier (should be something like `com.spartain` or check in Xcode)
3. Click **Create**
4. Copy the **iOS Client ID**

#### For Web Client ID:

1. Also create a **Web application** OAuth client
2. This is needed for the backend verification
3. Copy the **Web Client ID**

### Step 3: Update Configuration

Update `/Users/socait/Desktop/MobileApps/spartain/components/authentication/SocialAuthentication.js`:

Replace the client IDs at the top of the file with your newly created credentials:

```javascript
// Replace these with your actual Client IDs from Google Console
const GOOGLE_ANDROID_CLIENT_ID_DEV = "YOUR_ANDROID_CLIENT_ID_DEV"
const GOOGLE_WEB_CLIENT_ID_DEV = "YOUR_WEB_CLIENT_ID_DEV"

const GOOGLE_WEB_CLIENT_ID_RELEASE = "YOUR_WEB_CLIENT_ID_RELEASE"
const GOOGLE_ANDROID_CLIENT_ID_RELEASE = "YOUR_ANDROID_CLIENT_ID_RELEASE"
```

### Step 4: iOS-Specific Configuration

The iOS URL scheme has already been added to `Info.plist`. However, you need to update it with your actual iOS Client ID:

1. Open `/Users/socait/Desktop/MobileApps/spartain/ios/spartain/Info.plist`
2. Find the `CFBundleURLSchemes` section (around line 100)
3. Replace the string with your **reversed iOS Client ID**:
   
   If your iOS Client ID is: `123456789-abc123.apps.googleusercontent.com`
   
   The reversed format should be: `com.googleusercontent.apps.123456789-abc123`

### Step 5: Android-Specific Configuration

For Android, you may need to add the Google Play Services dependency (though it's usually auto-linked):

If you encounter issues, manually add to `android/app/build.gradle`:

```gradle
dependencies {
    // ... existing dependencies
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

### Step 6: Backend Setup

Your backend endpoint `user/google_auth/` needs to verify the Google ID token. Here's what your backend should do:

```python
# Django example
from google.oauth2 import id_token
from google.auth.transport import requests

def google_auth(request):
    token = request.data.get('code')  # This is the idToken
    
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            "YOUR_WEB_CLIENT_ID"
        )
        
        # Get user info
        email = idinfo['email']
        name = idinfo['name']
        google_id = idinfo['sub']
        
        # Create or get user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': name.split()[0] if name else '',
            }
        )
        
        # Generate JWT token
        access_token = generate_access_token(user)
        
        return Response({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })
        
    except ValueError:
        return Response({'error': 'Invalid token'}, status=400)
```

Install required package:
```bash
pip install google-auth
```

### Step 7: Test the Implementation

#### For Android:

```bash
npm run android
```

1. Navigate to Login/Signup screen
2. Tap the Google Sign-In button
3. Select a Google account
4. Verify authentication works

#### For iOS:

```bash
npm run ios
```

1. Navigate to Login/Signup screen
2. Tap the Google Sign-In button
3. Select a Google account
4. Verify authentication works

## 🐛 Troubleshooting

### Android Issues

**Error: "DEVELOPER_ERROR" or "10:"**
- Your SHA-1 certificate doesn't match what's in Google Console
- Re-generate SHA-1 and update Google Console
- Wait 5-10 minutes for changes to propagate

**Error: "SIGN_IN_CANCELLED"**
- User cancelled the sign-in
- This is normal behavior

**Error: "PLAY_SERVICES_NOT_AVAILABLE"**
- Google Play Services not installed on device/emulator
- Use a device/emulator with Google Play Services

### iOS Issues

**Error: "No client ID specified"**
- Make sure you've configured GoogleSignin in SocialAuthentication.js
- Verify the webClientId is correct

**Error: URL scheme not working**
- Verify the reversed Client ID in Info.plist matches your iOS Client ID
- Make sure there are no typos

**Error: "The operation couldn't be completed"**
- iOS Client ID might be incorrect
- Check that bundle identifier matches what's in Google Console

### General Issues

**Backend returns error**
- Verify your backend endpoint is receiving the idToken
- Make sure the Web Client ID on backend matches Google Console
- Check that google-auth library is installed on backend

**Token verification fails**
- The Web Client ID used in backend verification must match
- Token might have expired (tokens expire after 1 hour)
- Make sure you're using `idToken` not `accessToken`

## 📱 Apple Sign-In (Bonus)

Your app already has Apple Sign-In configured! To enable it:

1. In Xcode, go to your project → **Signing & Capabilities**
2. Click **+ Capability**
3. Add **Sign in with Apple**
4. Make sure your Apple Developer account has the capability enabled

That's it! Apple Sign-In should work on iOS 13+.

## 🔐 Security Notes

1. **Never commit** your keystore files or production credentials to git
2. Use different Client IDs for development and production
3. Store production keys in environment variables or secure key management
4. Implement rate limiting on your backend auth endpoint
5. Validate tokens on the backend, never trust client-side only

## 📚 Additional Resources

- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React Native Authentication Best Practices](https://reactnative.dev/docs/security)

## ✨ What's Working Now

After following this guide, your users will be able to:
- ✅ Sign in with Google on both iOS and Android
- ✅ Sign in with Apple (iOS only, iOS 13+)
- ✅ Traditional email/password authentication
- ✅ Seamless navigation to app after social authentication

---

**Need Help?** If you encounter issues not covered here, check the packages' GitHub issues or feel free to ask for assistance.


# 🎯 OTP Password Reset - Final Working Endpoints

## ✅ CONFIRMED WORKING - Tested & Verified!

### Your OTP Password Reset API Endpoints:

```
POST http://localhost:8081/api/auth/forgot-password/
POST http://localhost:8081/api/user/verify-otp/
POST http://localhost:8081/api/user/reset-password/
```

**Important:** All endpoints are under `/api/` prefix!

---

## 📝 Complete Flow (React Native Frontend)

### Step 1: Send OTP to Email

**Endpoint:** `POST /api/auth/forgot-password/`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Verification code sent to your email.",
  "success": true
}
```

**Error Response (400):**
```json
{
  "email": ["User with this email does not exist."]
}
```

---

### Step 2: Verify OTP Code

**Endpoint:** `POST /api/user/verify-otp/`

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "OTP verified successfully.",
  "success": true
}
```

**Error Responses:**

**Expired OTP (400):**
```json
{
  "error": "Verification code has expired."
}
```

**Too many attempts (400):**
```json
{
  "error": "Too many failed attempts. Please request a new code."
}
```

**Wrong OTP (400):**
```json
{
  "error": "Invalid code. 4 attempts remaining."
}
```

---

### Step 3: Reset Password

**Endpoint:** `POST /api/user/reset-password/`

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "MyNewPassword123",
  "confirm_password": "MyNewPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully.",
  "success": true
}
```

**Error Responses:**

**OTP not verified (400):**
```json
{
  "error": "Verification code not verified."
}
```

**Passwords don't match (400):**
```json
{
  "non_field_errors": ["Passwords do not match."]
}
```

---

## 🧪 Quick Test Commands

```bash
# Test 1: Send OTP
curl -X POST http://localhost:8081/api/auth/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'

# Test 2: Verify OTP (replace 123456 with actual OTP from email)
curl -X POST http://localhost:8081/api/user/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","otp":"123456"}'

# Test 3: Reset Password
curl -X POST http://localhost:8081/api/user/reset-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "otp":"123456",
    "new_password":"NewPassword123",
    "confirm_password":"NewPassword123"
  }'
```

---

## 🔐 Security Features

✅ **OTP Expiration:** 5 minutes
✅ **Attempt Limiting:** Max 5 attempts per OTP
✅ **Auto-cleanup:** Old OTPs deleted when requesting new one
✅ **Verification Required:** Must verify OTP before resetting password
✅ **Auto-delete:** OTP deleted after successful password reset
✅ **Password Hashing:** Uses Django's PBKDF2 hashing
✅ **Email Validation:** Checks if user exists before sending OTP

---

## 📊 Database Table Status

**Table:** `password_reset_otp`

| Column       | Type         | Description                  |
|-------------|--------------|------------------------------|
| id          | bigint       | Primary key                  |
| email       | varchar(254) | User's email                 |
| otp         | varchar(6)   | 6-digit verification code    |
| created_at  | datetime(6)  | When OTP was created         |
| is_verified | tinyint(1)   | Whether OTP was verified     |
| attempts    | int          | Number of failed attempts    |

✅ **Table created and verified working!**

---

## 🎯 React Native Integration Example

```javascript
// Step 1: Send OTP
const sendOTP = async (email) => {
  try {
    const response = await fetch('http://your-server:8081/api/auth/forgot-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      // Show OTP input screen
      navigation.navigate('VerifyOTP', { email });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

// Step 2: Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch('http://your-server:8081/api/user/verify-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (data.success) {
      // Show reset password screen
      navigation.navigate('ResetPassword', { email, otp });
    } else {
      Alert.alert('Error', data.error);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};

// Step 3: Reset Password
const resetPassword = async (email, otp, newPassword, confirmPassword) => {
  try {
    const response = await fetch('http://your-server:8081/api/user/reset-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        otp, 
        new_password: newPassword, 
        confirm_password: confirmPassword 
      })
    });
    const data = await response.json();
    if (data.success) {
      Alert.alert('Success', 'Password reset successfully!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', data.error);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  }
};
```

---

## 📧 Email Configuration

Emails are sent from: `noreply@socait.com`

Email template:
```
Hello,

Your password reset verification code is: 123456

This code will expire in 5 minutes.

If you didn't request this, please ignore this email.

Best regards,
Spartain Team
```

---

## ✅ Summary

Your OTP password reset system is:
- ✅ **Fully implemented**
- ✅ **Database table created**
- ✅ **All 3 endpoints tested and working**
- ✅ **Email sending configured**
- ✅ **Auto-cleanup working**
- ✅ **Security features in place**
- ✅ **Ready for production use!**

**Production URL:** Replace `http://localhost:8081` with your production server URL

**Status:** 🟢 **LIVE AND WORKING!**


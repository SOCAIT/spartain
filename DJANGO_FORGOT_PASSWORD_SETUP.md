# Django Forgot Password Setup Guide

## Overview
Your React Native frontend expects 3 API endpoints for password reset:
1. `POST /auth/forgot-password/` - Send OTP to email
2. `POST /user/verify-otp/` - Verify OTP code
3. `POST /user/reset-password/` - Reset password with OTP

## Step 1: Install Required Packages

```bash
pip install django-rest-framework
pip install django-cors-headers
pip install python-dotenv
pip install celery redis  # For async email sending
```

## Step 2: Update Django Settings

```python
# settings.py

INSTALLED_APPS = [
    # ... existing apps
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this
    # ... other middleware
]

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your email provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')

# CORS Settings (adjust for your frontend)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:3000",
    # Add your frontend URL
]

# OTP Settings
OTP_EXPIRY_MINUTES = 5  # OTP valid for 5 minutes
OTP_LENGTH = 6
```

## Step 3: Create OTP Model

```python
# models.py

from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
import random
import string

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'password_reset_otp'
    
    def is_expired(self):
        expiry_time = self.created_at + timedelta(minutes=5)  # 5 minutes
        return timezone.now() > expiry_time
    
    def is_valid_attempt(self):
        return not self.is_expired() and self.attempts < 5  # Max 5 attempts
    
    @staticmethod
    def generate_otp():
        return ''.join(random.choices(string.digits, k=6))
    
    def __str__(self):
        return f"{self.email} - {self.otp}"
```

## Step 4: Create Serializers

```python
# serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        # Check if user exists
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField(min_length=6)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
```

## Step 5: Create Views/API Endpoints

```python
# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import PasswordResetOTP
from .serializers import ForgotPasswordSerializer, VerifyOTPSerializer, ResetPasswordSerializer

@api_view(['POST'])
def forgot_password(request):
    """
    POST /auth/forgot-password/
    Send OTP to user's email
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Generate OTP
        otp_code = PasswordResetOTP.generate_otp()
        
        # Delete old OTPs for this email
        PasswordResetOTP.objects.filter(email=email).delete()
        
        # Create new OTP record
        otp_obj = PasswordResetOTP.objects.create(
            email=email,
            otp=otp_code
        )
        
        # Send email
        try:
            send_mail(
                subject='Password Reset - Verification Code',
                message=f'''
                Hello,
                
                Your password reset verification code is: {otp_code}
                
                This code will expire in 5 minutes.
                
                If you didn't request this, please ignore this email.
                
                Best regards,
                Spartain Team
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            return Response({
                'message': 'Verification code sent to your email.',
                'success': True
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Email error: {str(e)}")
            return Response({
                'error': 'Failed to send email. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_otp(request):
    """
    POST /user/verify-otp/
    Verify OTP code
    """
    serializer = VerifyOTPSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        try:
            otp_obj = PasswordResetOTP.objects.get(email=email)
            
            # Check if expired
            if otp_obj.is_expired():
                otp_obj.delete()
                return Response({
                    'error': 'Verification code has expired.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check attempt limit
            if not otp_obj.is_valid_attempt():
                otp_obj.delete()
                return Response({
                    'error': 'Too many failed attempts. Please request a new code.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check OTP
            if otp_obj.otp == otp:
                otp_obj.is_verified = True
                otp_obj.save()
                return Response({
                    'message': 'OTP verified successfully.',
                    'success': True
                }, status=status.HTTP_200_OK)
            else:
                otp_obj.attempts += 1
                otp_obj.save()
                remaining = 5 - otp_obj.attempts
                return Response({
                    'error': f'Invalid code. {remaining} attempts remaining.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except PasswordResetOTP.DoesNotExist:
            return Response({
                'error': 'No verification code found. Please request a new one.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reset_password(request):
    """
    POST /user/reset-password/
    Reset password with verified OTP
    """
    serializer = ResetPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']
        
        try:
            otp_obj = PasswordResetOTP.objects.get(email=email, otp=otp)
            
            # Check if OTP is verified
            if not otp_obj.is_verified:
                return Response({
                    'error': 'Verification code not verified.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get user and update password
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            # Delete OTP record
            otp_obj.delete()
            
            return Response({
                'message': 'Password reset successfully.',
                'success': True
            }, status=status.HTTP_200_OK)
        
        except PasswordResetOTP.DoesNotExist:
            return Response({
                'error': 'Invalid verification code or email.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            return Response({
                'error': 'User not found.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## Step 6: Create URL Patterns

```python
# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('auth/forgot-password/', views.forgot_password, name='forgot-password'),
    path('user/verify-otp/', views.verify_otp, name='verify-otp'),
    path('user/reset-password/', views.reset_password, name='reset-password'),
]
```

## Step 7: Create Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 8: Environment Variables (.env file)

```
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_specific_password
BACKEND_URL=your_backend_url
```

## Step 9: Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_HOST_PASSWORD`

## Testing

### Test 1: Send OTP
```bash
curl -X POST http://localhost:8000/auth/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Test 2: Verify OTP
```bash
curl -X POST http://localhost:8000/user/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

### Test 3: Reset Password
```bash
curl -X POST http://localhost:8000/user/reset-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "otp":"123456",
    "new_password":"newpassword123",
    "confirm_password":"newpassword123"
  }'
```

## Troubleshooting

### OTP not sending
- Check EMAIL_BACKEND in settings
- Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
- Check email logs: `python manage.py shell`

### CORS errors
- Add your frontend URL to CORS_ALLOWED_ORIGINS
- Ensure cors middleware is installed

### Database errors
- Run migrations: `python manage.py migrate`
- Check if PasswordResetOTP model is in INSTALLED_APPS app

## Security Notes

✅ **Already implemented:**
- OTP expiration (5 minutes)
- Attempt limiting (5 attempts)
- Password hashing with Django's set_password()
- Email validation

🔒 **Consider adding:**
- Rate limiting on OTP requests
- Phone number verification as 2FA
- Audit logging for password resets
- HTTPS only in production

## Summary

Your forgot password flow:
1. User enters email → `forgot_password()` generates & sends OTP
2. User enters OTP → `verify_otp()` verifies the code
3. User enters new password → `reset_password()` updates password
4. App redirects to login

The backend validates email existence, OTP validity, and password requirements at each step.


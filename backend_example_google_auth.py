"""
Backend Implementation Example for Google & Apple Sign-In
Django REST Framework + JWT

Installation:
pip install google-auth djangorestframework djangorestframework-simplejwt
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

# Your Google Web Client ID from Google Cloud Console
GOOGLE_CLIENT_ID = "YOUR_WEB_CLIENT_ID_HERE"

@api_view(['POST'])
def google_auth(request):
    """
    Authenticate user with Google ID token
    
    Expected request body:
    {
        "code": "google_id_token_here"
    }
    
    Response:
    {
        "access_token": "jwt_token",
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com"
        }
    }
    """
    try:
        token = request.data.get('code')
        
        if not token:
            return Response(
                {'error': 'Token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify the Google ID token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                GOOGLE_CLIENT_ID
            )
            
            # Token is valid, get user info
            email = idinfo['email']
            name = idinfo.get('name', '')
            google_id = idinfo['sub']
            picture = idinfo.get('picture', '')
            
        except ValueError as e:
            # Invalid token
            return Response(
                {'error': 'Invalid token', 'detail': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or get user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],  # Use email prefix as username
                'first_name': name.split()[0] if name else '',
                'last_name': ' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
            }
        )
        
        # If user exists but username was created differently, update email
        if not created and user.email != email:
            user.email = email
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Get or create user profile (if you have a UserProfile model)
        # profile, _ = UserProfile.objects.get_or_create(user=user)
        # if picture and not profile.profile_photo:
        #     profile.profile_photo = picture
        #     profile.save()
        
        return Response({
            'access_token': access_token,
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': 'Authentication failed', 'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def apple_auth(request):
    """
    Authenticate user with Apple ID token
    
    Expected request body:
    {
        "code": "apple_identity_token_here",
        "email": "user@privaterelay.appleid.com",  # May be null on subsequent logins
        "fullName": {
            "givenName": "John",
            "familyName": "Doe"
        }
    }
    
    Response:
    {
        "access_token": "jwt_token",
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com"
        }
    }
    """
    try:
        token = request.data.get('code')
        email = request.data.get('email')
        full_name = request.data.get('fullName', {})
        
        if not token:
            return Response(
                {'error': 'Token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # For production, you should verify the Apple identity token
        # This requires additional setup with Apple's public keys
        # For now, we'll implement a basic version
        
        # TODO: Verify Apple token properly
        # See: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user
        
        # Extract user info
        # Apple only provides email and name on first sign-in
        # On subsequent sign-ins, you need to look up user by their Apple user ID
        
        if not email:
            # User has signed in before, need to decode token to get Apple user ID
            # For this example, we'll return an error
            return Response(
                {'error': 'Email not provided. This might be a subsequent login.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get name from fullName object
        first_name = full_name.get('givenName', '') if full_name else ''
        last_name = full_name.get('familyName', '') if full_name else ''
        
        # Create or get user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        return Response({
            'access_token': access_token,
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': 'Authentication failed', 'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Add these to your urls.py:
"""
from django.urls import path
from . import views

urlpatterns = [
    path('user/google_auth/', views.google_auth, name='google_auth'),
    path('user/apple_auth/', views.apple_auth, name='apple_auth'),
]
"""

# Environment variable setup (add to .env):
"""
GOOGLE_CLIENT_ID=your_web_client_id_here
"""

# Settings.py additions:
"""
import os

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

# JWT Settings (if using djangorestframework-simplejwt)
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
"""


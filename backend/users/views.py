from django.shortcuts import render
from django.http import JsonResponse
from .models import CustomUser, EmailOTP
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone  # Import timezone from Django
from datetime import timedelta

# Create your views here. Handles API requests for users

@api_view(['POST'])
def signup(request):
    """Create a new user."""
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    # Check if email is verified
    try:
        email_otp = EmailOTP.objects.filter(email=email).order_by('-created_at').first()
        if not email_otp:
            return Response({"error": "Email not verified. Please verify your email first."}, status=400)
    except Exception:
        return Response({"error": "Email not verified. Please verify your email first."}, status=400)

    try:
        user = CustomUser.objects.create_user(
            username=email,
            email=email, 
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_verified=True
        )
        user.save()
        return Response({"message": "User created successfully."})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def send_email_verification(request):
    """Generate and send OTP to the user's email."""
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        # Check if user already exists
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists"}, status=400)
        
        # Generate OTP
        email_otp = EmailOTP(email=email)
        otp = email_otp.generate_otp()
        email_otp.save()
        
        # Send OTP via email
        subject = 'Just-Ease Email Verification'
        message = f'Your verification OTP is: {otp}. It will expire in 10 minutes.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        
        return Response({"message": "Verification OTP sent to your email."})
    except Exception as e:
        return Response({"error": str(e)}, status=500)



@api_view(['POST'])
def verify_email_otp(request):
    """Verify OTP entered by the user."""
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)

    try:
        # Get the latest OTP for this email
        email_otp = EmailOTP.objects.filter(email=email).order_by('-created_at').first()
        
        if not email_otp:
            return Response({"error": "No OTP found for this email"}, status=400)
        
        if email_otp.is_expired():
            return Response({"error": "OTP has expired. Please request a new one."}, status=400)
        
        if email_otp.otp_code != otp:
            return Response({"error": "Invalid OTP"}, status=400)
        
        # OTP is valid
        return Response({"message": "Email verified successfully."})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def login_user(request):
    """Authenticate a user and return a token."""
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    try:
        # Check if user exists
        if not CustomUser.objects.filter(email=email).exists():
            return Response({"error": "No user found with this email"}, status=401)
        
        # Get the user object
        user = CustomUser.objects.get(email=email)
        
        # Check if user is verified
        if not user.is_verified:
            return Response({"error": "Email not verified. Please verify your email first."}, status=401)
        
        # Check password
        if not user.check_password(password):
            return Response({"error": "Incorrect password"}, status=401)
        
        # Generate token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "Login successful",
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        })
    except Exception as e:
        return Response({"error": f"Login failed: {str(e)}"}, status=500)

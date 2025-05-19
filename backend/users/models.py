from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
import random
import string
from datetime import datetime, timedelta
from django.utils import timezone  # Import timezone from Django

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        Group, related_name='customuser_set', blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission, related_name='customuser_permission_set', blank=True
    )


class EmailOTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_time = models.DateTimeField()

    def generate_otp(self):
        """Generate a random 6-digit OTP"""
        self.otp_code = ''.join(random.choices(string.digits, k=6))
        # Use Django's timezone-aware now() instead of datetime.now()
        self.expiry_time = timezone.now() + timedelta(minutes=10)
        return self.otp_code

    def is_expired(self):
        # Use Django's timezone-aware now() for comparison
        return timezone.now() > self.expiry_time


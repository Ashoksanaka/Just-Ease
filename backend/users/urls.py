from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('send_email_verification/', views.send_email_verification, name='send_email_verification'),
    path('verify_email_otp/', views.verify_email_otp, name='verify_email_otp'),
    path('login/', views.login_user, name='login_user'),
]
# In backend/cases/urls.py (you'll need to create or update this file)
from django.urls import path
from . import views

urlpatterns = [
    path('create-case/', views.create_case, name='create_case'),
    path('list-cases/', views.list_cases, name='list_cases'),
    path('<int:pk>/', views.case_detail, name='case_detail'),
    path('explore/', views.explore_cases, name='explore_cases'),
]
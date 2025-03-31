from django.urls import path
from . import views

urlpatterns = [
    path('list-cases/', views.list_cases, name='list_cases'),
    path('create-case/', views.create_case, name='create_case'),
    path('<int:pk>/', views.case_detail, name='case_detail'),
]
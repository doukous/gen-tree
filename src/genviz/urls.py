from django.urls import path
from . import views


urlpatterns = [
    path('families', views.CreateFamilyView.as_view(), name='new-family'),
    path('registration-completed', views.RegistrationCompleteView.as_view(), name='register-family'),
]

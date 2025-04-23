from django.urls import include, path
from . import views


urlpatterns = [
    path('', views.HoweView.as_view(), name='home'),
    path('families', views.CreateFamilyView.as_view(), name='new-family'),
    path('registration-completed', views.RegistrationCompleteView.as_view(), name='register-family'),
]

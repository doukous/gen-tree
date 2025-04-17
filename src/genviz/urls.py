from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('families', views.new_family, name='new-family'),
    path('register-family', views.register_family, name='register-family'),
]

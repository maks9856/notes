from django.urls import path, include
from .views import CreateUserView ,ProfileUserView, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('user/profile/', ProfileUserView.as_view(), name='profile'),
    path('user/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('user/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    
    path('api-auth',include('rest_framework.urls', namespace='rest_framework'))
]

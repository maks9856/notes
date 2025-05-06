from django.urls import path, include
from .views import CreateUserView ,ProfileUserView, ChangePasswordView, PasswordResetView,PasswordResetConfirmView, CustomTokenObtainPairView, CustomTokenRefreshView,EmailVerificationView

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('user/profile/', ProfileUserView.as_view(), name='profile'),
    path('user/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('user/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('user/token/refresh/', CustomTokenRefreshView.as_view(), name='refresh_token'),
    path('user/password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('user/password_reset_confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('user/activation/',EmailVerificationView.as_view(), name='email_verification'),
    path('api-auth',include('rest_framework.urls', namespace='rest_framework'))
]

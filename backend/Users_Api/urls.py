from django.urls import path, include
from .views import CreateUserView ,ProfileUserView,LogoutView, ChangePasswordView, PasswordResetView,PasswordResetConfirmView, CustomTokenObtainPairView, CustomTokenRefreshView,EmailVerificationView,UserSettingsView

urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('user/me/', ProfileUserView.as_view(), name='profile'),
    path('user/logout/',LogoutView.as_view(), name='logout'),
    path('user/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('user/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('user/token/refresh/', CustomTokenRefreshView.as_view(), name='refresh_token'),
    path('user/password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('user/password_reset_confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('user/activation/',EmailVerificationView.as_view(), name='email_verification'),
    path('settings/', UserSettingsView.as_view(), name='user_settings'),
    path('api-auth',include('rest_framework.urls', namespace='rest_framework'))
]

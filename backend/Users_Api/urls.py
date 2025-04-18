from django.urls import path,include
from .views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('user/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('auth/', include('rest_framework.urls')),
         
]

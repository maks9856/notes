from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings

from urllib.parse import urljoin
import requests
from django.urls import reverse

# Create your views here.
user= get_user_model()
class CreateUserView(generics.CreateAPIView):
    queryset = user.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
class ProfileUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            http_context= render_to_string("email/change_password_email.html", {'user': user})
            subject = "Password Changed"
            from_email = None
            to = [user.email]
            
            msg = EmailMultiAlternatives(subject, '', from_email, to)
            msg.attach_alternative(http_context, "text/html")
            msg.send()
            
            return Response({'detail': 'Password successfully changed.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GoogleLogin(SocialLoginView):
    addapter_class = GoogleOAuth2Adapter
    callback_url=settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client
    permission_classes = [AllowAny]


class GoogleLoginCallback(APIView):
    def get(self, request,*args, **kwargs):
        code= request.GET.get('code')
        if not code:
            return Response({"error": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        token_endpoint_url=urljoin("http://localhost:8000", reverse("google_login"))
        response = requests.post(url=token_endpoint_url, data={"code": code})

        return Response(response.json(), status=status.HTTP_200_OK)
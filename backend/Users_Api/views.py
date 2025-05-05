from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives,send_mail
from django.utils.http import urlsafe_base64_encode , urlsafe_base64_decode
from django.utils.encoding import force_bytes,force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .throttling import (
    RegisterRateThrottle, ProfileRateThrottle, ChangePasswordRateThrottle,
    TokenRateThrottle, TokenRefreshRateThrottle, PasswordResetRateThrottle,
    PasswordResetConfirmRateThrottle
)


# Create your views here.
User= get_user_model()
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    throttle_classes = [RegisterRateThrottle]
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
class ProfileUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    throttle_classes = [ProfileRateThrottle]
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ChangePasswordRateThrottle]
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

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetRateThrottle]
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"

            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_url}",
                from_email=None,
                recipient_list=[email],
            )
        except User.DoesNotExist:
            pass

        return Response({"detail": "If an account with that email exists, a reset link was sent."}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetConfirmRateThrottle]
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
            
class CustomTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [TokenRateThrottle]
    permission_classes = [AllowAny]

class CustomTokenRefreshView(TokenRefreshView):
    throttle_classes = [TokenRefreshRateThrottle]
    permission_classes = [AllowAny]
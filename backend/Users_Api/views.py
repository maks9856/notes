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
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator


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

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            use = user.objects.get(email=email)
            uid= urlsafe_base64_encode(force_bytes(use.pk))
            token= default_token_generator.make_token(use)
            reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_url}",
                from_email=None,
                recipient_list=[email],
            )
        except user.DoesNotExist:
           pass
        
        return Response({"detail": "Password reset link sent to your email."}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        
        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = user.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
            
            
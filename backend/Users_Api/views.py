from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
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
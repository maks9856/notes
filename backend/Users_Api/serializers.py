from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.crypto import get_random_string
from .loging import log_event
from django.core.cache import cache
from .tasks import (
    send_email_confirmation_code
)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        validate_password(value)
        return value
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            username=validated_data['email'],
            is_active=False
        )
        user.set_password(validated_data['password'])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email','username']
        
class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"
        read_only_fields = ['user']
        
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    
    def validate_new_password(self, value):
        validate_password(value)
        return value
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_active:
            raise serializers.ValidationError("Account is not activated.")
        request = self.context['request']
        log_event(request, self.user, "login_success")
        return data
    
class SetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self,value):
        user_model=self.context['request'].user.__class__
        if user_model.objects.filter(email=value).exists():
            raise serializers.ValidationError("Цей email вже зайнятий.")
        return value
    
    
    def save(self, **kwargs):
        email=self.validated_data['email']
        user = self.context['request'].user
        code=get_random_string(6,allowed_chars='0123456789')
        key=f"email_change:{user.id}"
        cache.set(key,{'code':code,'email':email},timeout=600)
        send_email_confirmation_code.delay(email,code)
        
        
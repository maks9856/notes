from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser
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
        fields = ['id', 'email']
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    
    def validate_new_password(self, value):
        validate_password(value)
        return value
    
        
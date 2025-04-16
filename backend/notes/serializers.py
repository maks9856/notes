from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author', 'is_favorite']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']
        
        extra_kwargs = {
            'is_favorite': {'required': False},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'id': {'read_only': True},
            'title': {'required': True},
            'content': {'required': False},
            'author': {'read_only': True},
        }
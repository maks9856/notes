from rest_framework import serializers
from .models import Note, Tag

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id','uuid', 'title', 'content', 'created_at', 'updated_at', 'author', 'is_favorite']
        read_only_fields = ['id','uuid', 'created_at', 'updated_at', 'author']
        
        extra_kwargs = {
            'is_favorite': {'required': False},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'id': {'read_only': True},
            'title': {'required': True},
            'content': {'required': False},
            'author': {'read_only': True},
        }
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id', 'slug']
        extra_kwargs = {
            'id': {'read_only': True},
            'slug': {'read_only': True},
            'name': {'required': True},
        }
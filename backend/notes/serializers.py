from rest_framework import serializers
from .models import Note, Tag, NoteVersion

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']

        extra_kwargs = {
            'is_favorite': {'required': False},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'id': {'read_only': True},
            'title': {'required': False, 'allow_blank': True},
            'content': {'required': False, 'allow_blank': True},
            'author': {'read_only': True},
            'uuid': {'required': False, 'read_only': False},
        }
class NoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "uuid", "title", "updated_at"]
class NoteVersionSerializer(serializers.ModelSerializer):
    edited_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = NoteVersion
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'edited_by']
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
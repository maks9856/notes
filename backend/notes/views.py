from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Note,Tag
from .serializers import NoteSerializer, TagSerializer
from django.utils.text import slugify
from unidecode import unidecode

# Create your views here.
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'uuid'
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)
    def perform_destroy(self, instance):
        instance.delete()
    def get_object(self):
        try:
            return super().get_object()
        except Exception as e:
            print("Error fetching note:", e)
            raise
        
class TagCreateView(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        return Tag.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Tag.objects.filter(author=self.request.user)
     

    def perform_update(self, serializer):
        instanse = self.get_object()
        old_name = instanse.name
        new_name = self.request.data.get('name',old_name)
        if old_name != new_name:
            serializer.save(author=self.request.user, slug=slugify(unidecode(new_name)))
        else:
            serializer.save()
    def perform_destroy(self, instance):
        instance.delete()
        
    

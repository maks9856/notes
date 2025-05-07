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

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)
    def perform_destroy(self, instance):
        instance.delete()
        
class TagCreateView(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    queryset=Tag.objects.all()

   

    def perform_create(self, serializer):
        serializer.save()

class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    queryset = Tag.objects.all()
     

    def perform_update(self, serializer):
        instanse = self.get_object()
        old_name = instanse.name
        new_name = self.request.data.get('name',old_name)
        if old_name != new_name:
            serializer.save(slug=slugify(unidecode(new_name)))
        else:
            serializer.save()
    def perform_destroy(self, instance):
        instance.delete()
        
    

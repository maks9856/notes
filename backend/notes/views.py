from django.shortcuts import render,get_object_or_404
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Note,Tag, NoteVersion
from .serializers import NoteSerializer, TagSerializer, NoteVersionSerializer
from django.utils.text import slugify
from unidecode import unidecode
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NoteGetorCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request, uuid):
        note = get_object_or_404(Note, uuid=uuid, user=request.user)
        serializer = NoteSerializer(note)
        return Response(serializer.data)
    def post(self,request, uuid):
        note, created = Note.objects.get_or_create(
            uuid=uuid,
            author=request.user,
            defaults={'title': '', 'content': ''}
        )
        serializer = NoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    def put(self, request, uuid):
        note = get_object_or_404(Note, uuid=uuid, author=request.user)
        old_content = note.content
        
        serializer = NoteSerializer(note, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_content = serializer.validated_data.get('content')
        if new_content is not None and new_content != old_content:
            NoteVersion.objects.create(
                note=note,
                content=old_content,
                edited_by=request.user
            )
        serializer.save()
        return Response(serializer.data)
    def delete(self, request, uuid):
        note = get_object_or_404(Note, uuid=uuid, author=request.user)
        note.delete()
        return Response({"detail": "Note deleted."}, status=status.HTTP_204_NO_CONTENT)
    
class NoteVersionListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, uuid):
        note = get_object_or_404(Note, uuid=uuid, author=request.user)
        versions = note.versions.all()
        serializer = NoteVersionSerializer(versions, many=True)
        return Response(serializer.data)
    
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
        
    

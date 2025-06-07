from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, Tag, NoteVersion
from .serializers import NoteSerializer, TagSerializer, NoteVersionSerializer, NoteListSerializer
from django.utils.text import slugify
from unidecode import unidecode
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from celery.result import AsyncResult
from .tasks import save_note_from_cache
import json
from django.core.serializers.json import DjangoJSONEncoder
# Create your views here.
class NoteListView(APIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = f"user_notes:{request.user.id}"
        notes = cache.get(cache_key)
        if notes is None:
            notes_queryset = Note.objects.filter(author=request.user).order_by('-updated_at')
            serializer = NoteListSerializer(notes_queryset, many=True)
            notes = serializer.data
            cache.set(cache_key, notes, timeout=60 * 10)
        print(notes)
        return Response(notes,status=status.HTTP_200_OK)


class NoteGetOrCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, uuid):
        note = get_object_or_404(Note, uuid=uuid, author=request.user)    
        serializer = NoteSerializer(note)
        return Response(serializer.data ,status=status.HTTP_200_OK)

    def post(self, request, uuid):
        note, created = Note.objects.get_or_create(
            uuid=uuid, author=request.user, defaults={"title": request.data.get('title',''), "content": request.data.get('content','')}
        )
        serializer = NoteSerializer(note)
        self._update_note_list_cache(request.user)
        
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def put(self, request, uuid):
        note = get_object_or_404(Note, uuid=uuid, author=request.user)
        
        serializer = NoteSerializer(note, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self._update_note_list_cache(request.user)
        '''
       
        cache_key = f"note_buffer:{note.id}"
        task_id_key = f"note_task_id:{note.id}"

    
        old_task_id = cache.get(task_id_key)
        if old_task_id:
            AsyncResult(old_task_id).revoke(terminate=True)

        
        task = save_note_from_cache.apply_async(
            args=[
                note.id,
                serializer.validated_data
            ],
            countdown=60 * 10
        )
        
        safe_data = json.loads(json.dumps(serializer.validated_data, cls=DjangoJSONEncoder))
        safe_task_id = json.loads(json.dumps(task.id, cls=DjangoJSONEncoder))
        cache.set(cache_key, safe_data, timeout=60 * 10)
        
        cache.set(task_id_key, safe_task_id, timeout=60 * 10)
        '''
        return Response(serializer.validated_data,status=status.HTTP_200_OK)


    def delete(self, request, uuid):
        note = get_object_or_404(Note, uuid=uuid, author=request.user)
        note.delete()
        return Response({"detail": "Note deleted."}, status=status.HTTP_204_NO_CONTENT)
    def _update_note_list_cache(self, user):
        cache_key = f"user_notes:{user.id}"
        notes_queryset = Note.objects.filter(author=user).order_by('-updated_at')
        serializer = NoteListSerializer(notes_queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=60 * 10)

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
    lookup_field = "slug"

    def get_queryset(self):
        return Tag.objects.filter(author=self.request.user)

    def perform_update(self, serializer):
        instanse = self.get_object()
        old_name = instanse.name
        new_name = self.request.data.get("name", old_name)
        if old_name != new_name:
            serializer.save(author=self.request.user, slug=slugify(unidecode(new_name)))
        else:
            serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

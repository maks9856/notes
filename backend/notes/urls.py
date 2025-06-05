from django.urls import path
from .views import NoteListView, NoteGetOrCreateView, TagCreateView, TagDetailView, NoteVersionListView

urlpatterns = [
    path('notes/', NoteListView.as_view(), name='note-list-create'),
    path('notes/<uuid:uuid>/', NoteGetOrCreateView.as_view(), name='note-detail'),
    path('notes/<uuid:uuid>/versions/', NoteVersionListView.as_view(), name='note-version-list'),
    path('tags/', TagCreateView.as_view(), name='tag-list-create'),
    path('tags/<slug:slug>/', TagDetailView.as_view(), name='tag-detail'),
]
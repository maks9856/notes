from django.urls import path
from .views import NoteListCreateView, NoteGetorCreateView, TagCreateView, TagDetailView, NoteVersionListView

urlpatterns = [
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<uuid:uuid>/', NoteGetorCreateView.as_view(), name='note-detail'),
    path('notes/<uuid:uuid>/versions/', NoteVersionListView.as_view(), name='note-version-list'),
    path('tags/', TagCreateView.as_view(), name='tag-list-create'),
    path('tags/<slug:slug>/', TagDetailView.as_view(), name='tag-detail'),
]
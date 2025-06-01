from celery import shared_task,app
import json
from django.core.cache import cache
from .models import Note

@shared_task
def persist_cached_notes():
    print("Persisting cached notes to the database...")
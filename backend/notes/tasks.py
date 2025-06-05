from celery import shared_task
from django.core.cache import cache
from .models import Note
from time import sleep
from django.core.serializers.json import DjangoJSONEncoder
import json
@shared_task(max_retries=3, default_retry_delay=10)
def save_note_from_cache(note_id,data):
    Note.objects.filter(id=note_id).update(**data)

    cache.delete(f"note_buffer:{note_id}")
    cache.delete(f"note_task_id:{note_id}")

    
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'persist-cached-notes-every-10-seconds': {
        'task': 'notes.tasks.persist_cached_notes',
        'schedule': 300.0,
    },
}
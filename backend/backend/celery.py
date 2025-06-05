from celery import Celery

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
app.conf.worker_prefetch_multiplier = 1
app.conf.task_acks_late = True
app.conf.reject_on_worker_lost = True

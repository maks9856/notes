from django.db import models
from Users_Api.models import CustomUser
# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notes')
    is_favorite = models.BooleanField(default=False)
    def __str__(self):
        return self.title

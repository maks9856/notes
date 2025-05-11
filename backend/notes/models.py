from django.db import models
from Users_Api.models import CustomUser
from django.utils.text import slugify
from unidecode import unidecode
import uuid
# Create your models here.

class Note(models.Model):
    uuid=models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=255,default='New title',blank=True)
    content = models.TextField(default='',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notes')
    is_favorite = models.BooleanField(default=False)
    tag=models.ManyToManyField('Tag', blank=True, related_name='notes')
    def __str__(self):
        return self.title
    

    class Meta:
        ordering = ['-created_at']
        
        
    
class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug=models.SlugField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tags')
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(unidecode(self.name))
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

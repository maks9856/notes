from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    
class AuthLog(models.Model):
    EVENT_CHOICES=[
        ('register', 'User Registration'),
        ("login_success", "Login Success"),
        ("login_failed", "Login Failed"),
        ("password_change", "Password Change"),
        ("password_reset", "Password Reset"),
        ("logout", "Logout"),
        ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50,choices=EVENT_CHOICES)
    ip_address=models.GenericIPAddressField(null=True, blank=True)
    user_agent=models.CharField(max_length=255, null=True, blank=True)
    timestamp=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email} - {self.event_type} - {self.timestamp}"
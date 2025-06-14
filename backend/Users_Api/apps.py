from django.apps import AppConfig


class UsersApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Users_Api'
    
    def ready(self):
        import Users_Api.signals

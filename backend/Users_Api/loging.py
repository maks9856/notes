from .models import AuthLog

def log_event(request, user, event_type):
    ip_address = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    
    auth_log = AuthLog(
        user=user,
        event_type=event_type,
        ip_address=ip_address,
        user_agent=user_agent
    )
    auth_log.save()
    
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    
    return ip
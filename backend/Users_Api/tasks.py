from celery import shared_task
from django.core.cache import cache
from django.utils.http import urlsafe_base64_encode , urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes,force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives,send_mail
@shared_task
def send_confirmation_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    confirmation_url = f"http://localhost:5173/activate/{uid}/{token}/"

    html_content = render_to_string("email/confirmation_email.html", {
        'user': user,
        'confirmation_link': confirmation_url
        })
    subject = "Activate your account"
    from_email = None
    to = [user.email]

    msg = EmailMultiAlternatives(subject, '', from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

@shared_task
def send_change_password_email(user):
    http_context= render_to_string("email/change_password_email.html", {'user': user})
    subject = "Password Changed"
    from_email = None
    to = [user.email]
            
    msg = EmailMultiAlternatives(subject, '', from_email, to)
    msg.attach_alternative(http_context, "text/html")
    msg.send()
    
@shared_task
def send_password_reset_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
    html_content = render_to_string("email/password_reset_email.html", {
        'user': user,
        'reset_link': reset_url
    })
    subject = "Password Reset Request"
    from_email = None
    to = [user.email]

    msg = EmailMultiAlternatives(subject, '', from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()


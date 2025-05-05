from rest_framework.throttling import UserRateThrottle

class RegisterRateThrottle(UserRateThrottle):
    scope = 'register'

class ProfileRateThrottle(UserRateThrottle):
    scope = 'profile'

class ChangePasswordRateThrottle(UserRateThrottle):
    scope = 'change_password'

class TokenRateThrottle(UserRateThrottle):
    scope = 'token'

class TokenRefreshRateThrottle(UserRateThrottle):
    scope = 'token_refresh'

class PasswordResetRateThrottle(UserRateThrottle):
    scope = 'password_reset'

class PasswordResetConfirmRateThrottle(UserRateThrottle):
    scope = 'password_reset_confirm'
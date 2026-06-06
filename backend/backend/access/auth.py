from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied


SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


def _enforce_csrf(request):
    if request.method in SAFE_METHODS:
        return

    cookie_token = request.COOKIES.get("csrftoken")
    header_token = request.headers.get("X-CSRFToken") or request.headers.get("X-CSRFTOKEN")

    if not cookie_token or not header_token or cookie_token != header_token:
        raise PermissionDenied("CSRF token missing or incorrect.")


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        if access_token is not None:
            try:
                validated_token = self.get_validated_token(access_token)
                _enforce_csrf(request)
                return self.get_user(validated_token), validated_token
            except InvalidToken:
                pass

        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            return None

        try:
            refresh = RefreshToken(refresh_token)
            _enforce_csrf(request)
            return self.get_user(refresh), refresh
        except TokenError:
            return None

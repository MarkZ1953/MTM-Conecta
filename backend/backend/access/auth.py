from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        if access_token is not None:
            try:
                validated_token = self.get_validated_token(access_token)
                return self.get_user(validated_token), validated_token
            except InvalidToken:
                pass

        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            return None

        try:
            refresh = RefreshToken(refresh_token)
            return self.get_user(refresh), refresh
        except TokenError:
            return None

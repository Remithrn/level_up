from channels.middleware import BaseMiddleware
from django.db import close_old_connections
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
import jwt
from asgiref.sync import sync_to_async

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to handle JWT authentication for WebSocket connections.
    """
    async def __call__(self, scope, receive, send):
        close_old_connections()

        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                # Validate the token
                jwt_authenticator = JWTAuthentication()
                validated_token = jwt_authenticator.get_validated_token(token[0])
                user = await sync_to_async(jwt_authenticator.get_user)(validated_token)

                # Add the user to the scope
                scope['user'] = user
            except jwt.InvalidTokenError:
                scope['user'] = None
        else:
            scope['user'] = None

        return await super().__call__(scope, receive, send)

# Helper function for easy integration with Channels middleware stack
def JwtAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(inner)

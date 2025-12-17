from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from api.models import User
import logging

logger = logging.getLogger(__name__)


class GoogleOAuthLoginView(APIView):
    """
    Handle Google OAuth login
    Accepts Google ID token from frontend, validates it, and returns JWT tokens
    """
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            # Get the Google token from request
            google_token = request.data.get('credential') or request.data.get('token')
            
            if not google_token:
                return Response(
                    {'error': 'No credential provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verify the token with Google
            try:
                idinfo = id_token.verify_oauth2_token(
                    google_token,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID
                )

                # Verify the issuer
                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    return Response(
                        {'error': 'Invalid token issuer'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Get user info from Google token
                email = idinfo.get('email')
                given_name = idinfo.get('given_name', '')
                family_name = idinfo.get('family_name', '')
                google_id = idinfo.get('sub')
                picture = idinfo.get('picture', '')

                if not email:
                    return Response(
                        {'error': 'Email not provided by Google'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Check if user exists with this email
                user = User.objects.filter(email=email).first()

                if user:
                    # Update user info if needed
                    if not user.first_name and given_name:
                        user.first_name = given_name
                    if not user.last_name and family_name:
                        user.last_name = family_name
                    user.save()
                else:
                    # Create new user
                    # Generate username from email
                    username = email.split('@')[0]
                    base_username = username
                    counter = 1
                    
                    # Ensure username is unique
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1

                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        first_name=given_name,
                        last_name=family_name,
                        password=None  # No password for OAuth users
                    )
                    # Set unusable password for OAuth users
                    user.set_unusable_password()
                    user.save()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)

                return Response({
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'xp': user.xp,
                        'level': user.level,
                        'is_staff': user.is_staff,
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)

            except ValueError as e:
                # Invalid token
                logger.error(f"Google token verification failed: {str(e)}")
                return Response(
                    {'error': 'Invalid Google token'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            logger.error(f"Google OAuth error: {str(e)}")
            return Response(
                {'error': 'Authentication failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

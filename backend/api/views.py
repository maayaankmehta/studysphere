from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q
import random

from .models import User, StudySession, StudyGroup, SessionRSVP, GroupMembership, SessionMessage, SessionResource
from .serializers import (
    StudySessionSerializer, StudySessionCreateSerializer,
    StudyGroupSerializer, StudyGroupCreateSerializer,
    LeaderboardSerializer, UserProfileSerializer,
    SessionMessageSerializer, SessionResourceSerializer
)
from .permissions import IsHostOrReadOnly, IsCreatorOrReadOnly, IsAdminUser
from .utils import award_xp, XP_REWARDS


class StudySessionViewSet(viewsets.ModelViewSet):
    """ViewSet for StudySession CRUD and RSVP"""
    queryset = StudySession.objects.all().select_related('host', 'group').prefetch_related('attendees')
    permission_classes = [IsAuthenticatedOrReadOnly, IsHostOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudySessionCreateSerializer
        return StudySessionSerializer
    
    def perform_create(self, serializer):
        # Generate random 6-digit verification code
        verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        session = serializer.save(host=self.request.user, verification_code=verification_code)
        # Award XP for creating a session
        award_xp(self.request.user, XP_REWARDS['create_session'])
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rsvp(self, request, pk=None):
        """RSVP to a session (no verification required)"""
        session = self.get_object()
        
        # Check if session belongs to a group
        if session.group:
            # User must be a member of the group to RSVP
            if not GroupMembership.objects.filter(user=request.user, group=session.group).exists():
                return Response(
                    {'detail': 'You must join the group before you can RSVP to this session'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Check if already RSVP'd
        if SessionRSVP.objects.filter(user=request.user, session=session).exists():
            return Response(
                {'detail': 'You have already RSVP\'d to this session'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create RSVP without verification (attended=False by default)
        SessionRSVP.objects.create(user=request.user, session=session)
        
        return Response(
            {'detail': 'Successfully RSVP\'d to session'},
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='mark-attendance')
    def mark_attendance(self, request, pk=None):
        """Mark attendance with verification code and award XP"""
        session = self.get_object()
        
        # Check if user has RSVP'd
        try:
            rsvp = SessionRSVP.objects.get(user=request.user, session=session)
        except SessionRSVP.DoesNotExist:
            return Response(
                {'detail': 'You must RSVP to this session before marking attendance'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already marked attendance
        if rsvp.attended:
            return Response(
                {'detail': 'You have already marked your attendance for this session'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate verification code
        verification_code = request.data.get('verification_code', '').strip()
        if not verification_code:
            return Response(
                {'detail': 'Verification code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if verification_code != session.verification_code:
            return Response(
                {'detail': 'Invalid verification code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark attendance
        rsvp.attended = True
        rsvp.save()
        
        # Award XP for attending (only after successful verification)
        award_xp(request.user, XP_REWARDS['rsvp_session'])
        
        return Response(
            {'detail': 'Attendance marked successfully', 'xp_earned': XP_REWARDS['rsvp_session']},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def cancel_rsvp(self, request, pk=None):
        """Cancel RSVP to a session"""
        session = self.get_object()
        
        try:
            rsvp = SessionRSVP.objects.get(user=request.user, session=session)
            rsvp.delete()
            return Response({'detail': 'RSVP cancelled'}, status=status.HTTP_200_OK)
        except SessionRSVP.DoesNotExist:
            return Response(
                {'detail': 'You have not RSVP\'d to this session'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def messages(self, request, pk=None):
        """Get all messages for a session"""
        session = self.get_object()
        
        # Check if user is attending the session
        if not session.attendees.filter(id=request.user.id).exists():
            return Response(
                {'detail': 'You must be attending this session to view messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        messages = SessionMessage.objects.filter(session=session).select_related('sender')
        serializer = SessionMessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def send_message(self, request, pk=None):
        """Send a message to the session chat"""
        session = self.get_object()
        
        # Check if user is attending the session
        if not session.attendees.filter(id=request.user.id).exists():
            return Response(
                {'detail': 'You must be attending this session to send messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = SessionMessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(sender=request.user, session=session)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def resources(self, request, pk=None):
        """Get all resources for a session"""
        session = self.get_object()
        
        # Check if user is attending the session
        if not session.attendees.filter(id=request.user.id).exists():
            return Response(
                {'detail': 'You must be attending this session to view resources'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        resources = SessionResource.objects.filter(session=session).select_related('added_by')
        serializer = SessionResourceSerializer(resources, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_resource(self, request, pk=None):
        """Add a resource to the session"""
        session = self.get_object()
        
        # Check if user is attending the session
        if not session.attendees.filter(id=request.user.id).exists():
            return Response(
                {'detail': 'You must be attending this session to add resources'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = SessionResourceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(added_by=request.user, session=session)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated], url_path='delete-resource/(?P<resource_id>[^/.]+)')
    def delete_resource(self, request, pk=None, resource_id=None):
        """Delete a resource (only host or resource owner can delete)"""
        session = self.get_object()
        
        try:
            resource = SessionResource.objects.get(id=resource_id, session=session)
        except SessionResource.DoesNotExist:
            return Response(
                {'detail': 'Resource not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is the host or the resource owner
        if request.user.id != session.host.id and request.user.id != resource.added_by.id:
            return Response(
                {'detail': 'Only the session host or resource owner can delete this resource'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        resource.delete()
        return Response(
            {'detail': 'Resource deleted successfully'},
            status=status.HTTP_200_OK
        )


class StudyGroupViewSet(viewsets.ModelViewSet):
    """ViewSet for StudyGroup CRUD and membership"""
    permission_classes = [IsAuthenticatedOrReadOnly, IsCreatorOrReadOnly]
    
    def get_queryset(self):
        # Only show approved groups to non-staff users
        if self.request.user.is_staff:
            return StudyGroup.objects.all().select_related('creator').prefetch_related('members')
        return StudyGroup.objects.filter(status='approved').select_related('creator').prefetch_related('members')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudyGroupCreateSerializer
        return StudyGroupSerializer
    
    def perform_create(self, serializer):
        group = serializer.save(creator=self.request.user, status='pending')
        # Automatically add creator as member
        GroupMembership.objects.create(user=self.request.user, group=group)
        # Award XP for creating a group
        award_xp(self.request.user, XP_REWARDS['create_group'])
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """Join a study group"""
        group = self.get_object()
        
        # Check if group is approved
        if group.status != 'approved':
            return Response(
                {'detail': 'This group is not yet approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already a member
        if GroupMembership.objects.filter(user=request.user, group=group).exists():
            return Response(
                {'detail': 'You are already a member of this group'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create membership
        GroupMembership.objects.create(user=request.user, group=group)
        
        # Award XP for joining a group
        award_xp(request.user, XP_REWARDS['join_group'])
        
        return Response(
            {'detail': 'Successfully joined group', 'xp_earned': XP_REWARDS['join_group']},
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        """Leave a study group"""
        group = self.get_object()
        
        try:
            membership = GroupMembership.objects.get(user=request.user, group=group)
            membership.delete()
            return Response({'detail': 'Successfully left group'}, status=status.HTTP_200_OK)
        except GroupMembership.DoesNotExist:
            return Response(
                {'detail': 'You are not a member of this group'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def sessions(self, request, pk=None):
        """Get all sessions for this group"""
        group = self.get_object()
        sessions = StudySession.objects.filter(group=group).select_related('host').prefetch_related('attendees')
        serializer = StudySessionSerializer(sessions, many=True, context={'request': request})
        return Response(serializer.data)


class LeaderboardViewSet(viewsets.ViewSet):
    """ViewSet for leaderboard rankings"""
    
    def list(self, request):
        """Get leaderboard data"""
        period = request.query_params.get('period', 'week')
        
        if period == 'week':
            # Get users who earned XP in the last week
            week_ago = timezone.now() - timedelta(days=7)
            # For simplicity, just show top users by XP (would need activity tracking for true weekly)
            users = User.objects.all().order_by('-xp')[:10]
        else:
            # All-time leaderboard
            users = User.objects.all().order_by('-xp')[:10]
        
        serializer = LeaderboardSerializer(users, many=True)
        
        # Add rank to each user
        data = serializer.data
        for idx, user_data in enumerate(data, 1):
            user_data['rank'] = idx
        
        return Response(data)


class DashboardViewSet(viewsets.ViewSet):
    """ViewSet for dashboard data"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get dashboard data for current user"""
        user = request.user
        
        # Get upcoming sessions user is attending
        upcoming_sessions = StudySession.objects.filter(
            attendees=user
        ).select_related('host', 'group')[:3]
        
        sessions_serializer = StudySessionSerializer(
            upcoming_sessions, 
            many=True, 
            context={'request': request}
        )
        
        # Get user stats
        stats = {
            'sessions_attended': SessionRSVP.objects.filter(user=user).count(),
            'groups_joined': GroupMembership.objects.filter(user=user).count(),
            'sessions_hosted': StudySession.objects.filter(host=user).count(),
            'xp': user.xp,
            'level': user.level,
        }
        
        return Response({
            'upcoming_sessions': sessions_serializer.data,
            'stats': stats,
        })


class AdminViewSet(viewsets.ViewSet):
    """ViewSet for admin operations"""
    permission_classes = [IsAdminUser]
    
    def list(self, request):
        """Get all group requests"""
        groups = StudyGroup.objects.all().select_related('creator').annotate(
            members_count=Count('members')
        )
        
        pending = groups.filter(status='pending')
        approved = groups.filter(status='approved')
        rejected = groups.filter(status='rejected')
        
        data = {
            'pending': StudyGroupSerializer(pending, many=True).data,
            'approved': StudyGroupSerializer(approved, many=True).data,
            'rejected': StudyGroupSerializer(rejected, many=True).data,
            'stats': {
                'total_groups': groups.count(),
                'approved_groups': approved.count(),
                'rejected_groups': rejected.count(),
                'total_sessions': StudySession.objects.count(),
                'active_sessions': StudySession.objects.filter(
                    attendees__isnull=False
                ).distinct().count(),
            }
        }
        
        return Response(data)
    
    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        """Approve a group request"""
        try:
            group = StudyGroup.objects.get(pk=pk)
            group.status = 'approved'
            group.save()
            return Response({'detail': 'Group approved'}, status=status.HTTP_200_OK)
        except StudyGroup.DoesNotExist:
            return Response({'detail': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        """Reject a group request"""
        try:
            group = StudyGroup.objects.get(pk=pk)
            group.status = 'rejected'
            group.save()
            return Response({'detail': 'Group rejected'}, status=status.HTTP_200_OK)
        except StudyGroup.DoesNotExist:
            return Response({'detail': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

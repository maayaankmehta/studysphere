from rest_framework import serializers
from .models import User, StudySession, StudyGroup, SessionRSVP, GroupMembership, Badge, SessionMessage, SessionResource


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'image', 'level', 'xp', 'created_at']
        read_only_fields = ['id', 'level', 'xp', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Detailed user profile with badges and groups"""
    badges = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'image', 'level', 'xp', 'is_staff', 'badges', 'groups', 'created_at']
        read_only_fields = ['id', 'level', 'xp', 'is_staff', 'created_at']
    
    def get_badges(self, obj):
        badges = obj.badges.all()
        return BadgeSerializer(badges, many=True).data
    
    def get_groups(self, obj):
        memberships = obj.joined_groups.filter(status='approved')
        return [{
            'id': group.id,
            'name': group.name,
            'members_count': group.members.count()
        } for group in memberships]


class BadgeSerializer(serializers.ModelSerializer):
    """Serializer for Badge model"""
    class Meta:
        model = Badge
        fields = ['id', 'name', 'icon', 'color', 'bg_color', 'earned_at']
        read_only_fields = ['id', 'earned_at']


class StudyGroupSerializer(serializers.ModelSerializer):
    """Serializer for StudyGroup with creator and member info"""
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    creator_image = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    member_images = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    
    class Meta:
        model = StudyGroup
        fields = ['id', 'name', 'subject', 'description', 'creator', 'creator_name', 'creator_image',
                  'members_count', 'members', 'member_images', 'is_member', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'creator', 'status', 'created_at', 'updated_at']
    
    def get_creator_image(self, obj):
        if obj.creator.image:
            return obj.creator.image
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.creator.username}"
    
    def get_members_count(self, obj):
        return obj.members.count()
    
    def get_members(self, obj):
        members = obj.members.all()
        return [{
            'id': member.id,
            'username': member.username,
            'first_name': member.first_name,
            'last_name': member.last_name,
            'image': member.image if member.image else f"https://api.dicebear.com/7.x/avataaars/svg?seed={member.username}"
        } for member in members]
    
    def get_member_images(self, obj):
        members = obj.members.all()[:3]
        return [member.image if member.image else f"https://api.dicebear.com/7.x/avataaars/svg?seed={member.username}" 
                for member in members]
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False


class StudyGroupCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating study groups"""
    class Meta:
        model = StudyGroup
        fields = ['name', 'subject', 'description']


class StudySessionSerializer(serializers.ModelSerializer):
    """Serializer for StudySession with host and attendee info"""
    host_name = serializers.CharField(source='host.username', read_only=True)
    host_image = serializers.SerializerMethodField()
    group_name = serializers.CharField(source='group.name', read_only=True, allow_null=True)
    attendees_count = serializers.SerializerMethodField()
    attendees_list = serializers.SerializerMethodField()
    is_attending = serializers.SerializerMethodField()
    has_attended = serializers.SerializerMethodField()
    is_group_member = serializers.SerializerMethodField()
    verification_code = serializers.SerializerMethodField()
    
    class Meta:
        model = StudySession
        fields = ['id', 'title', 'course_code', 'description', 'date', 'time', 'location',
                  'host', 'host_name', 'host_image', 'group', 'group_name', 
                  'attendees_count', 'attendees_list', 'is_attending', 'has_attended', 'is_group_member', 'verification_code', 'created_at', 'updated_at']
        read_only_fields = ['id', 'host', 'created_at', 'updated_at']
    
    def get_host_image(self, obj):
        if obj.host.image:
            return obj.host.image
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.host.username}"
    
    def get_attendees_count(self, obj):
        return obj.attendees.count()
    
    def get_attendees_list(self, obj):
        attendees = obj.attendees.all()
        return [{
            'name': f"{attendee.first_name} {attendee.last_name}" if attendee.first_name else attendee.username,
            'image': attendee.image if attendee.image else f"https://api.dicebear.com/7.x/avataaars/svg?seed={attendee.username}"
        } for attendee in attendees]
    
    def get_is_attending(self, obj):
        """Check if user has RSVP'd to the session"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.attendees.filter(id=request.user.id).exists()
        return False
    
    def get_has_attended(self, obj):
        """Check if user has marked attendance (verified with code)"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                rsvp = SessionRSVP.objects.get(user=request.user, session=obj)
                return rsvp.attended
            except SessionRSVP.DoesNotExist:
                return False
        return False
    
    def get_is_group_member(self, obj):
        """Check if user is a member of the session's group"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if obj.group:
                return GroupMembership.objects.filter(user=request.user, group=obj.group).exists()
            return True  # Sessions without a group are open to all
        return False
    
    def get_verification_code(self, obj):
        """Return verification code only if the requesting user is the host"""
        request = self.context.get('request')
        if request and request.user.is_authenticated and obj.host.id == request.user.id:
            return obj.verification_code
        return None


class StudySessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating study sessions"""
    class Meta:
        model = StudySession
        fields = ['title', 'course_code', 'description', 'date', 'time', 'location', 'group']


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for leaderboard rankings"""
    badge = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'image', 'xp', 'level', 'badge']
    
    def get_badge(self, obj):
        latest_badge = obj.badges.first()
        if latest_badge:
            return latest_badge.name
        return 'Rising Star'  # Default badge


class SessionMessageSerializer(serializers.ModelSerializer):
    """Serializer for session chat messages"""
    sender_name = serializers.SerializerMethodField()
    sender_image = serializers.SerializerMethodField()
    is_current_user = serializers.SerializerMethodField()
    
    class Meta:
        model = SessionMessage
        fields = ['id', 'session', 'sender', 'sender_name', 'sender_image', 'is_current_user', 'text', 'created_at']
        read_only_fields = ['id', 'session', 'sender', 'created_at']
    
    def get_sender_name(self, obj):
        if obj.sender.first_name or obj.sender.last_name:
            return f"{obj.sender.first_name} {obj.sender.last_name}".strip()
        return obj.sender.username
    
    def get_sender_image(self, obj):
        if obj.sender.image:
            return obj.sender.image
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.sender.username}"
    
    def get_is_current_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender.id == request.user.id
        return False


class SessionResourceSerializer(serializers.ModelSerializer):
    """Serializer for session resources"""
    added_by_name = serializers.SerializerMethodField()
    added_by_image = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    
    class Meta:
        model = SessionResource
        fields = ['id', 'session', 'title', 'link', 'added_by', 'added_by_name', 'added_by_image', 'is_owner', 'can_delete', 'created_at']
        read_only_fields = ['id', 'session', 'added_by', 'created_at']
    
    def get_added_by_name(self, obj):
        if obj.added_by.first_name or obj.added_by.last_name:
            return f"{obj.added_by.first_name} {obj.added_by.last_name}".strip()
        return obj.added_by.username
    
    def get_added_by_image(self, obj):
        if obj.added_by.image:
            return obj.added_by.image
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.added_by.username}"
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.added_by.id == request.user.id
        return False
    
    def get_can_delete(self, obj):
        """Check if user can delete (host or resource owner)"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # User is the resource owner or the session host
            return obj.added_by.id == request.user.id or obj.session.host.id == request.user.id
        return False


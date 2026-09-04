from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    business_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'user',
            'user_name',
            'user_email',
            'business',
            'business_name',
            'action',
            'timestamp',
            'metadata',
            'reference_id',
            'ip_address',
        ]
        read_only_fields = ['id', 'timestamp']

    def get_user_email(self, obj):
        if obj.user:
            return obj.user.email
        return 'system@mobira.internal'

    def get_user_name(self, obj):
        if obj.user:
            full = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return full if full else obj.user.username
        return 'Mobira Automated Sentinel'

    def get_business_name(self, obj):
        if obj.business:
            return obj.business.name
        return 'ABC Technologies Ltd'

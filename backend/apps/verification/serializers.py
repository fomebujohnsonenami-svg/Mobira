from rest_framework import serializers
from .models import VerificationLog

class VerificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationLog
        fields = '__all__'

class PreflightRequestSerializer(serializers.Serializer):
    channel = serializers.CharField(default="MTN_MOMO")
    account_identifier = serializers.CharField()
    expected_name = serializers.CharField(required=False, allow_blank=True, default="")

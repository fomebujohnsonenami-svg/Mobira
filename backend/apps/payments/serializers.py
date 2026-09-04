from rest_framework import serializers
from .models import Payment
from config.validators import (
    validate_positive_amount,
    validate_account_identifier,
    sanitize_text,
    validate_channel,
    validate_currency,
)

class PaymentSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)
    maker_name = serializers.CharField(source='maker_user.get_full_name', read_only=True)
    checker_name = serializers.CharField(source='checker_user.get_full_name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = [
            'id',
            'reference_id',
            'fee',
            'status',
            'requires_checker',
            'is_preflight_verified',
            'preflight_confidence',
            'provider_name',
            'provider_reference',
            'failure_reason',
            'raw_provider_payload',
            'created_at',
            'completed_at',
        ]

class CreateDisbursementSerializer(serializers.Serializer):
    recipient_name = serializers.CharField(max_length=255)
    account_identifier = serializers.CharField(max_length=100)
    channel = serializers.CharField(default="MTN_MOMO")
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    currency = serializers.CharField(default="GHS")
    narration = serializers.CharField(required=False, allow_blank=True, default="")
    idempotency_key = serializers.CharField(required=False, allow_blank=True, default=None)
    require_preflight = serializers.BooleanField(default=True)

    def validate_recipient_name(self, value):
        return sanitize_text(value, max_length=255, required=True)

    def validate_account_identifier(self, value):
        return validate_account_identifier(value)

    def validate_channel(self, value):
        return validate_channel(value)

    def validate_amount(self, value):
        return validate_positive_amount(value)

    def validate_currency(self, value):
        return validate_currency(value)

    def validate_narration(self, value):
        return sanitize_text(value, max_length=255, required=False)


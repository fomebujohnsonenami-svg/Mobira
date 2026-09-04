from rest_framework import serializers
from .models import PaymentBatch, PaymentBatchItem, PaymentList, PaymentListRecipient
from config.validators import (
    validate_positive_amount,
    validate_account_identifier,
    sanitize_text,
    validate_channel,
)

class PaymentListRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentListRecipient
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PaymentListSerializer(serializers.ModelSerializer):
    recipients = PaymentListRecipientSerializer(many=True, read_only=True)

    class Meta:
        model = PaymentList
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'last_disbursed_at']

class PaymentBatchItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentBatchItem
        fields = '__all__'
        read_only_fields = ['id', 'status', 'error_message', 'provider_reference', 'payment']

class PaymentBatchSerializer(serializers.ModelSerializer):
    items = PaymentBatchItemSerializer(many=True, read_only=True)

    class Meta:
        model = PaymentBatch
        fields = '__all__'
        read_only_fields = [
            'id',
            'batch_code',
            'processed_count',
            'successful_count',
            'failed_count',
            'status',
            'created_at',
            'completed_at',
        ]

class CreateBatchItemInputSerializer(serializers.Serializer):
    recipient_name = serializers.CharField(max_length=255)
    account_identifier = serializers.CharField(max_length=100)
    channel = serializers.CharField(default="MTN_MOMO")
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

    def validate_recipient_name(self, value):
        return sanitize_text(value, max_length=255, required=True)

    def validate_account_identifier(self, value):
        return validate_account_identifier(value)

    def validate_channel(self, value):
        return validate_channel(value)

    def validate_amount(self, value):
        return validate_positive_amount(value)

class CreateBatchInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    items = CreateBatchItemInputSerializer(many=True)

    def validate_title(self, value):
        return sanitize_text(value, max_length=255, required=True)

    def validate_items(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError("Batch must contain at least one recipient item.")
        if len(value) > 1000:
            raise serializers.ValidationError("Batch exceeds maximum size of 1,000 items.")
        return value


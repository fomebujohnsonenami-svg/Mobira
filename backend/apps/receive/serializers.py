from rest_framework import serializers
from .models import PaymentLink, Collection
from apps.businesses.models import Business
from config.validators import (
    validate_positive_amount,
    validate_phone_number,
    sanitize_text,
    validate_channel,
)

class PaymentLinkSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)
    business_tier = serializers.CharField(source='business.verification_tier', read_only=True)
    business_trust_score = serializers.IntegerField(source='business.trust_score', read_only=True)
    payment_url = serializers.SerializerMethodField()

    class Meta:
        model = PaymentLink
        fields = [
            'id',
            'slug',
            'business',
            'business_name',
            'business_tier',
            'business_trust_score',
            'title',
            'description',
            'amount',
            'currency',
            'allow_custom_amount',
            'is_active',
            'qr_data',
            'payment_url',
            'total_collected_xaf',
            'collections_count',
            'created_at',
        ]
        read_only_fields = ['id', 'slug', 'qr_data', 'total_collected_xaf', 'collections_count', 'created_at']

    def get_payment_url(self, obj):
        return f"http://localhost:3000/customer/{obj.slug}"

class CreatePaymentLinkInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    allow_custom_amount = serializers.BooleanField(default=False)

    def validate_title(self, value):
        return sanitize_text(value, max_length=255, required=True)

    def validate_description(self, value):
        return sanitize_text(value, max_length=500, required=False)

    def validate(self, data):
        if not data.get('allow_custom_amount'):
            if not data.get('amount'):
                raise serializers.ValidationError({"amount": "Fixed amount is required when custom amount is not enabled."})
            data['amount'] = validate_positive_amount(data['amount'])
        return data

class CustomerPayInputSerializer(serializers.Serializer):
    payer_name = serializers.CharField(max_length=255)
    payer_phone = serializers.CharField(max_length=50)
    channel = serializers.CharField(default="MTN_MOMO")
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

    def validate_payer_name(self, value):
        return sanitize_text(value, max_length=255, required=True)

    def validate_phone_number(self, value):
        return validate_phone_number(value)

    def validate_channel(self, value):
        return validate_channel(value)

    def validate_amount(self, value):
        return validate_positive_amount(value)

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'


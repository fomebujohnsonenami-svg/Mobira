from rest_framework import serializers
from .models import Business, DisbursementAccount, ConnectedAccount

class DisbursementAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisbursementAccount
        fields = '__all__'

class ConnectedAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectedAccount
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'last_synced_at']

class BusinessSerializer(serializers.ModelSerializer):
    accounts = DisbursementAccountSerializer(many=True, read_only=True)
    connected_accounts = ConnectedAccountSerializer(many=True, read_only=True)

    class Meta:
        model = Business
        fields = [
            'id',
            'name',
            'trade_name',
            'business_id',
            'legal_form',
            'registration_number',
            'tax_number',
            'category',
            'sector',
            'country',
            'city',
            'location',
            'address',
            'phone',
            'email',
            'website',
            'logo_url',
            'description',
            'verification_tier',
            'trust_score',
            'is_active',
            'daily_payment_limit',
            'primary_momo_number',
            'primary_bank_account',
            'accounts',
            'connected_accounts',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class BusinessOnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            'name',
            'business_id',
            'registration_number',
            'category',
            'phone',
            'email',
            'location',
            'address',
            'logo_url',
            'description',
        ]

class PublicBusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            'id',
            'name',
            'business_id',
            'registration_number',
            'category',
            'sector',
            'location',
            'address',
            'phone',
            'email',
            'website',
            'logo_url',
            'description',
            'verification_tier',
            'trust_score',
            'is_active',
            'primary_momo_number',
            'primary_bank_account',
            'created_at',
        ]

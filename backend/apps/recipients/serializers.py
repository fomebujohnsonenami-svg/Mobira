from rest_framework import serializers
from .models import Recipient
from apps.businesses.models import Business

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'total_disbursed_xaf', 'payout_count']

    def create(self, validated_data):
        if 'business' not in validated_data or not validated_data['business']:
            validated_data['business'] = Business.objects.first()
        return super().create(validated_data)

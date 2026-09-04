import uuid
from decimal import Decimal
from django.utils.text import slugify
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import PaymentLink, Collection
from .serializers import (
    PaymentLinkSerializer,
    CreatePaymentLinkInputSerializer,
    CustomerPayInputSerializer,
    CollectionSerializer
)
from apps.businesses.models import Business
from apps.transactions.models import Transaction, TransactionDirection, TransactionStatus
from apps.audit.models import AuditLog
from integrations.factory import get_payment_provider
from integrations.base.dtos import CollectionRequest


class PaymentLinkListCreateView(APIView):
    """Lists and creates merchant payment links with QR data."""
    permission_classes = [AllowAny]

    def get(self, request):
        links = PaymentLink.objects.filter(is_active=True)
        return Response(PaymentLinkSerializer(links, many=True).data)

    def post(self, request):
        serializer = CreatePaymentLinkInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        business = Business.objects.first()
        title = serializer.validated_data['title']
        base_slug = slugify(title)[:40] or "link"
        unique_slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

        link = PaymentLink.objects.create(
            slug=unique_slug,
            business=business,
            title=title,
            description=serializer.validated_data.get('description', ''),
            amount=serializer.validated_data.get('amount'),
            allow_custom_amount=serializer.validated_data.get('allow_custom_amount', False),
            currency=serializer.validated_data.get('currency', 'GH₵'),
            qr_data=f"https://mobira.app/customer/{unique_slug}"
        )

        return Response(PaymentLinkSerializer(link).data, status=status.HTTP_201_CREATED)


class PaymentLinkDetailView(APIView):
    """Public customer view of a payment link showing merchant badge and billing details."""
    permission_classes = [AllowAny]

    def get(self, request, slug):
        link = PaymentLink.objects.filter(slug=slug, is_active=True).first()
        if not link:
            return Response({"error": "Payment link not found or expired"}, status=status.HTTP_404_NOT_FOUND)
        return Response(PaymentLinkSerializer(link).data)


class DeactivatePaymentLinkView(APIView):
    """Deactivates a payment link."""
    permission_classes = [AllowAny]

    def post(self, request, slug):
        link = PaymentLink.objects.filter(slug=slug).first()
        if not link:
            return Response({"error": "Payment link not found"}, status=status.HTTP_404_NOT_FOUND)
        link.is_active = False
        link.save()
        return Response({"message": f"Payment link '{link.title}' deactivated successfully."})


class CustomerPayView(APIView):
    """
    Simulates customer payment submission on public checkout:
    Dispatches mock collection (USSD prompt or bank transfer), credits ledger, and records collection.
    """
    permission_classes = [AllowAny]

    def post(self, request, slug):
        link = PaymentLink.objects.filter(slug=slug, is_active=True).first()
        if not link:
            return Response({"error": "Payment link not found or expired"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerPayInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        ref_id = f"MOB-COLL-{uuid.uuid4().hex[:10].upper()}"

        channel = data['channel'].upper()
        provider = get_payment_provider(channel)

        col_req = CollectionRequest(
            reference_id=ref_id,
            amount=float(data['amount']),
            currency=link.currency or "GH₵",
            payer_name=data['payer_name'],
            payer_identifier=data['payer_phone'],
            channel=channel,
            narration=f"Payment for {link.title}",
        )

        res = provider.collect(col_req)

        # Record Collection
        collection = Collection.objects.create(
            reference_id=ref_id,
            payment_link=link,
            business=link.business,
            payer_name=data['payer_name'],
            payer_phone=data['payer_phone'],
            channel=channel,
            amount=data['amount'],
            fee=Decimal(str(res.fee)),
            currency=link.currency or "GH₵",
            status="SUCCESS",
            provider_reference=res.provider_reference
        )

        # Update link aggregates
        link.total_collected_xaf += data['amount']
        link.collections_count += 1
        link.save()

        # Record in unified ledger
        Transaction.objects.create(
            reference=ref_id,
            business=link.business,
            direction=TransactionDirection.COLLECTION,
            amount=data['amount'],
            fee=Decimal(str(res.fee)),
            currency=link.currency or "GH₵",
            channel=channel,
            counterparty_name=data['payer_name'],
            counterparty_identifier=data['payer_phone'],
            status=TransactionStatus.SUCCESS,
            provider_reference=res.provider_reference,
            description=f"Collection for {link.title}",
        )

        AuditLog.objects.create(
            action="COLLECTION_RECEIVED",
            business=link.business,
            reference_id=ref_id,
            details={"payer": data['payer_name'], "amount": str(data['amount']), "channel": channel}
        )

        return Response({
            "status": "SUCCESS",
            "message": f"Payment of {data['amount']} {link.currency or 'GH₵'} successfully processed!",
            "collection": CollectionSerializer(collection).data,
            "provider_reference": res.provider_reference,
            "simulated_ussd_approved": True,
        }, status=status.HTTP_200_OK)

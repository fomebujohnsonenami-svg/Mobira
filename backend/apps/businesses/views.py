from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Business, DisbursementAccount, ConnectedAccount, AccountStatus
from .serializers import (
    BusinessSerializer,
    DisbursementAccountSerializer,
    BusinessOnboardingSerializer,
    PublicBusinessProfileSerializer,
    ConnectedAccountSerializer,
)
from integrations.mock.mock_payment_provider import MockPaymentProvider
from integrations.factory import get_payment_provider

def get_or_seed_connected_accounts(business: Business):
    """Ensure baseline demonstration accounts exist for ABC Technologies Ltd."""
    accounts = list(business.connected_accounts.all())
    if not accounts:
        # Seed Card 1: MTN MoMo Business •••• 4821
        acc1 = ConnectedAccount.objects.create(
            business=business,
            provider_name='MTN_MOMO',
            provider_type='MOBILE_MONEY',
            account_name='MTN MoMo Business',
            masked_number='•••• 4821',
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=True,
            currency='XAF',
            daily_limit=5000000.00,
            is_simulated=True,
        )
        # Seed Card 2: Business Bank Account •••• 9184
        acc2 = ConnectedAccount.objects.create(
            business=business,
            provider_name='BANK_TRANSFER',
            provider_type='BANK_ACCOUNT',
            account_name='Business Bank Account',
            masked_number='•••• 9184',
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=False,
            currency='XAF',
            daily_limit=15000000.00,
            is_simulated=True,
        )
        accounts = [acc1, acc2]
    return accounts

from django.db.models import Q

class BusinessListView(generics.ListCreateAPIView):
    """Lists partner businesses across the Mobira network with filtering support."""
    serializer_class = BusinessSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Business.objects.filter(is_active=True)
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(trade_name__icontains=search) |
                Q(business_id__icontains=search) |
                Q(category__icontains=search) |
                Q(sector__icontains=search) |
                Q(phone__icontains=search) |
                Q(location__icontains=search)
            )

        category = self.request.query_params.get('category', '').strip()
        if category and category.upper() != 'ALL':
            qs = qs.filter(Q(category__icontains=category) | Q(sector__icontains=category))

        location = self.request.query_params.get('location', '').strip()
        if location and location.upper() != 'ALL':
            qs = qs.filter(
                Q(location__icontains=location) |
                Q(city__icontains=location) |
                Q(country__icontains=location)
            )

        verified_status = self.request.query_params.get('verified_status', '').strip()
        if verified_status == 'VERIFIED_ONLY':
            qs = qs.exclude(verification_tier='UNVERIFIED')
        elif verified_status == 'UNVERIFIED':
            qs = qs.filter(verification_tier='UNVERIFIED')

        return qs.order_by('-trust_score', 'name')

class BusinessDetailView(generics.RetrieveUpdateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [AllowAny]

class CurrentBusinessProfileView(APIView):
    """Returns profile of currently managed business for demo."""
    permission_classes = [AllowAny]

    def get(self, request):
        business = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not business:
            return Response({"error": "No business found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(BusinessSerializer(business).data)

    def patch(self, request):
        business = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not business:
            return Response({"error": "No business found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = BusinessSerializer(business, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublicBusinessProfileView(APIView):
    """
    Publicly accessible endpoint for verified business profiles.
    Allows customers, partners, and judges to verify company status by business_id.
    """
    permission_classes = [AllowAny]

    def get(self, request, business_id):
        biz = (
            Business.objects.filter(business_id__iexact=business_id).first()
            or Business.objects.filter(id__iexact=business_id).first()
            or Business.objects.filter(name__icontains=business_id.replace('-', ' ')).first()
            or Business.objects.first()
        )
        if not biz:
            return Response({"error": f"Business {business_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(PublicBusinessProfileSerializer(biz).data)

class BusinessOnboardingView(APIView):
    """
    Onboards or updates a business profile with full legal and commercial metadata.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BusinessOnboardingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        biz_id = data.get('business_id', 'PP-ABC-001')
        biz = Business.objects.filter(business_id__iexact=biz_id).first()

        if biz:
            for attr, val in data.items():
                setattr(biz, attr, val)
            biz.save()
        else:
            biz = Business.objects.create(
                **data,
                tax_number=f"TIN-{hash(biz_id) % 10000000}",
                verification_tier='GOLD_VERIFIED',
                trust_score=96,
                is_active=True,
            )

        return Response(
            {
                "message": "Business onboarding completed successfully.",
                "business": BusinessSerializer(biz).data,
                "public_url": f"/business/{biz.business_id}",
            },
            status=status.HTTP_201_CREATED
        )

# ==============================================================================
# CONNECTED ACCOUNTS VIEWS
# ==============================================================================

class ConnectedAccountsListView(APIView):
    """
    Lists all connected payment accounts (MTN MoMo Business, Business Bank Account, etc.)
    for the active operating business.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        biz = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not biz:
            return Response([])

        accounts = get_or_seed_connected_accounts(biz)
        serializer = ConnectedAccountSerializer(accounts, many=True)
        return Response(serializer.data)

class ConnectAccountView(APIView):
    """
    Connects an authorized payment provider account using the MockPaymentProvider adapter.
    
    Zero Real Credential Policy:
    - Never collects PINs, banking passwords, card numbers, or OTPs.
    - Masks identifier into format: •••• 4821
    """
    permission_classes = [AllowAny]

    def post(self, request):
        biz = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not biz:
            return Response({"error": "No active business found."}, status=status.HTTP_404_NOT_FOUND)

        provider_name = request.data.get('provider_name', 'MTN_MOMO')
        provider_type = 'BANK_ACCOUNT' if 'BANK' in provider_name.upper() else 'MOBILE_MONEY'
        
        # Instantiate provider adapter
        provider = MockPaymentProvider(provider_name=provider_name, provider_type=provider_type)
        connection_result = provider.connect_account(request.data)

        # Persist to database
        acc = ConnectedAccount.objects.create(
            business=biz,
            provider_name=connection_result["provider_name"],
            provider_type=connection_result["provider_type"],
            account_name=connection_result["account_name"],
            masked_number=connection_result["masked_number"],
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=request.data.get('is_primary', False),
            currency=connection_result["currency"],
            daily_limit=connection_result["daily_limit"],
            is_simulated=True,
        )

        return Response(
            {
                "message": f"Account {acc.account_name} successfully connected in demo environment.",
                "account": ConnectedAccountSerializer(acc).data,
                "disclaimer": "Simulated connection. No actual banking credentials or PINs were stored or collected.",
            },
            status=status.HTTP_201_CREATED
        )

class DisconnectAccountView(APIView):
    """Revokes a connected payment account."""
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            acc = ConnectedAccount.objects.get(pk=pk)
            acc_name = acc.account_name
            acc.delete()
            return Response({"message": f"Account '{acc_name}' disconnected successfully."})
        except ConnectedAccount.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)

class SetPrimaryAccountView(APIView):
    """Sets a connected account as the primary payout/collection rail."""
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            acc = ConnectedAccount.objects.get(pk=pk)
            # Demote others
            ConnectedAccount.objects.filter(business=acc.business).update(is_primary=False)
            acc.is_primary = True
            acc.save()
            return Response(
                {
                    "message": f"'{acc.account_name}' is now the primary disbursement rail.",
                    "account": ConnectedAccountSerializer(acc).data,
                }
            )
        except ConnectedAccount.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)


class AccountInfoView(APIView):
    """
    Retrieves real-time account information, limits, and telemetry from the PaymentProvider rail.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            acc = ConnectedAccount.objects.get(pk=pk)
            provider = get_payment_provider(acc.provider_name)
            info = provider.get_account_information(str(acc.id))
            return Response({
                "account": ConnectedAccountSerializer(acc).data,
                "provider_info": info,
            })
        except ConnectedAccount.DoesNotExist:
            return Response({"error": "Account not found."}, status=status.HTTP_404_NOT_FOUND)


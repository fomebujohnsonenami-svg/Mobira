from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Payment, PaymentStatus
from .serializers import PaymentSerializer, CreateDisbursementSerializer
from .services import PaymentOrchestrator
from apps.businesses.models import Business
from apps.users.models import User
from apps.audit.models import AuditLog, AuditAction

class DisbursePaymentView(APIView):
    """Initiates single disbursement payout with maker-checker security checks."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CreateDisbursementSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = request.user if request.user and request.user.is_authenticated else User.objects.first()
        business = getattr(user, 'business', None) or Business.objects.first()

        orchestrator = PaymentOrchestrator()
        payment = orchestrator.initiate_disbursement(
            business=business,
            recipient_name=data['recipient_name'],
            account_identifier=data['account_identifier'],
            channel=data['channel'],
            amount=data['amount'],
            currency=data.get('currency', 'GHS'),
            narration=data.get('narration', ''),
            idempotency_key=data.get('idempotency_key'),
            maker_user=user,
            require_preflight=data.get('require_preflight', True)
        )

        # Security Audit Log
        try:
            ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '127.0.0.1')).split(',')[0].strip() or '127.0.0.1'
            action = AuditAction.PAYMENT_AUTHORIZED if payment.requires_checker else AuditAction.PAYMENT_COMPLETED
            AuditLog.objects.create(
                user=user,
                business=business,
                action=action,
                reference_id=payment.reference_id,
                ip_address=ip,
                metadata={
                    'recipient': payment.recipient_name,
                    'account': payment.account_identifier,
                    'channel': payment.channel,
                    'amount': str(payment.amount),
                    'currency': payment.currency,
                    'requires_checker': payment.requires_checker,
                    'status': payment.status,
                }
            )
        except Exception:
            pass

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

class PaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

class PaymentDetailView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field = 'reference_id'
    permission_classes = [AllowAny]

class ApprovePaymentView(APIView):
    """Maker-checker authorization endpoint for payments exceeding threshold."""
    permission_classes = [AllowAny]

    def post(self, request, reference_id):
        payment = Payment.objects.filter(reference_id=reference_id).first()
        if not payment:
            return Response({"error": "Payment reference not found", "code": "NOT_FOUND"}, status=status.HTTP_404_NOT_FOUND)

        if payment.status != PaymentStatus.PENDING_APPROVAL:
            return Response({"error": f"Payment is already in status {payment.status}", "code": "INVALID_STATE"}, status=status.HTTP_400_BAD_REQUEST)

        checker_user = request.user if request.user and request.user.is_authenticated else (
            User.objects.filter(role='ADMIN').first() or User.objects.first()
        )

        # Governance Rule: Maker cannot self-approve if authenticated as maker
        if request.user and request.user.is_authenticated and payment.maker_user_id:
            if str(payment.maker_user_id) == str(request.user.id) and not request.user.is_superuser:
                return Response(
                    {"error": "Maker-checker policy violation: You cannot approve payments initiated by yourself.", "code": "MAKER_CHECKER_VIOLATION"},
                    status=status.HTTP_403_FORBIDDEN
                )

        orchestrator = PaymentOrchestrator()
        updated_payment = orchestrator.execute_on_rail(payment, checker_user=checker_user)

        # Audit Log for dual approval
        try:
            ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '127.0.0.1')).split(',')[0].strip() or '127.0.0.1'
            AuditLog.objects.create(
                user=checker_user,
                business=payment.business,
                action=AuditAction.PAYMENT_COMPLETED if updated_payment.status == PaymentStatus.COMPLETED else AuditAction.PAYMENT_FAILED,
                reference_id=payment.reference_id,
                ip_address=ip,
                metadata={
                    'approved_by': checker_user.email if checker_user else 'Admin',
                    'amount': str(payment.amount),
                    'maker': payment.maker_user.email if payment.maker_user else 'Unknown',
                    'result_status': updated_payment.status,
                }
            )
        except Exception:
            pass

        return Response(PaymentSerializer(updated_payment).data, status=status.HTTP_200_OK)


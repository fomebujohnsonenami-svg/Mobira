"""Payment Orchestration Service handling payouts, rails execution, and ledger updates."""

import uuid
from decimal import Decimal
from datetime import datetime
from django.conf import settings
from django.utils import timezone
from .models import Payment, PaymentStatus
from apps.businesses.models import Business
from apps.recipients.models import Recipient
from apps.transactions.models import Transaction, TransactionDirection, TransactionStatus
from apps.audit.models import AuditLog
from apps.verification.services import VerificationEngine
from integrations.factory import get_payment_provider
from integrations.base.dtos import DisbursementRequest


class PaymentOrchestrator:
    """
    Core engine that coordinates pre-flight verification, dual-approval,
    provider dispatch via PaymentProvider abstraction, and ledger book-keeping.
    """

    def __init__(self):
        self.verification_engine = VerificationEngine()

    def calculate_fee(self, amount: Decimal) -> Decimal:
        fee_pct = Decimal('0.005')  # 0.5%
        fee = amount * fee_pct
        min_fee = Decimal('5.00')
        max_fee = Decimal('2500.00')
        return max(min_fee, min(max_fee, fee.quantize(Decimal('0.01'))))

    def initiate_disbursement(
        self,
        business: Business,
        recipient_name: str,
        account_identifier: str,
        channel: str,
        amount: Decimal,
        currency: str = "GH₵",
        narration: str = "",
        idempotency_key: str = None,
        maker_user=None,
        require_preflight: bool = True
    ) -> Payment:
        # Check idempotency
        if idempotency_key:
            existing = Payment.objects.filter(idempotency_key=idempotency_key).first()
            if existing:
                return existing

        ref_id = f"MOB-DISB-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        threshold = getattr(settings, 'MOBIRA_PLATFORM', {}).get('MAKER_CHECKER_THRESHOLD_XAF', 500000)
        requires_checker = amount >= threshold

        fee = self.calculate_fee(amount)

        # Pre-flight verification
        preflight_verified = False
        confidence = 0.0
        if require_preflight:
            vf = self.verification_engine.verify_preflight(
                channel=channel,
                account_identifier=account_identifier,
                expected_name=recipient_name
            )
            preflight_verified = vf.get("is_verified", False)
            confidence = vf.get("confidence_score", 0.0)

        # Find or create recipient
        recipient = Recipient.objects.filter(
            business=business,
            account_identifier=account_identifier,
            channel=channel
        ).first()

        payment = Payment.objects.create(
            reference_id=ref_id,
            business=business,
            recipient=recipient,
            recipient_name=recipient_name,
            account_identifier=account_identifier,
            channel=channel,
            amount=amount,
            currency=currency,
            fee=fee,
            narration=narration or f"Payout to {recipient_name}",
            status=PaymentStatus.PENDING_APPROVAL if requires_checker else PaymentStatus.PROCESSING,
            idempotency_key=idempotency_key,
            maker_user=maker_user,
            requires_checker=requires_checker,
            is_preflight_verified=preflight_verified,
            preflight_confidence=confidence,
        )

        # If dual approval is required, pause execution until checker approves
        if requires_checker:
            AuditLog.objects.create(
                action="PAYMENT_PENDING_APPROVAL",
                performed_by=maker_user,
                business=business,
                reference_id=ref_id,
                details={"amount": str(amount), "reason": f"Amount exceeds maker-checker threshold ({threshold} GH₵)"}
            )
            return payment

        # Otherwise execute immediately through provider
        return self.execute_on_rail(payment)

    def execute_on_rail(self, payment: Payment, checker_user=None) -> Payment:
        """Executes payment on simulated or real rail and updates ledger."""
        provider = get_payment_provider(payment.channel)

        req = DisbursementRequest(
            reference_id=payment.reference_id,
            amount=float(payment.amount),
            currency=payment.currency,
            recipient_name=payment.recipient_name,
            account_identifier=payment.account_identifier,
            channel=payment.channel,
            narration=payment.narration,
        )

        try:
            res = provider.initiate_payment(req)
            payment.status = PaymentStatus.COMPLETED
            payment.provider_name = provider.provider_name
            payment.provider_reference = res.provider_reference
            payment.completed_at = timezone.now()
            payment.raw_provider_payload = res.raw_response
            if checker_user:
                payment.checker_user = checker_user
                payment.approved_at = timezone.now()
            payment.save()

            # Record in unified ledger
            Transaction.objects.create(
                reference=payment.reference_id,
                business=payment.business,
                direction=TransactionDirection.DISBURSEMENT,
                amount=payment.amount,
                fee=payment.fee,
                currency=payment.currency,
                channel=payment.channel,
                counterparty_name=payment.recipient_name,
                counterparty_identifier=payment.account_identifier,
                status=TransactionStatus.SUCCESS,
                provider_reference=res.provider_reference,
                description=payment.narration or f"Disbursement to {payment.recipient_name}",
            )

            # Update recipient metrics
            if payment.recipient:
                payment.recipient.total_disbursed_xaf += payment.amount
                payment.recipient.payout_count += 1
                payment.recipient.save()

            # Audit record
            AuditLog.objects.create(
                action="PAYMENT_COMPLETED",
                performed_by=payment.maker_user,
                business=payment.business,
                reference_id=payment.reference_id,
                details={
                    "provider_ref": res.provider_reference,
                    "amount": str(payment.amount),
                    "channel": payment.channel
                }
            )

        except Exception as exc:
            payment.status = PaymentStatus.FAILED
            payment.failure_reason = str(exc)
            payment.save()

            Transaction.objects.create(
                reference=payment.reference_id,
                business=payment.business,
                direction=TransactionDirection.DISBURSEMENT,
                amount=payment.amount,
                fee=Decimal('0.00'),
                currency=payment.currency,
                channel=payment.channel,
                counterparty_name=payment.recipient_name,
                counterparty_identifier=payment.account_identifier,
                status=TransactionStatus.FAILED,
                description=f"Failed disbursement: {str(exc)}",
            )

        return payment

import uuid
from django.db import models

class PaymentStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PENDING_APPROVAL = 'PENDING_APPROVAL', 'Pending Dual Approval (Checker)'
    PROCESSING = 'PROCESSING', 'Processing on Telecom/Bank Rail'
    COMPLETED = 'COMPLETED', 'Completed Successfully'
    FAILED = 'FAILED', 'Failed on Rail'
    REJECTED = 'REJECTED', 'Rejected by Checker'

class Payment(models.Model):
    """
    Core disbursement record representing outgoing business payment.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_id = models.CharField(max_length=64, unique=True, db_index=True)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='payments')
    recipient = models.ForeignKey('recipients.Recipient', on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')

    recipient_name = models.CharField(max_length=255)
    account_identifier = models.CharField(max_length=100)
    channel = models.CharField(max_length=30)  # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=10, default='XAF')
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    narration = models.CharField(max_length=255, blank=True)

    status = models.CharField(max_length=30, choices=PaymentStatus.choices, default=PaymentStatus.PROCESSING)
    idempotency_key = models.CharField(max_length=128, blank=True, null=True, db_index=True)

    # Governance: Maker-Checker Dual Authorization
    maker_user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='initiated_payments')
    checker_user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_payments')
    requires_checker = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)

    # Identity Pre-flight Check
    is_preflight_verified = models.BooleanField(default=False)
    preflight_confidence = models.FloatField(default=0.0)

    # Provider details (simulated or live)
    provider_name = models.CharField(max_length=50, blank=True)
    provider_reference = models.CharField(max_length=100, blank=True)
    failure_reason = models.TextField(blank=True)
    raw_provider_payload = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'mobira_payments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.amount} {self.currency} -> {self.recipient_name} ({self.status})"

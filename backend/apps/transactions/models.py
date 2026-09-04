import uuid
from django.db import models

class TransactionDirection(models.TextChoices):
    DISBURSEMENT = 'DISBURSEMENT', 'Disbursement (Payout / Send)'
    COLLECTION = 'COLLECTION', 'Collection (Payment Received)'

class TransactionStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending Rail Clearing'
    SUCCESS = 'SUCCESS', 'Completed / Settled'
    FAILED = 'FAILED', 'Failed'
    REVERSED = 'REVERSED', 'Reversed'

class Transaction(models.Model):
    """
    Central immutable double-entry unified ledger.
    Every disbursement and collection is recorded here for audit and reconciliation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=64, unique=True, db_index=True)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='transactions')
    direction = models.CharField(max_length=20, choices=TransactionDirection.choices)

    amount = models.DecimalField(max_digits=14, decimal_places=2)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='XAF')
    channel = models.CharField(max_length=30)  # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER

    counterparty_name = models.CharField(max_length=255)
    counterparty_identifier = models.CharField(max_length=100)

    status = models.CharField(max_length=20, choices=TransactionStatus.choices, default=TransactionStatus.SUCCESS)
    provider_reference = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'mobira_transactions'
        ordering = ['-created_at']

    def __str__(self):
        sign = "-" if self.direction == TransactionDirection.DISBURSEMENT else "+"
        return f"{self.reference} [{sign}{self.amount} {self.currency}] - {self.counterparty_name}"

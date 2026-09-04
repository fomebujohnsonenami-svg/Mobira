import uuid
from django.db import models

class Recipient(models.Model):
    """
    Saved beneficiaries, suppliers, contractors, and employees with pre-verified trust badges.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='recipients')
    name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, blank=True)
    channel = models.CharField(max_length=30)  # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER
    account_identifier = models.CharField(max_length=100)
    category = models.CharField(max_length=50, default='Supplier')  # Supplier, Contractor, Employee, Utility

    # Pre-verification status
    is_verified = models.BooleanField(default=False)
    verified_name = models.CharField(max_length=255, blank=True)
    verification_confidence = models.FloatField(default=0.0)
    last_verified_at = models.DateTimeField(null=True, blank=True)

    total_disbursed_xaf = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    payout_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mobira_recipients'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.channel} - {self.account_identifier})"


class Beneficiary(Recipient):
    """
    Beneficiary model (proxy of Recipient) for saved recipients, suppliers,
    contractors, and employees with pre-verified trust badges.
    """
    class Meta:
        proxy = True
        verbose_name = 'Beneficiary'
        verbose_name_plural = 'Beneficiaries'


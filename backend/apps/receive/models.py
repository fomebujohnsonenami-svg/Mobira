import uuid
from django.db import models

class PaymentLink(models.Model):
    """
    Branded payment link with verifiable merchant identity for customer checkout.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='payment_links')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='XAF')
    allow_custom_amount = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    qr_data = models.TextField(blank=True)

    total_collected_xaf = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    collections_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'mobira_payment_links'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.slug})"

class Collection(models.Model):
    """
    Incoming transaction collected from customer via payment link or QR code.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_id = models.CharField(max_length=64, unique=True)
    payment_link = models.ForeignKey(PaymentLink, on_delete=models.SET_NULL, null=True, blank=True, related_name='collections')
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='collections')

    payer_name = models.CharField(max_length=255)
    payer_phone = models.CharField(max_length=50)
    channel = models.CharField(max_length=30)  # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='XAF')

    status = models.CharField(max_length=30, default='SUCCESS')
    provider_reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mobira_collections'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.amount} {self.currency} from {self.payer_name}"

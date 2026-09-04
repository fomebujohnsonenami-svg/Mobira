import uuid
from django.db import models

class VerificationTier(models.TextChoices):
    UNVERIFIED = 'UNVERIFIED', 'Unverified'
    BASIC_VERIFIED = 'BASIC_VERIFIED', 'Basic Verified'
    VERIFIED_TIER_1 = 'VERIFIED_TIER_1', 'Verified Tier 1'
    GOLD_VERIFIED = 'GOLD_VERIFIED', 'Gold Verified Business'

class Business(models.Model):
    """
    Core enterprise entity using Mobira for payout orchestration,
    receiving funds, and establishing trusted trade identity.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    trade_name = models.CharField(max_length=255, blank=True)
    business_id = models.CharField(max_length=50, unique=True, default='PP-ABC-001', help_text="Public Business Identifier, e.g. PP-ABC-001")
    legal_form = models.CharField(max_length=50, default='LTD')
    registration_number = models.CharField(max_length=100, unique=True, help_text="Official Registry / RCCM Number")
    tax_number = models.CharField(max_length=100, unique=True, help_text="TIN / NIU")
    category = models.CharField(max_length=100, default='Technology & Software', help_text="Business Category / Industry")
    sector = models.CharField(max_length=100, default='Technology & Software')
    country = models.CharField(max_length=50, default='Ghana')
    city = models.CharField(max_length=100, default='Accra')
    location = models.CharField(max_length=150, default='Accra, Ghana', help_text="City, Country Location")
    address = models.CharField(max_length=255, default='14 Independence Avenue, Ridge, Accra')
    phone = models.CharField(max_length=30, default='+233 24 123 4567')
    email = models.EmailField(default='info@abctechnologies.com')
    website = models.URLField(blank=True, null=True)
    logo_url = models.CharField(max_length=255, blank=True, null=True, help_text="Logo asset URL")
    description = models.TextField(
        blank=True,
        default="Leading provider of enterprise financial orchestration, cloud infrastructure, and verified B2B identity rails across West and Central Africa."
    )

    # Verification & Trust Metrics
    verification_tier = models.CharField(
        max_length=30,
        choices=VerificationTier.choices,
        default=VerificationTier.GOLD_VERIFIED
    )
    trust_score = models.IntegerField(default=96, help_text="Algorithmic score from 0 to 100")
    is_active = models.BooleanField(default=True)
    daily_payment_limit = models.DecimalField(max_digits=12, decimal_places=2, default=15000000.00)

    # Primary payout/collection rails
    primary_momo_number = models.CharField(max_length=30, blank=True)
    primary_bank_account = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mobira_businesses'
        verbose_name_plural = 'Businesses'
        ordering = ['-trust_score', 'name']

    def __str__(self):
        return f"{self.name} [{self.business_id}] ({self.verification_tier})"

class DisbursementAccount(models.Model):
    """Linked mobile wallet or bank account approved for disbursements."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='accounts')
    channel = models.CharField(max_length=30)  # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER
    account_name = models.CharField(max_length=255)
    account_identifier = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mobira_disbursement_accounts'

    def __str__(self):
        return f"{self.account_name} - {self.channel} ({self.account_identifier})"

class AccountStatus(models.TextChoices):
    DEMO_CONNECTED = 'DEMO_CONNECTED', 'Demo Connected'
    CONNECTED = 'CONNECTED', 'Connected'
    DISCONNECTED = 'DISCONNECTED', 'Disconnected'

class ConnectedAccount(models.Model):
    """
    Authorized business payment provider account connection.
    For MVP competition demonstration, all provider accounts operate via MockPaymentProvider.
    Zero real credentials (PINs, passwords, card numbers, OTPs) are ever accepted or stored.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='connected_accounts')
    provider_name = models.CharField(max_length=50)  # MTN_MOMO, BANK_TRANSFER, ORANGE_MONEY
    provider_type = models.CharField(max_length=30, default='MOBILE_MONEY')  # MOBILE_MONEY, BANK_ACCOUNT
    account_name = models.CharField(max_length=255)  # e.g. "MTN MoMo Business", "Business Bank Account"
    masked_number = models.CharField(max_length=50, help_text="Masked account ID, e.g. •••• 4821")
    status = models.CharField(max_length=30, choices=AccountStatus.choices, default=AccountStatus.DEMO_CONNECTED)
    is_primary = models.BooleanField(default=False)
    currency = models.CharField(max_length=10, default='XAF')
    daily_limit = models.DecimalField(max_digits=12, decimal_places=2, default=5000000.00)
    is_simulated = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_synced_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mobira_connected_accounts'
        ordering = ['-is_primary', 'created_at']

    def __str__(self):
        return f"{self.account_name} ({self.masked_number}) - {self.status}"

class BusinessPaymentProfile(models.Model):
    """Payment configuration, limits, and preferences for a business."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name='payment_profile')
    daily_disbursement_limit = models.DecimalField(max_digits=14, decimal_places=2, default=15000000.00)
    single_transaction_limit = models.DecimalField(max_digits=14, decimal_places=2, default=5000000.00)
    maker_checker_threshold = models.DecimalField(max_digits=14, decimal_places=2, default=500000.00)
    requires_dual_approval = models.BooleanField(default=True)
    default_currency = models.CharField(max_length=10, default='GHS')
    default_channel = models.CharField(max_length=30, default='MTN_MOMO')
    can_send_payments = models.BooleanField(default=True)
    can_receive_payments = models.BooleanField(default=True)
    can_create_payment_links = models.BooleanField(default=True)
    auto_verify_recipients = models.BooleanField(default=True)
    webhook_url = models.URLField(blank=True, null=True)
    notification_email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mobira_business_payment_profiles'

    def __str__(self):
        return f"Payment Profile: {self.business.name}"

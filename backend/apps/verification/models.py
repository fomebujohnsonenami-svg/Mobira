import uuid
from django.db import models

class TargetType(models.TextChoices):
    PHONE_MOMO = 'PHONE_MOMO', 'Mobile Money Subscriber'
    BANK_ACCOUNT = 'BANK_ACCOUNT', 'Bank Account / IBAN'
    BUSINESS_RCCM = 'BUSINESS_RCCM', 'Commercial Registry (RCCM)'
    TAX_TIN = 'TAX_TIN', 'Tax Identification Number'

class MatchStatus(models.TextChoices):
    EXACT_MATCH = 'EXACT_MATCH', 'Exact Name Match'
    PARTIAL_MATCH = 'PARTIAL_MATCH', 'Acceptable Partial Match'
    MISMATCH = 'MISMATCH', 'Severe Name Mismatch / Warning'
    NOT_FOUND = 'NOT_FOUND', 'Target Not Found'

class VerificationLog(models.Model):
    """
    Immutable audit record of every pre-flight lookup, name-match enquiry,
    and anti-fraud validation performed on Mobira.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    verification_code = models.CharField(max_length=50, unique=True)
    target_type = models.CharField(max_length=30, choices=TargetType.choices)
    target_identifier = models.CharField(max_length=150)
    expected_name = models.CharField(max_length=255, blank=True)
    registered_name = models.CharField(max_length=255)
    match_status = models.CharField(max_length=30, choices=MatchStatus.choices)
    confidence_score = models.FloatField(default=100.0)
    carrier_or_bank = models.CharField(max_length=100, blank=True)
    is_safe_to_pay = models.BooleanField(default=True)
    raw_details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'verification'
        db_table = 'mobira_verification_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.verification_code} - {self.target_identifier} ({self.match_status})"

class VerificationStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending Review'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    VERIFIED = 'VERIFIED', 'Verified'
    REJECTED = 'REJECTED', 'Rejected'
    EXPIRED = 'EXPIRED', 'Expired'

class BusinessVerification(models.Model):
    """Tracks formal business verification submissions and their outcomes."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='verifications')
    submitted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='verification_submissions')
    status = models.CharField(max_length=30, choices=VerificationStatus.choices, default=VerificationStatus.PENDING, db_index=True)
    verification_type = models.CharField(max_length=50, default='FULL_KYB')  # KYB, RCCM_CHECK, TIN_CHECK
    registration_number = models.CharField(max_length=100, blank=True)
    tax_number = models.CharField(max_length=100, blank=True)
    documents_submitted = models.JSONField(default=list, blank=True)  # list of doc references
    reviewer_notes = models.TextField(blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'verification'
        db_table = 'mobira_business_verifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['business', 'status']),
        ]

    def __str__(self):
        return f"{self.business} - {self.status} ({self.verification_type})"

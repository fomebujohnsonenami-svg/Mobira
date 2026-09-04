import uuid
from django.db import models

class ListCategory(models.TextChoices):
    EMPLOYEES = 'Employees', 'Employees'
    SUPPLIERS = 'Suppliers', 'Suppliers'
    CONTRACTORS = 'Contractors', 'Contractors'
    VENDORS = 'Vendors', 'Vendors'
    OTHER_BENEFICIARIES = 'Other beneficiaries', 'Other beneficiaries'

class PaymentList(models.Model):
    """
    Payment Lists allow businesses to manage reusable groups of recipients.
    Examples:
    - September Employee Payments (48 recipients, GH₵142,000)
    - Monthly Suppliers (20 recipients, GH₵32,500)
    - Contractor Payments (12 recipients, GH₵18,700)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='payment_lists')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=ListCategory.choices, default=ListCategory.EMPLOYEES)
    recipient_count = models.IntegerField(default=0)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='GH₵')
    description = models.TextField(blank=True)
    status = models.CharField(max_length=30, default='READY')  # READY, DISBURSING, COMPLETED
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_disbursed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'mobira_payment_lists'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.category}) - {self.recipient_count} recipients - {self.currency}{self.total_amount}"

class PaymentListRecipient(models.Model):
    """
    Individual beneficiary persisted within a reusable PaymentList.
    Can be updated month-over-month (amount, phone, provider, account).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_list = models.ForeignKey(PaymentList, on_delete=models.CASCADE, related_name='recipients')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    provider = models.CharField(max_length=50, default='MTN_MOMO')
    account = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    role_or_item = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=True)
    returned_account_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mobira_payment_list_recipients'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.name} - {self.account} ({self.amount})"


class PaymentListMember(PaymentListRecipient):
    """
    PaymentListMember model (proxy of PaymentListRecipient) representing an
    individual beneficiary member within a reusable PaymentList.
    """
    class Meta:
        proxy = True
        verbose_name = 'Payment List Member'
        verbose_name_plural = 'Payment List Members'


class BatchStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    VALIDATED = 'VALIDATED', 'Pre-flight Validated'
    EXECUTING = 'EXECUTING', 'Executing Batch Dispatches'
    COMPLETED = 'COMPLETED', 'Batch Completed'
    PARTIAL_FAILURE = 'PARTIAL_FAILURE', 'Completed with Line Item Errors'

class PaymentBatch(models.Model):
    """
    Bulk disbursement batch (e.g. Monthly Staff Payroll, Weekly Farmer Payouts).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch_code = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='payment_batches')
    status = models.CharField(max_length=30, choices=BatchStatus.choices, default=BatchStatus.VALIDATED)

    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    total_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_count = models.IntegerField(default=0)
    processed_count = models.IntegerField(default=0)
    successful_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'mobira_payment_batches'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.batch_code}) - {self.total_count} items"

class PaymentBatchItem(models.Model):
    """Individual line item within a bulk payment batch."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch = models.ForeignKey(PaymentBatch, on_delete=models.CASCADE, related_name='items')
    recipient_name = models.CharField(max_length=255)
    account_identifier = models.CharField(max_length=100)
    channel = models.CharField(max_length=30)  # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    # Line item status
    status = models.CharField(max_length=30, default='PENDING')  # PENDING, PROCESSING, SUCCESS, FAILED
    error_message = models.CharField(max_length=255, blank=True)
    provider_reference = models.CharField(max_length=100, blank=True)
    payment = models.ForeignKey('payments.Payment', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'mobira_payment_batch_items'

    def __str__(self):
        return f"{self.recipient_name} - {self.amount} ({self.status})"

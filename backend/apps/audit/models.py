import uuid
from django.db import models

class AuditAction(models.TextChoices):
    LOGIN = 'login', 'User Login'
    BUSINESS_CREATED = 'business created', 'Business Created'
    VERIFICATION_SUBMITTED = 'verification submitted', 'Verification Submitted'
    VERIFICATION_COMPLETED = 'verification completed', 'Verification Completed'
    PAYMENT_LIST_IMPORTED = 'payment list imported', 'Payment List Imported'
    RECIPIENT_VERIFIED = 'recipient verified', 'Recipient Verified'
    PAYMENT_AUTHORIZED = 'payment authorized', 'Payment Authorized'
    PAYMENT_COMPLETED = 'payment completed', 'Payment Completed'
    PAYMENT_FAILED = 'payment failed', 'Payment Failed'
    PAYMENT_LINK_CREATED = 'payment link created', 'Payment Link Created'

class AuditLog(models.Model):
    """
    Immutable compliance log tracking every financial governance event,
    approval action, pre-flight check, and authorization change.
    Stores: user, business, action, timestamp, metadata.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=100, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
    reference_id = models.CharField(max_length=100, blank=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # Backward compatibility properties
    @property
    def performed_by(self):
        return self.user

    @performed_by.setter
    def performed_by(self, value):
        self.user = value

    @property
    def details(self):
        return self.metadata

    @details.setter
    def details(self, value):
        self.metadata = value

    @property
    def created_at(self):
        return self.timestamp

    class Meta:
        db_table = 'mobira_audit_logs'
        ordering = ['-timestamp']

    def __str__(self):
        user_label = self.user.email if self.user else 'System'
        return f"[{self.action}] by {user_label} at {self.timestamp}"

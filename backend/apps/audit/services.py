from typing import Optional, Dict, Any
from .models import AuditLog, AuditAction

def log_audit_event(
    action: str,
    user=None,
    business=None,
    metadata: Optional[Dict[str, Any]] = None,
    reference_id: str = '',
    ip_address: Optional[str] = None
) -> AuditLog:
    """
    Centralized utility to record an immutable compliance audit log event.
    Tracks user, business, action, timestamp, and metadata.
    """
    return AuditLog.objects.create(
        user=user,
        business=business,
        action=action,
        metadata=metadata or {},
        reference_id=reference_id,
        ip_address=ip_address,
    )

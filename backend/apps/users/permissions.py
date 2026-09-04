from rest_framework.permissions import BasePermission
from .models import UserRole

class IsAdminUserRole(BasePermission):
    """Allows access only to users with the ADMIN role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.ADMIN
        )

class IsFinanceOfficer(BasePermission):
    """Allows access to Finance Officers and Administrators."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [UserRole.ADMIN, UserRole.FINANCE_OFFICER]
        )

class IsAuditor(BasePermission):
    """Allows access to Compliance Auditors and Administrators."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [UserRole.ADMIN, UserRole.AUDITOR]
        )

class IsBusinessMember(BasePermission):
    """Ensures the authenticated user belongs to the operating business entity."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.business_id)

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        # If object has business attribute
        obj_business_id = getattr(obj, 'business_id', None)
        if obj_business_id:
            return str(obj_business_id) == str(request.user.business_id)
        return True

class CanAuthorizePayment(BasePermission):
    """
    Enforces maker-checker governance rule:
    Checker authorizing the payment must have ADMIN or FINANCE_OFFICER role
    and must not be the same user who initiated the payout (maker != checker).
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [UserRole.ADMIN, UserRole.FINANCE_OFFICER]
        )

    def has_object_permission(self, request, view, obj):
        if not self.has_permission(request, view):
            return False
        # obj is a Payment instance
        if hasattr(obj, 'maker_user_id') and obj.maker_user_id:
            if str(obj.maker_user_id) == str(request.user.id):
                # Maker cannot approve their own payment
                return False
        return True

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogListView(generics.ListCreateAPIView):
    """
    Compliance audit log ledger.
    Supports filtering by search query, action type, user, and business.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = AuditLog.objects.all().select_related('user', 'business')
        search = self.request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(action__icontains=search) |
                Q(reference_id__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search)
            )

        action = self.request.query_params.get('action', '').strip()
        if action and action.upper() != 'ALL':
            qs = qs.filter(action__iexact=action)

        return qs.order_by('-timestamp')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

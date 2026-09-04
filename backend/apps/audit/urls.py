from django.urls import path
from .views import AuditLogListView

urlpatterns = [
    path('', AuditLogListView.as_view(), name='audit-list'),
    path('logs/', AuditLogListView.as_view(), name='audit-logs-list'),
]

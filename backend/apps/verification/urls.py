from django.urls import path
from .views import PreflightVerificationView, VerificationHistoryView, PublicDirectoryLookupView

urlpatterns = [
    path('', VerificationHistoryView.as_view(), name='verification-root'),
    path('preflight/', PreflightVerificationView.as_view(), name='verification-preflight'),
    path('history/', VerificationHistoryView.as_view(), name='verification-history'),
    path('lookup/', PublicDirectoryLookupView.as_view(), name='verification-lookup'),
]

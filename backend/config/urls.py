"""Mobira URL Configuration — RESTful API Architecture."""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    """API Root index offering discovery of all Mobira services."""
    return JsonResponse({
        "platform": "Mobira",
        "tagline": "A trusted business payment and identity platform built on existing payment infrastructure.",
        "proposition": "PAY • RECEIVE • VERIFY • GROW",
        "notice": "Mobira is NOT a bank, NOT a wallet, and NOT a replacement for MoMo or banks. All rails simulated.",
        "architecture": {
            "framework": "Django REST Framework",
            "provider_abstraction": "PaymentProvider (Multi-Rail Interface)",
            "service_layers": "PaymentOrchestrator, VerificationEngine, AccountService, AuditService",
        },
        "endpoints": {
            "auth": "/api/auth/",
            "businesses": "/api/businesses/",
            "verification": "/api/verification/",
            "accounts": "/api/accounts/",
            "payment_lists": "/api/payment-lists/",
            "recipients": "/api/recipients/",
            "payments": "/api/payments/",
            "transactions": "/api/transactions/",
            "receive": "/api/receive/",
            "payment_links": "/api/payment-links/",
            "analytics": "/api/analytics/",
            "audit": "/api/audit/",
        }
    })


def health_check(request):
    """Health check endpoint for Docker & load balancers."""
    return JsonResponse({"status": "healthy", "service": "mobira-api", "version": "1.0.0"})


def reset_demo_view(request):
    """Reset the database to initial demonstration state."""
    from django.core.management import call_command
    try:
        call_command('seed_demo_data')
        return JsonResponse({
            "status": "success",
            "message": "Demo data reset successfully to initial state.",
            "notice": "All businesses, verification states, payment lists, beneficiaries, transactions, and balances restored."
        })
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


# Core API URL Patterns organized logically per Part 35
api_patterns = [
    path('', api_root, name='api-root'),
    path('health/', health_check, name='api-health'),
    path('reset-demo/', reset_demo_view, name='api-reset-demo'),
    path('auth/', include('apps.users.urls')),
    path('businesses/', include('apps.businesses.urls')),
    path('verification/', include('apps.verification.urls')),
    path('accounts/', include('apps.businesses.accounts_urls')),
    path('payment-lists/', include('apps.payment_lists.urls')),
    path('recipients/', include('apps.recipients.urls')),
    path('payments/', include('apps.payments.urls')),
    path('transactions/', include('apps.transactions.urls')),
    path('receive/', include('apps.receive.urls')),
    path('payment-links/', include('apps.receive.payment_links_urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('audit/', include('apps.audit.urls')),
]

urlpatterns = [
    path('', api_root, name='root'),
    path('health/', health_check, name='health'),
    path('admin/', admin.site.urls),

    # Standard /api/ endpoints (PART 35)
    path('api/', include(api_patterns)),

    # Versioned /api/v1/ endpoints for backwards compatibility
    path('api/v1/', include(api_patterns)),
]

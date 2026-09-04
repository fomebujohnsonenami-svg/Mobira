"""URL routing for /api/payment-links/ endpoints."""

from django.urls import path
from .views import (
    PaymentLinkListCreateView,
    PaymentLinkDetailView,
    DeactivatePaymentLinkView,
    CustomerPayView,
)

urlpatterns = [
    path('', PaymentLinkListCreateView.as_view(), name='payment-links-list-create'),
    path('<slug:slug>/', PaymentLinkDetailView.as_view(), name='payment-links-detail'),
    path('<slug:slug>/deactivate/', DeactivatePaymentLinkView.as_view(), name='payment-links-deactivate'),
    path('<slug:slug>/pay/', CustomerPayView.as_view(), name='payment-links-customer-pay'),
]

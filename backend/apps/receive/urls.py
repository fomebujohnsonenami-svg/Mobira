from django.urls import path
from .views import (
    PaymentLinkListCreateView,
    PaymentLinkDetailView,
    CustomerPayView,
)

urlpatterns = [
    path('', PaymentLinkListCreateView.as_view(), name='receive-root'),
    path('links/', PaymentLinkListCreateView.as_view(), name='receive-links'),
    path('links/<slug:slug>/', PaymentLinkDetailView.as_view(), name='receive-link-detail'),
    path('links/<slug:slug>/pay/', CustomerPayView.as_view(), name='receive-customer-pay'),
]

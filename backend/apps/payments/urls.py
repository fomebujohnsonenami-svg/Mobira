from django.urls import path
from .views import DisbursePaymentView, PaymentListView, PaymentDetailView, ApprovePaymentView

urlpatterns = [
    path('', PaymentListView.as_view(), name='payment-list'),
    path('disburse/', DisbursePaymentView.as_view(), name='payment-disburse'),
    path('initiate/', DisbursePaymentView.as_view(), name='payment-initiate'),
    path('<str:reference_id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('<str:reference_id>/approve/', ApprovePaymentView.as_view(), name='payment-approve'),
]

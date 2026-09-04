from django.urls import path
from .views import (
    PaymentListsView,
    PaymentListDetailView,
    DuplicatePaymentListView,
    VerifyPaymentListRecipientsView,
    DisbursePaymentListView,
    ParsePaymentListFileView,
    SaveImportedPaymentListView,
    PaymentBatchListCreateView,
    PaymentBatchDetailView,
    ExecuteBatchView,
)

urlpatterns = [
    path('lists/', PaymentListsView.as_view(), name='payment-lists-list-create'),
    path('lists/<uuid:pk>/', PaymentListDetailView.as_view(), name='payment-list-detail'),
    path('lists/<uuid:pk>/duplicate/', DuplicatePaymentListView.as_view(), name='payment-list-duplicate'),
    path('lists/<uuid:pk>/verify-recipients/', VerifyPaymentListRecipientsView.as_view(), name='payment-list-verify-recipients'),
    path('lists/<uuid:pk>/disburse/', DisbursePaymentListView.as_view(), name='payment-list-disburse'),
    path('parse-file/', ParsePaymentListFileView.as_view(), name='payment-lists-parse-file'),
    path('import-save/', SaveImportedPaymentListView.as_view(), name='payment-lists-import-save'),
    path('', PaymentBatchListCreateView.as_view(), name='batch-list-create'),
    path('<str:batch_code>/', PaymentBatchDetailView.as_view(), name='batch-detail'),
    path('<str:batch_code>/execute/', ExecuteBatchView.as_view(), name='batch-execute'),
]

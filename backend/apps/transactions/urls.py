from django.urls import path
from .views import TransactionListView, TransactionDetailView, ExportStatementCSVView

urlpatterns = [
    path('', TransactionListView.as_view(), name='transaction-list'),
    path('export/csv/', ExportStatementCSVView.as_view(), name='transaction-export-csv'),
    path('<str:reference>/', TransactionDetailView.as_view(), name='transaction-detail'),
]

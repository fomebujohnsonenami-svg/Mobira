import csv
from django.http import HttpResponse
from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionListView(generics.ListAPIView):
    """
    Searchable, filterable list of all ledger transactions (Disbursements & Collections).
    """
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Transaction.objects.all()
        direction = self.request.query_params.get('direction')
        channel = self.request.query_params.get('channel')
        status_val = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if direction:
            qs = qs.filter(direction__iexact=direction)
        if channel:
            qs = qs.filter(channel__iexact=channel)
        if status_val:
            qs = qs.filter(status__iexact=status_val)
        if search:
            qs = qs.filter(
                Q(reference__icontains=search) |
                Q(counterparty_name__icontains=search) |
                Q(counterparty_identifier__icontains=search) |
                Q(description__icontains=search)
            )

        return qs

class TransactionDetailView(generics.RetrieveAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    lookup_field = 'reference'
    permission_classes = [AllowAny]

class ExportStatementCSVView(APIView):
    """
    Exports clean, audit-ready financial statement in CSV format for enterprise accounting.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="mobira_statement_2026.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Reference',
            'Date & Time (UTC)',
            'Direction',
            'Counterparty Name',
            'Counterparty Account',
            'Payment Rail',
            'Gross Amount (XAF)',
            'Fee (XAF)',
            'Net (XAF)',
            'Status',
            'Provider Reference',
            'Description',
        ])

        for tx in Transaction.objects.all()[:500]:
            net = tx.amount - tx.fee if tx.direction == 'COLLECTION' else -(tx.amount + tx.fee)
            writer.writerow([
                tx.reference,
                tx.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                tx.direction,
                tx.counterparty_name,
                tx.counterparty_identifier,
                tx.channel,
                tx.amount,
                tx.fee,
                net,
                tx.status,
                tx.provider_reference,
                tx.description,
            ])

        return response

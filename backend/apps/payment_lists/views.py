import uuid
from decimal import Decimal
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import (
    PaymentBatch,
    PaymentBatchItem,
    BatchStatus,
    PaymentList,
    PaymentListRecipient,
    ListCategory,
)
from .serializers import (
    PaymentBatchSerializer,
    CreateBatchInputSerializer,
    PaymentListSerializer,
    PaymentListRecipientSerializer,
)
from apps.businesses.models import Business
from apps.payments.services import PaymentOrchestrator

def get_or_seed_payment_lists(business: Business):
    """Seed default payment lists and their persisted recipients if none exist."""
    lists = list(PaymentList.objects.filter(business=business))
    if not lists:
        # Example 1: September Employee Payments (48 recipients, GH₵142,000)
        l1 = PaymentList.objects.create(
            business=business,
            name="September Employee Payments",
            category=ListCategory.EMPLOYEES,
            recipient_count=48,
            total_amount=Decimal("142000.00"),
            currency="GH₵",
            description="Monthly recurring staff compensation with automated telecom pre-flight check.",
            status="READY",
        )
        emp_data = [
            ("Kwame Mensah", "024 112 3344", "MTN_MOMO", "024 112 3344", Decimal("4800.00"), "Lead Systems Architect"),
            ("Ama Boateng", "054 223 4455", "MTN_MOMO", "054 223 4455", Decimal("4500.00"), "Senior Product Designer"),
            ("Kofi Mensah", "020 334 5566", "ORANGE_MONEY", "020 334 5566", Decimal("4200.00"), "DevOps Specialist"),
            ("Abena Osei", "024 998 1122", "BANK_TRANSFER", "01004 88210 4821", Decimal("5600.00"), "Finance Controller"),
            ("Yaw Frimpong", "024 556 7788", "MTN_MOMO", "024 556 7788", Decimal("3900.00"), "Backend Engineer"),
        ]
        for name, phone, prov, acc, amt, role in emp_data:
            PaymentListRecipient.objects.create(
                payment_list=l1,
                name=name,
                phone=phone,
                provider=prov,
                account=acc,
                amount=amt,
                role_or_item=role,
                is_verified=True,
                returned_account_name=name,
            )

        # Example 2: Monthly Suppliers (20 recipients, GH₵32,500)
        l2 = PaymentList.objects.create(
            business=business,
            name="Monthly Suppliers",
            category=ListCategory.SUPPLIERS,
            recipient_count=20,
            total_amount=Decimal("32500.00"),
            currency="GH₵",
            description="Verified raw input suppliers and regional freight aggregators.",
            status="READY",
        )
        sup_data = [
            ("Ashanti Agro-Produce Ltd", "024 776 5544", "MTN_MOMO", "024 776 5544", Decimal("8500.00"), "Organic Cocoa Beans Batch #41"),
            ("Volta Logistics Transport", "050 112 9900", "MTN_MOMO", "050 112 9900", Decimal("6200.00"), "Refrigerated Transport Delivery"),
            ("Koforidua Packaging Co", "020 083 3410", "BANK_TRANSFER", "02008 33410 9184", Decimal("4800.00"), "Corrugated Export Boxes"),
            ("Central Region Cold Storage", "024 334 1122", "MTN_MOMO", "024 334 1122", Decimal("5100.00"), "Storage Unit Rental"),
        ]
        for name, phone, prov, acc, amt, role in sup_data:
            PaymentListRecipient.objects.create(
                payment_list=l2,
                name=name,
                phone=phone,
                provider=prov,
                account=acc,
                amount=amt,
                role_or_item=role,
                is_verified=True,
                returned_account_name=name,
            )

        # Example 3: Contractor Payments (12 recipients, GH₵18,700)
        l3 = PaymentList.objects.create(
            business=business,
            name="Contractor Payments",
            category=ListCategory.CONTRACTORS,
            recipient_count=12,
            total_amount=Decimal("18700.00"),
            currency="GH₵",
            description="External specialist development and engineering milestone disbursements.",
            status="READY",
        )
        cont_data = [
            ("DevStack Solutions Ghana", "024 881 2299", "MTN_MOMO", "024 881 2299", Decimal("6500.00"), "Smart Contract Audit & Pen-Test"),
            ("Accra Legal Advisors LLP", "030 221 0099", "BANK_TRANSFER", "01009 55410 2210", Decimal("5200.00"), "Regulatory Compliance Filing"),
            ("PixelCraft UX Studio", "055 443 2211", "MTN_MOMO", "055 443 2211", Decimal("4000.00"), "Design System & Mobile Mockups"),
            ("CloudPeak DevOps Consultancy", "024 556 7788", "MTN_MOMO", "024 556 7788", Decimal("3000.00"), "Kubernetes Cluster Provisioning"),
        ]
        for name, phone, prov, acc, amt, role in cont_data:
            PaymentListRecipient.objects.create(
                payment_list=l3,
                name=name,
                phone=phone,
                provider=prov,
                account=acc,
                amount=amt,
                role_or_item=role,
                is_verified=True,
                returned_account_name=name,
            )

        lists = [l1, l2, l3]
    return lists

class PaymentListsView(APIView):
    """
    Payment Lists allow businesses to manage reusable groups of recipients.
    Categories: Employees, Suppliers, Contractors, Vendors, Other beneficiaries.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        business = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not business:
            return Response({"error": "No business found."}, status=status.HTTP_404_NOT_FOUND)

        category = request.query_params.get('category')
        lists = get_or_seed_payment_lists(business)
        if category and category != 'All':
            lists = [l for l in lists if l.category.lower() == category.lower()]

        return Response(PaymentListSerializer(lists, many=True).data)

    def post(self, request):
        business = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not business:
            return Response({"error": "No business found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        new_list = PaymentList.objects.create(
            business=business,
            name=data.get('name', 'New Reusable Payment List'),
            category=data.get('category', ListCategory.EMPLOYEES),
            recipient_count=int(data.get('recipient_count', 0)),
            total_amount=Decimal(str(data.get('total_amount', '0.00'))),
            currency=data.get('currency', 'GH₵'),
            description=data.get('description', ''),
            status='READY',
        )

        # If initial recipients provided, save them
        raw_recipients = data.get('recipients', [])
        for r in raw_recipients:
            PaymentListRecipient.objects.create(
                payment_list=new_list,
                name=r.get('name', ''),
                phone=r.get('phone', ''),
                provider=r.get('provider', 'MTN_MOMO'),
                account=r.get('account', ''),
                amount=Decimal(str(r.get('amount', 0))),
                role_or_item=r.get('role_or_item', ''),
                is_verified=True,
                returned_account_name=r.get('name', ''),
            )

        return Response(PaymentListSerializer(new_list).data, status=status.HTTP_201_CREATED)

class PaymentListDetailView(APIView):
    """
    Open List, Edit List, Delete List.
    Allows updating amounts, recipients, provider, account information
    month-over-month without re-uploading the file!
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            plist = PaymentList.objects.get(pk=pk)
            return Response(PaymentListSerializer(plist).data)
        except PaymentList.DoesNotExist:
            return Response({"error": "Payment list not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            plist = PaymentList.objects.get(pk=pk)
            data = request.data

            if 'name' in data:
                plist.name = data['name']
            if 'category' in data:
                plist.category = data['category']
            if 'description' in data:
                plist.description = data['description']

            # If updated recipient array provided, update persisted line items!
            if 'recipients' in data:
                raw_recipients = data['recipients']
                # Replace or update recipients
                plist.recipients.all().delete()
                total_amt = Decimal('0.00')
                for r in raw_recipients:
                    amt = Decimal(str(r.get('amount', 0)))
                    total_amt += amt
                    PaymentListRecipient.objects.create(
                        payment_list=plist,
                        name=r.get('name', ''),
                        phone=r.get('phone', ''),
                        provider=r.get('provider', 'MTN_MOMO'),
                        account=r.get('account', ''),
                        amount=amt,
                        role_or_item=r.get('role_or_item', ''),
                        is_verified=r.get('is_verified', True),
                        returned_account_name=r.get('returned_account_name', r.get('name', '')),
                    )
                plist.recipient_count = len(raw_recipients)
                plist.total_amount = total_amt

            plist.save()
            return Response(PaymentListSerializer(plist).data)
        except PaymentList.DoesNotExist:
            return Response({"error": "Payment list not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            plist = PaymentList.objects.get(pk=pk)
            name = plist.name
            plist.delete()
            return Response({"message": f"Payment list '{name}' deleted successfully."})
        except PaymentList.DoesNotExist:
            return Response({"error": "Payment list not found."}, status=status.HTTP_404_NOT_FOUND)

class DuplicatePaymentListView(APIView):
    """
    Duplicate List: clones list and all recipients so next month
    the user can use the same group and adjust amounts/recipients.
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            original = PaymentList.objects.get(pk=pk)
            new_name = request.data.get('name') or f"{original.name} (Copy)"

            duplicated = PaymentList.objects.create(
                business=original.business,
                name=new_name,
                category=original.category,
                recipient_count=original.recipient_count,
                total_amount=original.total_amount,
                currency=original.currency,
                description=f"Cloned from {original.name}. {original.description}".strip(),
                status="READY",
            )

            for rec in original.recipients.all():
                PaymentListRecipient.objects.create(
                    payment_list=duplicated,
                    name=rec.name,
                    phone=rec.phone,
                    provider=rec.provider,
                    account=rec.account,
                    amount=rec.amount,
                    role_or_item=rec.role_or_item,
                    is_verified=rec.is_verified,
                    returned_account_name=rec.returned_account_name,
                )

            return Response(
                {
                    "message": f"List '{original.name}' duplicated as '{duplicated.name}'.",
                    "payment_list": PaymentListSerializer(duplicated).data,
                },
                status=status.HTTP_201_CREATED
            )
        except PaymentList.DoesNotExist:
            return Response({"error": "Payment list not found."}, status=status.HTTP_404_NOT_FOUND)

class VerifyPaymentListRecipientsView(APIView):
    """
    Pre-payment verification engine:
    Checks registered KYC name with mock provider.
    Demonstrates:
    - 🟢 MATCH VERIFIED: Saved = Kwame Mensah, Returned = Kwame Mensah
    - 🔴 NAME MISMATCH: Saved = Kwame Mensah, Returned = Yaw Mensah
    Enforces: Do not allow the demo to silently process an unresolved mismatch.
    """
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            plist = PaymentList.objects.get(pk=pk)
            simulate_mismatch = request.data.get('simulate_mismatch', False)

            recipients = list(plist.recipients.all())
            verification_results = []
            has_mismatch = False

            for idx, rec in enumerate(recipients):
                # If simulate_mismatch is True, make the 2nd recipient have a mismatch:
                # Saved: Kwame Mensah -> Returned: Yaw Mensah
                is_mismatch_item = simulate_mismatch and (idx == 1 or idx == 0)

                if is_mismatch_item:
                    returned_name = "Yaw Mensah"
                    match_status = "NAME_MISMATCH"
                    is_match = False
                    has_mismatch = True
                    error_message = "Recipient details don't match the saved beneficiary."
                else:
                    returned_name = rec.name
                    match_status = "MATCH_VERIFIED"
                    is_match = True
                    error_message = None

                # Mask phone for privacy: e.g. 024 XXX XXXX
                phone_parts = rec.phone.split()
                if len(phone_parts) >= 3:
                    masked_phone = f"{phone_parts[0]} XXX XXXX"
                elif len(rec.phone) >= 6:
                    masked_phone = f"{rec.phone[:3]} XXX XXXX"
                else:
                    masked_phone = "024 XXX XXXX"

                verification_results.append({
                    "id": str(rec.id),
                    "saved_recipient_name": rec.name,
                    "saved_phone": rec.phone,
                    "masked_phone": masked_phone,
                    "provider": rec.provider,
                    "account": rec.account,
                    "amount": float(rec.amount),
                    "returned_account_name": returned_name,
                    "match_status": match_status,
                    "is_match": is_match,
                    "error_message": error_message,
                })

            return Response({
                "payment_list_id": str(plist.id),
                "list_name": plist.name,
                "total_checked": len(verification_results),
                "has_mismatch": has_mismatch,
                "matched_count": sum(1 for r in verification_results if r['is_match']),
                "mismatched_count": sum(1 for r in verification_results if not r['is_match']),
                "results": verification_results,
            })
        except PaymentList.DoesNotExist:
            return Response({"error": "Payment list not found."}, status=status.HTTP_404_NOT_FOUND)

class DisbursePaymentListView(APIView):
    """Executes a simulated disbursement run for an entire reusable payment list."""
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            plist = PaymentList.objects.get(pk=pk)

            # Safety check: if there is an unresolved mismatch in payload, do not allow silent processing!
            has_unresolved_mismatch = request.data.get('has_unresolved_mismatch', False)
            if has_unresolved_mismatch:
                return Response(
                    {
                        "error": "Cannot disburse funds with unresolved KYC name mismatches. Please review and resolve recipient details first."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            plist.status = 'COMPLETED'
            plist.last_disbursed_at = timezone.now()
            plist.save()
            return Response({
                "message": f"Disbursement of {plist.currency}{plist.total_amount:,.2f} to {plist.recipient_count} recipients initiated successfully.",
                "payment_list": PaymentListSerializer(plist).data,
            })
        except PaymentList.DoesNotExist:
            return Response({"error": "Payment list not found."}, status=status.HTTP_404_NOT_FOUND)

class ParsePaymentListFileView(APIView):
    """
    Parses an uploaded .csv or .xlsx file, validates columns, and returns parsed items.
    Strictly read-only: does not create database records.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response(
                {"error": "No file uploaded. Expected 'file' parameter with .csv or .xlsx extension."},
                status=status.HTTP_400_BAD_REQUEST
            )

        filename = uploaded_file.name
        if not (filename.lower().endswith('.csv') or filename.lower().endswith('.xlsx')):
            return Response(
                {"error": "Unsupported file format. Please upload a .csv or .xlsx file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from .parser import parse_payment_list_file
            file_bytes = uploaded_file.read()
            rows = parse_payment_list_file(filename, file_bytes)
            valid_count = sum(1 for r in rows if r.get('is_valid'))
            total_volume = sum(float(r.get('amount', 0)) for r in rows if r.get('is_valid'))

            return Response({
                "filename": filename,
                "total_rows": len(rows),
                "valid_count": valid_count,
                "error_count": len(rows) - valid_count,
                "total_volume": total_volume,
                "rows": rows,
            })
        except Exception as e:
            return Response({"error": f"Failed to parse file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class SaveImportedPaymentListView(APIView):
    """
    Permanently commits a validated payment list after user explicitly confirms.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        business = Business.objects.filter(name__icontains='ABC Technologies').first() or Business.objects.first()
        if not business:
            return Response({"error": "No business found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        name = data.get('name', 'Imported Payment List')
        category = data.get('category', ListCategory.EMPLOYEES)
        currency = data.get('currency', 'GH₵')
        description = data.get('description', '')
        rows = data.get('rows', [])

        valid_rows = [r for r in rows if r.get('is_valid', True)]
        total_amount = sum(Decimal(str(r.get('amount', 0))) for r in valid_rows)

        plist = PaymentList.objects.create(
            business=business,
            name=name,
            category=category,
            recipient_count=len(valid_rows),
            total_amount=total_amount,
            currency=currency,
            description=description,
            status='READY',
        )

        for r in valid_rows:
            PaymentListRecipient.objects.create(
                payment_list=plist,
                name=r.get('name', ''),
                phone=r.get('phone', ''),
                provider=r.get('provider', 'MTN_MOMO'),
                account=r.get('account', ''),
                amount=Decimal(str(r.get('amount', 0))),
                role_or_item=r.get('role_or_item', ''),
                is_verified=True,
                returned_account_name=r.get('name', ''),
            )

        return Response(
            {
                "message": f"Payment list '{plist.name}' saved permanently with {plist.recipient_count} recipients.",
                "payment_list": PaymentListSerializer(plist).data,
            },
            status=status.HTTP_201_CREATED
        )

# Legacy Batch endpoints
class PaymentBatchListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        batches = PaymentBatch.objects.all()
        return Response(PaymentBatchSerializer(batches, many=True).data)

    def post(self, request):
        serializer = CreateBatchInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        business = Business.objects.first()
        title = serializer.validated_data['title']
        raw_items = serializer.validated_data['items']

        batch_code = f"BATCH-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        total_amt = Decimal('0.00')
        for item in raw_items:
            total_amt += Decimal(str(item['amount']))

        batch = PaymentBatch.objects.create(
            batch_code=batch_code,
            title=title,
            business=business,
            status=BatchStatus.VALIDATED,
            total_amount=total_amt,
            total_count=len(raw_items),
        )

        orchestrator = PaymentOrchestrator()
        total_fee = Decimal('0.00')
        for item in raw_items:
            amt = Decimal(str(item['amount']))
            fee = orchestrator.calculate_fee(amt)
            total_fee += fee
            PaymentBatchItem.objects.create(
                batch=batch,
                recipient_name=item['recipient_name'],
                account_identifier=item['account_identifier'],
                channel=item['channel'],
                amount=amt,
                fee=fee,
                status="PENDING"
            )

        batch.total_fee = total_fee
        batch.save()

        return Response(PaymentBatchSerializer(batch).data, status=status.HTTP_201_CREATED)

class PaymentBatchDetailView(generics.RetrieveAPIView):
    queryset = PaymentBatch.objects.all()
    serializer_class = PaymentBatchSerializer
    lookup_field = 'batch_code'
    permission_classes = [AllowAny]

class ExecuteBatchView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, batch_code):
        batch = PaymentBatch.objects.filter(batch_code=batch_code).first()
        if not batch:
            return Response({"error": "Batch not found"}, status=status.HTTP_404_NOT_FOUND)

        batch.status = BatchStatus.COMPLETED
        batch.completed_at = timezone.now()
        batch.save()
        return Response(PaymentBatchSerializer(batch).data, status=status.HTTP_200_OK)

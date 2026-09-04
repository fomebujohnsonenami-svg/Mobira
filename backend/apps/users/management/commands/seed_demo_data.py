import uuid
import random
from decimal import Decimal
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone

# Domain Models
from apps.businesses.models import (
    Business,
    ConnectedAccount,
    DisbursementAccount,
    BusinessPaymentProfile,
    VerificationTier,
    AccountStatus,
)
from apps.users.models import User, UserRole
from apps.recipients.models import Recipient
from apps.payment_lists.models import (
    PaymentList,
    PaymentListRecipient,
    ListCategory,
)
from apps.transactions.models import (
    Transaction,
    TransactionDirection,
    TransactionStatus,
)
from apps.payments.models import Payment, PaymentStatus
from apps.receive.models import PaymentLink, Collection
from apps.verification.models import (
    BusinessVerification,
    VerificationStatus,
    VerificationLog,
    TargetType,
    MatchStatus,
)
from apps.audit.models import AuditLog, AuditAction


class Command(BaseCommand):
    help = 'Seeds the PostgreSQL database with comprehensive Mobira fictional demo data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('========================================'))
        self.stdout.write(self.style.NOTICE('MOBIRA DEMO DATA SEEDER (POSTGRESQL)'))
        self.stdout.write(self.style.NOTICE('========================================'))

        # 1. CLEANUP IN SAFE REVERSE DEPENDENCY ORDER
        self.stdout.write('Purging old demo data...')
        AuditLog.objects.all().delete()
        VerificationLog.objects.all().delete()
        BusinessVerification.objects.all().delete()
        Collection.objects.all().delete()
        PaymentLink.objects.all().delete()
        Transaction.objects.all().delete()
        Payment.objects.all().delete()
        PaymentListRecipient.objects.all().delete()
        PaymentList.objects.all().delete()
        Recipient.objects.all().delete()
        BusinessPaymentProfile.objects.all().delete()
        DisbursementAccount.objects.all().delete()
        ConnectedAccount.objects.all().delete()
        User.objects.all().delete()
        Business.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('[OK] Cleanup completed.'))

        # 2. CREATE BUSINESSES
        self.stdout.write('Seeding verified businesses...')
        now = timezone.now()

        # Main business: ABC Technologies Ltd (PP-ABC-001)
        b1 = Business.objects.create(
            id=uuid.uuid4(),
            name='ABC Technologies Ltd',
            trade_name='ABC Technologies',
            business_id='PP-ABC-001',
            legal_form='LTD',
            registration_number='RC/GH/2021/B/8921',
            tax_number='GHA-TIN-2021-00847',
            category='Technology & Software',
            sector='Technology & Software',
            country='Ghana',
            city='Accra',
            location='Accra, Ghana',
            address='14 Independence Avenue, Ridge, Accra',
            phone='+233 24 123 4567',
            email='info@abctechnologies.com',
            website='https://abctechnologies.com',
            description='Enterprise cloud and financial technology infrastructure provider.',
            verification_tier=VerificationTier.GOLD_VERIFIED,
            trust_score=96,
            is_active=True,
            daily_payment_limit=Decimal('15000000.00'),
            primary_momo_number='+233 24 123 4567',
            primary_bank_account='GCB-9184-ACCRA',
        )

        # Second business: ABC Fashion (PP-FASHION-001)
        b2 = Business.objects.create(
            id=uuid.uuid4(),
            name='ABC Fashion',
            trade_name='ABC Fashion House',
            business_id='PP-FASHION-001',
            legal_form='LTD',
            registration_number='RC/GH/2022/F/3456',
            tax_number='GHA-TIN-2022-01234',
            category='Fashion & Retail',
            sector='Fashion & Retail',
            country='Ghana',
            city='Accra',
            location='Accra, Ghana',
            address='28 Oxford Street, Osu, Accra',
            phone='+233 24 987 6543',
            email='info@abcfashion.com',
            website='https://abcfashion.com',
            description='Bespoke contemporary African couture, luxury textiles, and prêt-à-porter fashion.',
            verification_tier=VerificationTier.GOLD_VERIFIED,
            trust_score=92,
            is_active=True,
            daily_payment_limit=Decimal('5000000.00'),
            primary_momo_number='+233 24 987 6543',
            primary_bank_account='ECOBANK-7733-OSU',
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created 2 Verified Businesses ({b1.name}, {b2.name})'))

        # 3. CREATE USERS
        self.stdout.write('Seeding business team members...')
        u_admin = User.objects.create_user(
            username='kwame.asante',
            email='admin@abctechnologies.com',
            password='demo2026',
            first_name='Kwame',
            last_name='Asante',
            role=UserRole.ADMIN,
            business=b1,
            phone_number='+233 24 111 2233',
            is_verified=True,
        )

        u_finance = User.objects.create_user(
            username='ama.mensah',
            email='finance@abctechnologies.com',
            password='demo2026',
            first_name='Ama',
            last_name='Mensah',
            role=UserRole.FINANCE_OFFICER,
            business=b1,
            phone_number='+233 24 222 3344',
            is_verified=True,
        )

        u_auditor = User.objects.create_user(
            username='kofi.boateng',
            email='auditor@abctechnologies.com',
            password='demo2026',
            first_name='Kofi',
            last_name='Boateng',
            role=UserRole.AUDITOR,
            business=b1,
            phone_number='+233 24 333 4455',
            is_verified=True,
        )

        u_fashion = User.objects.create_user(
            username='efua.darkwa',
            email='manager@abcfashion.com',
            password='demo2026',
            first_name='Efua',
            last_name='Darkwa',
            role=UserRole.ADMIN,
            business=b2,
            phone_number='+233 24 444 5566',
            is_verified=True,
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {User.objects.count()} authenticated users'))

        # 4. BUSINESS PAYMENT PROFILES
        self.stdout.write('Configuring business payment profiles...')
        BusinessPaymentProfile.objects.create(
            business=b1,
            daily_disbursement_limit=Decimal('15000000.00'),
            single_transaction_limit=Decimal('5000000.00'),
            maker_checker_threshold=Decimal('500000.00'),
            requires_dual_approval=True,
            default_currency='GH₵',
            default_channel='MTN_MOMO',
            can_send_payments=True,
            can_receive_payments=True,
            can_create_payment_links=True,
            auto_verify_recipients=True,
            notification_email='finance@abctechnologies.com',
        )

        BusinessPaymentProfile.objects.create(
            business=b2,
            daily_disbursement_limit=Decimal('5000000.00'),
            single_transaction_limit=Decimal('1000000.00'),
            maker_checker_threshold=Decimal('200000.00'),
            requires_dual_approval=False,
            default_currency='GH₵',
            default_channel='MTN_MOMO',
            can_send_payments=True,
            can_receive_payments=True,
            can_create_payment_links=True,
            auto_verify_recipients=True,
            notification_email='info@abcfashion.com',
        )
        self.stdout.write(self.style.SUCCESS('[OK] Created Business Payment Profiles'))

        # 5. CONNECTED DEMO ACCOUNTS
        self.stdout.write('Seeding connected provider accounts (Simulated)...')
        ConnectedAccount.objects.create(
            business=b1,
            provider_name='MTN_MOMO',
            provider_type='MOBILE_MONEY',
            account_name='MTN MoMo Business',
            masked_number='•••• 4821',
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=True,
            currency='GH₵',
            daily_limit=Decimal('5000000.00'),
            is_simulated=True,
        )
        ConnectedAccount.objects.create(
            business=b1,
            provider_name='BANK_TRANSFER',
            provider_type='BANK_ACCOUNT',
            account_name='Business Bank Account',
            masked_number='•••• 9184',
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=False,
            currency='GH₵',
            daily_limit=Decimal('10000000.00'),
            is_simulated=True,
        )
        ConnectedAccount.objects.create(
            business=b2,
            provider_name='MTN_MOMO',
            provider_type='MOBILE_MONEY',
            account_name='MTN MoMo Fashion',
            masked_number='•••• 7733',
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=True,
            currency='GH₵',
            daily_limit=Decimal('3000000.00'),
            is_simulated=True,
        )
        ConnectedAccount.objects.create(
            business=b2,
            provider_name='MOBILE_MONEY',
            provider_type='MOBILE_MONEY',
            account_name='Vodafone Cash Business',
            masked_number='•••• 5566',
            status=AccountStatus.DEMO_CONNECTED,
            is_primary=False,
            currency='GH₵',
            daily_limit=Decimal('2000000.00'),
            is_simulated=True,
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {ConnectedAccount.objects.count()} Connected Accounts'))

        # 6. DISBURSEMENT ACCOUNTS
        DisbursementAccount.objects.create(
            business=b1,
            channel='MTN_MOMO',
            account_name='MTN MoMo Business Main',
            account_identifier='+233 24 123 4821',
            is_primary=True,
            is_verified=True,
        )
        DisbursementAccount.objects.create(
            business=b1,
            channel='BANK_TRANSFER',
            account_name='GCB Corporate Treasury',
            account_identifier='GCB-0104-9184-001',
            is_primary=False,
            is_verified=True,
        )

        # 7. RECIPIENTS / BENEFICIARIES (80+ TOTAL: 48 Employees, 20 Suppliers, 12 Contractors)
        self.stdout.write('Seeding 80+ pre-verified beneficiaries with Ghanaian identities...')

        gh_first_names = [
            'Kwame', 'Kofi', 'Yaw', 'Kwesi', 'Kojo', 'Kwabena', 'Kweku', 'Kobina',
            'Akua', 'Ama', 'Abena', 'Efua', 'Adjoa', 'Afia', 'Adwoa', 'Yaa', 'Akosua'
        ]
        gh_last_names = [
            'Mensah', 'Asante', 'Boateng', 'Osei', 'Agyeman', 'Owusu', 'Appiah',
            'Bonsu', 'Amoah', 'Darko', 'Antwi', 'Badu', 'Frimpong', 'Gyasi', 'Kyei',
            'Sarpong', 'Quaye', 'Tetteh', 'Addison', 'Nartey', 'Lamptey', 'Donkor'
        ]

        # 48 Employees for ABC Technologies
        # Sum of salaries must EXACTLY equal GH₵142,000:
        # 40 employees @ GH₵3,000 = GH₵120,000
        # 8 employees @ GH₵2,750  = GH₵22,000
        # Total = GH₵142,000!
        employees_list = []
        for i in range(48):
            fn = gh_first_names[i % len(gh_first_names)]
            ln = gh_last_names[(i * 3 + 1) % len(gh_last_names)]
            full_name = f"{fn} {ln}"
            phone = f"024{3000000 + i:07d}"
            amount = Decimal('2750.00') if i < 8 else Decimal('3000.00')

            rec = Recipient.objects.create(
                business=b1,
                name=full_name,
                company_name='ABC Technologies Ltd',
                channel='MTN_MOMO',
                account_identifier=phone,
                category='Employee',
                is_verified=True,
                verified_name=full_name,
                verification_confidence=100.0,
                last_verified_at=now - timedelta(days=2),
                total_disbursed_xaf=amount * 3,
                payout_count=3,
            )
            employees_list.append((rec, amount, phone))

        # 20 Suppliers for ABC Technologies (Total GH₵32,500)
        # 10 suppliers @ GH₵1,750 = GH₵17,500
        # 10 suppliers @ GH₵1,500 = GH₵15,000
        # Total = GH₵32,500!
        suppliers_list = []
        supplier_companies = [
            'Volta IT Systems Ltd', 'Accra Power & Cable Supplies', 'Gold Coast Servers SARL',
            'Tema Fiber Optic Solutions', 'Kumasi Network Logistics', 'Atlantic Data Hardware',
            'Ridge Office Supplies Co', 'Osu Paper & Printing Works', 'Spintex Cloud Cables',
            'East Legon Security Systems', 'Dansoman Server Coolers', 'Madina Tech Components',
            'Labone Backup Generators', 'Airport City Fiber Links', 'Cantonments Hardware',
            'Sakumono Software Licenses', 'Kasoa Tech Spares', 'Teshie Network Tools',
            'Adabraka IT Maintenance', 'Achimota Data Peripherals'
        ]

        for i in range(20):
            fn = gh_first_names[(i + 4) % len(gh_first_names)]
            ln = gh_last_names[(i * 2 + 3) % len(gh_last_names)]
            contact_name = f"{fn} {ln}"
            comp_name = supplier_companies[i]
            channel = 'BANK_TRANSFER' if i % 2 == 0 else 'MTN_MOMO'
            acct = f"GCB-SUP-{4000 + i:04d}" if channel == 'BANK_TRANSFER' else f"024{4000000 + i:07d}"
            amount = Decimal('1750.00') if i < 10 else Decimal('1500.00')

            rec = Recipient.objects.create(
                business=b1,
                name=contact_name,
                company_name=comp_name,
                channel=channel,
                account_identifier=acct,
                category='Supplier',
                is_verified=True,
                verified_name=contact_name,
                verification_confidence=98.5,
                last_verified_at=now - timedelta(days=5),
                total_disbursed_xaf=amount * 2,
                payout_count=2,
            )
            suppliers_list.append((rec, comp_name, amount, channel, acct))

        # 12 Contractors for ABC Technologies (Total GH₵18,700)
        # 10 contractors @ GH₵1,550 = GH₵15,500
        # 2 contractors @ GH₵1,600 = GH₵3,200
        # Total = GH₵18,700!
        contractors_list = []
        contractor_specialties = [
            'DevOps Consulting', 'UI/UX Design Specialist', 'Cybersecurity Auditor',
            'Database Architect', 'QA Test Automation', 'Penetration Testing Lead',
            'Mobile Flutter Lead', 'Backend Django Expert', 'Cloud Migration Eng',
            'Site Reliability Eng', 'Data Pipeline Specialist', 'Compliance Legal Counsel'
        ]

        for i in range(12):
            fn = gh_first_names[(i + 7) % len(gh_first_names)]
            ln = gh_last_names[(i * 3 + 5) % len(gh_last_names)]
            full_name = f"{fn} {ln}"
            spec = contractor_specialties[i]
            channel = 'MTN_MOMO' if i % 3 != 0 else 'BANK_TRANSFER'
            acct = f"020{5000000 + i:07d}" if channel == 'MTN_MOMO' else f"BARC-CON-{5000 + i:04d}"
            amount = Decimal('1600.00') if i < 2 else Decimal('1550.00')

            rec = Recipient.objects.create(
                business=b1,
                name=full_name,
                company_name=spec,
                channel=channel,
                account_identifier=acct,
                category='Contractor',
                is_verified=True,
                verified_name=full_name,
                verification_confidence=100.0,
                last_verified_at=now - timedelta(days=1),
                total_disbursed_xaf=amount,
                payout_count=1,
            )
            contractors_list.append((rec, full_name, spec, amount, channel, acct))

        self.stdout.write(self.style.SUCCESS(
            f'[OK] Created {Recipient.objects.count()} Recipients (48 Employees, 20 Suppliers, 12 Contractors)'
        ))

        # 8. PAYMENT LISTS (3 PERSISTENT REUSABLE LISTS)
        self.stdout.write('Creating persistent payment lists...')

        # List 1: September Employee Payments (48 recipients, GH₵142,000)
        list_emp = PaymentList.objects.create(
            business=b1,
            name='September Employee Payments',
            category=ListCategory.EMPLOYEES,
            recipient_count=48,
            total_amount=Decimal('142000.00'),
            currency='GH₵',
            description='Permanent staff salaries for September 2026 across engineering, operations, and support.',
            status='READY',
            is_active=True,
            last_disbursed_at=now - timedelta(days=3),
        )
        for rec, amt, ph in employees_list:
            PaymentListRecipient.objects.create(
                payment_list=list_emp,
                name=rec.name,
                phone=ph,
                provider='MTN_MOMO',
                account=ph,
                amount=amt,
                role_or_item='Staff Payroll - Sep 2026',
                is_verified=True,
                returned_account_name=rec.name,
            )

        # List 2: Monthly Suppliers (20 recipients, GH₵32,500)
        list_sup = PaymentList.objects.create(
            business=b1,
            name='Monthly Suppliers',
            category=ListCategory.SUPPLIERS,
            recipient_count=20,
            total_amount=Decimal('32500.00'),
            currency='GH₵',
            description='Recurring raw materials, data center connectivity, hardware procurement, and utility vendors.',
            status='READY',
            is_active=True,
            last_disbursed_at=now - timedelta(days=7),
        )
        for rec, comp, amt, chan, acct in suppliers_list:
            PaymentListRecipient.objects.create(
                payment_list=list_sup,
                name=comp,
                phone=rec.account_identifier if chan == 'MTN_MOMO' else '+233 24 000 1122',
                provider=chan,
                account=acct,
                amount=amt,
                role_or_item='Vendor Procurement',
                is_verified=True,
                returned_account_name=rec.name,
            )

        # List 3: Contractor Payments (12 recipients, GH₵18,700)
        list_con = PaymentList.objects.create(
            business=b1,
            name='Contractor Payments',
            category=ListCategory.CONTRACTORS,
            recipient_count=12,
            total_amount=Decimal('18700.00'),
            currency='GH₵',
            description='External technical specialists, security auditors, and creative design agency retainers.',
            status='READY',
            is_active=True,
            last_disbursed_at=now - timedelta(days=12),
        )
        for rec, full_name, spec, amt, chan, acct in contractors_list:
            PaymentListRecipient.objects.create(
                payment_list=list_con,
                name=full_name,
                phone=rec.account_identifier if chan == 'MTN_MOMO' else '+233 20 999 8877',
                provider=chan,
                account=acct,
                amount=amt,
                role_or_item=spec,
                is_verified=True,
                returned_account_name=full_name,
            )

        self.stdout.write(self.style.SUCCESS(
            f'[OK] Created 3 Payment Lists ({PaymentListRecipient.objects.count()} list members populated)'
        ))

        # 9. TRANSACTIONS (36 TOTAL: SUCCESS, PENDING, FAILED)
        self.stdout.write('Generating 36+ realistic unified ledger transactions...')

        # Outgoing disbursements (20)
        # 16 Successful, 2 Pending, 2 Failed
        for i in range(20):
            t_status = (
                TransactionStatus.SUCCESS if i < 16 else
                TransactionStatus.PENDING if i < 18 else
                TransactionStatus.FAILED
            )
            created_time = now - timedelta(days=20 - i, hours=random.randint(1, 8))
            emp = employees_list[i % len(employees_list)]
            amt = Decimal(f"{random.randint(1200, 8500)}.00")

            Transaction.objects.create(
                reference=f"MOB-DISB-20260903-{i + 1001:04d}",
                business=b1,
                direction=TransactionDirection.DISBURSEMENT,
                amount=amt,
                fee=Decimal('15.00'),
                currency='GH₵',
                channel=random.choice(['MTN_MOMO', 'BANK_TRANSFER']),
                counterparty_name=emp[0].name,
                counterparty_identifier=emp[2],
                status=t_status,
                provider_reference=f"MTN-TXN-{88000 + i:05d}",
                description=f"Outbound disbursement to {emp[0].name}",
                created_at=created_time,
            )

        # Incoming collections (16)
        # 14 Successful, 1 Pending, 1 Failed
        payer_names = [
            'Volta Enterprises Ltd', 'Kumasi Trading Corp', 'Accra Tech Hub',
            'Golden Stool Capital', 'Tema Logistics Ltd', 'Osu Arts Gallery',
            'Ridge Ventures', 'Cape Coast Seafoods', 'Takoradi Petroleum',
            'Sunyani Cocoa Traders', 'Dansoman Retailers', 'Spintex Motors',
            'Madina General Goods', 'Airport Plaza Hotel', 'Tamale Shea Exports',
            'Hohoe Timber & Crafts'
        ]
        for i in range(16):
            t_status = (
                TransactionStatus.SUCCESS if i < 14 else
                TransactionStatus.PENDING if i < 15 else
                TransactionStatus.FAILED
            )
            created_time = now - timedelta(days=18 - i, hours=random.randint(2, 10))
            payer = payer_names[i]
            amt = Decimal(f"{random.randint(350, 25000)}.00")

            Transaction.objects.create(
                reference=f"MOB-COLL-20260903-{i + 2001:04d}",
                business=b1 if i % 2 == 0 else b2,
                direction=TransactionDirection.COLLECTION,
                amount=amt,
                fee=Decimal('5.00'),
                currency='GH₵',
                channel='MTN_MOMO',
                counterparty_name=payer,
                counterparty_identifier=f"024{6000000 + i:07d}",
                status=t_status,
                provider_reference=f"COLL-TXN-{44000 + i:05d}",
                description=f"Received payment from {payer}",
                created_at=created_time,
            )

        self.stdout.write(self.style.SUCCESS(
            f'[OK] Created {Transaction.objects.count()} ledger transactions '
            f'({Transaction.objects.filter(status=TransactionStatus.SUCCESS).count()} Success, '
            f'{Transaction.objects.filter(status=TransactionStatus.PENDING).count()} Pending, '
            f'{Transaction.objects.filter(status=TransactionStatus.FAILED).count()} Failed)'
        ))

        # 10. PAYMENTS (10 AUTHORIZED DISBURSEMENT RECORDS)
        self.stdout.write('Seeding disbursement payment records...')
        for i in range(10):
            p_status = (
                PaymentStatus.COMPLETED if i < 6 else
                PaymentStatus.PROCESSING if i < 8 else
                PaymentStatus.PENDING_APPROVAL if i < 9 else
                PaymentStatus.FAILED
            )
            emp = employees_list[i]
            Payment.objects.create(
                reference_id=f"MOB-PAY-20260903-{i + 5001:04d}",
                business=b1,
                recipient=emp[0],
                recipient_name=emp[0].name,
                account_identifier=emp[2],
                channel='MTN_MOMO',
                amount=Decimal(f"{random.randint(2500, 6000)}.00"),
                currency='GH₵',
                fee=Decimal('10.00'),
                narration=f"Disbursement payment to {emp[0].name}",
                status=p_status,
                maker_user=u_finance,
                checker_user=u_admin if p_status == PaymentStatus.COMPLETED else None,
                requires_checker=True,
                approved_at=now - timedelta(days=1) if p_status == PaymentStatus.COMPLETED else None,
                is_preflight_verified=True,
                preflight_confidence=100.0,
                provider_name='MTN MoMo Business',
                provider_reference=f"MTN-REF-{1000 + i:04d}",
                failure_reason='Carrier timeout during authorization' if p_status == PaymentStatus.FAILED else '',
            )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {Payment.objects.count()} Payment records'))

        # 11. PAYMENT LINKS & QR EXAMPLES
        self.stdout.write('Seeding payment links and QR examples...')
        pl1 = PaymentLink.objects.create(
            slug='abc-fashion-dress',
            business=b2,
            title='Premium Dress',
            description='Bespoke handcrafted African evening couture with premium handwoven kente detailing.',
            amount=Decimal('350.00'),
            currency='GH₵',
            allow_custom_amount=False,
            is_active=True,
            qr_data='https://mobira.app/customer/abc-fashion-dress',
            total_collected_xaf=Decimal('2800.00'),
            collections_count=8,
            expires_at=now + timedelta(days=60),
        )

        pl2 = PaymentLink.objects.create(
            slug='abc-fashion-collection',
            business=b2,
            title='New Season Collection',
            description='Spring/Summer 2026 Contemporary African Couture - Open order payment link.',
            amount=None,
            currency='GH₵',
            allow_custom_amount=True,
            is_active=True,
            qr_data='https://mobira.app/customer/abc-fashion-collection',
            total_collected_xaf=Decimal('5400.00'),
            collections_count=6,
            expires_at=now + timedelta(days=90),
        )

        pl3 = PaymentLink.objects.create(
            slug='abc-tech-invoice-104',
            business=b1,
            title='Invoice #104 - Enterprise Cloud Architecture',
            description='Q3 Managed infrastructure, container orchestration, and high-availability database hosting.',
            amount=Decimal('45000.00'),
            currency='GH₵',
            allow_custom_amount=False,
            is_active=True,
            qr_data='https://mobira.app/customer/abc-tech-invoice-104',
            total_collected_xaf=Decimal('45000.00'),
            collections_count=1,
            expires_at=now + timedelta(days=30),
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {PaymentLink.objects.count()} Payment Links with QR codes'))

        # 12. COLLECTIONS (FOR PAYMENT LINKS)
        Collection.objects.create(
            reference_id='MOB-COL-20260903-01',
            payment_link=pl1,
            business=b2,
            payer_name='Nana Aba Anamoah',
            payer_phone='0241112233',
            channel='MTN_MOMO',
            amount=Decimal('350.00'),
            fee=Decimal('5.00'),
            currency='GH₵',
            status='SUCCESS',
            provider_reference='MTN-COL-0091',
        )
        Collection.objects.create(
            reference_id='MOB-COL-20260903-02',
            payment_link=pl1,
            business=b2,
            payer_name='Berla Mundi',
            payer_phone='0242223344',
            channel='MTN_MOMO',
            amount=Decimal('350.00'),
            fee=Decimal('5.00'),
            currency='GH₵',
            status='SUCCESS',
            provider_reference='MTN-COL-0092',
        )
        Collection.objects.create(
            reference_id='MOB-COL-20260903-03',
            payment_link=pl3,
            business=b1,
            payer_name='FinTech Ghana Ventures Ltd',
            payer_phone='0205556677',
            channel='BANK_TRANSFER',
            amount=Decimal('45000.00'),
            fee=Decimal('50.00'),
            currency='GH₵',
            status='SUCCESS',
            provider_reference='GCB-EFT-9912',
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {Collection.objects.count()} Collection entries'))

        # 13. BUSINESS VERIFICATIONS (KYB)
        self.stdout.write('Seeding business KYB verification logs...')
        BusinessVerification.objects.create(
            business=b1,
            submitted_by=u_admin,
            status=VerificationStatus.VERIFIED,
            verification_type='FULL_KYB',
            registration_number='RC/GH/2021/B/8921',
            tax_number='GHA-TIN-2021-00847',
            documents_submitted=[
                'certificate_of_incorporation.pdf',
                'gra_tax_clearance_2026.pdf',
                'directors_id_bundle.pdf'
            ],
            reviewer_notes='Commercial Registry match 100%. Tax clearance certificate confirmed with Ghana Revenue Authority.',
            verified_at=now - timedelta(days=30),
            expires_at=now + timedelta(days=335),
            metadata={'registrar': 'Registrar Generals Department Accra', 'kyb_score': 98},
        )

        BusinessVerification.objects.create(
            business=b2,
            submitted_by=u_fashion,
            status=VerificationStatus.VERIFIED,
            verification_type='FULL_KYB',
            registration_number='RC/GH/2022/F/3456',
            tax_number='GHA-TIN-2022-01234',
            documents_submitted=[
                'certificate_of_incorporation.pdf',
                'retail_license.pdf'
            ],
            reviewer_notes='Physical retail presence verified at 28 Oxford Street, Osu. Tax compliance confirmed.',
            verified_at=now - timedelta(days=15),
            expires_at=now + timedelta(days=350),
            metadata={'registrar': 'Registrar Generals Department Accra', 'kyb_score': 94},
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {BusinessVerification.objects.count()} Business Verifications'))

        # 14. PRE-FLIGHT VERIFICATION LOGS (NAME MATCHING)
        self.stdout.write('Seeding pre-flight anti-fraud verification logs...')
        VerificationLog.objects.create(
            verification_code='VRF-2026-MOMO-001',
            target_type=TargetType.PHONE_MOMO,
            target_identifier='0241234567',
            expected_name='Kwame Asante',
            registered_name='Kwame Asante',
            match_status=MatchStatus.EXACT_MATCH,
            confidence_score=100.0,
            carrier_or_bank='MTN Ghana',
            is_safe_to_pay=True,
            raw_details={'carrier_subscriber_type': 'SUBSCRIBER_ACTIVE', 'account_tier': 'TIER_3'},
        )
        VerificationLog.objects.create(
            verification_code='VRF-2026-MOMO-002',
            target_type=TargetType.PHONE_MOMO,
            target_identifier='0249876543',
            expected_name='Efua Darkwa',
            registered_name='Efua Darkwa',
            match_status=MatchStatus.EXACT_MATCH,
            confidence_score=100.0,
            carrier_or_bank='MTN Ghana',
            is_safe_to_pay=True,
            raw_details={'carrier_subscriber_type': 'MERCHANT_ACCOUNT', 'account_tier': 'MERCHANT'},
        )
        VerificationLog.objects.create(
            verification_code='VRF-2026-MOMO-003',
            target_type=TargetType.PHONE_MOMO,
            target_identifier='0245558899',
            expected_name='Kwame Mensah',
            registered_name='Yaw Mensah',
            match_status=MatchStatus.MISMATCH,
            confidence_score=42.0,
            carrier_or_bank='MTN Ghana',
            is_safe_to_pay=False,
            raw_details={'warning': 'Recipient details do not match saved beneficiary'},
        )
        VerificationLog.objects.create(
            verification_code='VRF-2026-BANK-004',
            target_type=TargetType.BANK_ACCOUNT,
            target_identifier='GCB-9184-ACCRA',
            expected_name='ABC Technologies Ltd',
            registered_name='ABC TECHNOLOGIES LIMITED',
            match_status=MatchStatus.EXACT_MATCH,
            confidence_score=99.0,
            carrier_or_bank='GCB Bank',
            is_safe_to_pay=True,
            raw_details={'ach_clearing_status': 'ACTIVE'},
        )
        VerificationLog.objects.create(
            verification_code='VRF-2026-RCCM-005',
            target_type=TargetType.BUSINESS_RCCM,
            target_identifier='RC/GH/2021/B/8921',
            expected_name='ABC Technologies Ltd',
            registered_name='ABC TECHNOLOGIES LTD',
            match_status=MatchStatus.EXACT_MATCH,
            confidence_score=100.0,
            carrier_or_bank='Registrar Generals Department',
            is_safe_to_pay=True,
            raw_details={'status': 'GOOD_STANDING'},
        )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {VerificationLog.objects.count()} Verification Logs'))

        # 15. AUDIT LOGS (ALL 10 TRACKED EVENTS)
        self.stdout.write('Seeding backend audit compliance ledger (all 10 actions)...')
        audit_events = [
            (AuditAction.LOGIN, 'user_login', {'ip': '192.168.1.10', 'method': 'email_password'}),
            (AuditAction.BUSINESS_CREATED, 'org_onboarding', {'business_id': 'PP-ABC-001', 'country': 'Ghana'}),
            (AuditAction.VERIFICATION_SUBMITTED, 'kyb_submission', {'docs_count': 3, 'tier': 'GOLD_VERIFIED'}),
            (AuditAction.VERIFICATION_COMPLETED, 'kyb_approval', {'score': 96, 'badge': 'VERIFIED_BUSINESS'}),
            (AuditAction.PAYMENT_LIST_IMPORTED, 'csv_import', {'list_name': 'September Employee Payments', 'recipients': 48}),
            (AuditAction.RECIPIENT_VERIFIED, 'preflight_check', {'target': '0241234567', 'match': 'EXACT_MATCH'}),
            (AuditAction.PAYMENT_AUTHORIZED, 'maker_checker', {'batch': 'MOB-2026-000184', 'amount': '142000.00'}),
            (AuditAction.PAYMENT_COMPLETED, 'disbursement_done', {'amount': '142000.00', 'completed': '48/48'}),
            (AuditAction.PAYMENT_FAILED, 'disbursement_error', {'reason': 'Carrier timeout', 'code': 'MTN_504'}),
            (AuditAction.PAYMENT_LINK_CREATED, 'checkout_link', {'slug': 'abc-fashion-dress', 'amount': '350.00'}),
        ]

        for i, (action, ref_prefix, meta) in enumerate(audit_events):
            AuditLog.objects.create(
                user=u_finance if i % 2 == 0 else u_admin,
                business=b1,
                action=action,
                reference_id=f"AUD-{ref_prefix.upper()}-{i + 1:03d}",
                ip_address=f"197.251.{random.randint(10, 240)}.{random.randint(2, 250)}",
                metadata=meta,
            )
        self.stdout.write(self.style.SUCCESS(f'[OK] Created {AuditLog.objects.count()} Audit Logs'))

        # FINAL SUMMARY
        self.stdout.write(self.style.NOTICE('========================================'))
        self.stdout.write(self.style.SUCCESS('DATABASE SEEDING COMPLETE (POSTGRESQL)'))
        self.stdout.write(self.style.NOTICE(f'Businesses:       {Business.objects.count()} (ABC Technologies Ltd, ABC Fashion)'))
        self.stdout.write(self.style.NOTICE(f'Users:            {User.objects.count()}'))
        self.stdout.write(self.style.NOTICE(f'Connected Accts:  {ConnectedAccount.objects.count()}'))
        self.stdout.write(self.style.NOTICE(f'Beneficiaries:    {Recipient.objects.count()} (48 Employees, 20 Suppliers, 12 Contractors)'))
        self.stdout.write(self.style.NOTICE(f'Payment Lists:    {PaymentList.objects.count()} (September Employees: GHS 142,000)'))
        self.stdout.write(self.style.NOTICE(f'Transactions:     {Transaction.objects.count()} (Success, Pending, Failed)'))
        self.stdout.write(self.style.NOTICE(f'Payment Records:  {Payment.objects.count()}'))
        self.stdout.write(self.style.NOTICE(f'Payment Links:    {PaymentLink.objects.count()} (Premium Dress: GHS 350)'))
        self.stdout.write(self.style.NOTICE(f'Audit Logs:       {AuditLog.objects.count()} (All 10 actions)'))
        self.stdout.write(self.style.NOTICE('========================================'))

from decimal import Decimal
from django.test import TestCase, Client
from apps.businesses.models import Business
from apps.users.models import User, UserRole
from apps.payments.models import Payment, PaymentStatus
from apps.payments.services import PaymentOrchestrator
from integrations.base.payment_provider import PaymentProvider
from integrations.mock.mock_payment_provider import MockPaymentProvider
from integrations.mock.momo_provider import MockMoMoProvider
from integrations.mock.bank_provider import MockBankProvider
from integrations.factory import get_payment_provider
from integrations.base.dtos import DisbursementRequest, CollectionRequest


class PaymentProviderAbstractionTestCase(TestCase):
    """Verifies PaymentProvider interface contract and MockPaymentProvider implementation."""

    def setUp(self):
        self.mock_provider = MockPaymentProvider(provider_name="MTN_MOMO")
        self.bank_provider = MockBankProvider()

    def test_provider_inheritance(self):
        self.assertTrue(issubclass(MockPaymentProvider, PaymentProvider))
        self.assertTrue(issubclass(MockMoMoProvider, PaymentProvider))
        self.assertTrue(issubclass(MockBankProvider, PaymentProvider))

    def test_factory_resolution(self):
        momo = get_payment_provider("MTN_MOMO")
        self.assertEqual(momo.provider_name, "MTN_MOMO")
        self.assertEqual(momo.provider_type, "MOBILE_MONEY")

        bank = get_payment_provider("BANK_TRANSFER")
        self.assertEqual(bank.provider_type, "BANK_ACCOUNT")

    def test_connect_account(self):
        data = {
            "account_identifier": "0241234567",
            "account_name": "MTN MoMo Business",
            "is_primary": True,
            "currency": "GH₵",
        }
        res = self.mock_provider.connect_account(data)
        self.assertEqual(res["status"], "DEMO_CONNECTED")
        self.assertEqual(res["masked_number"], "•••• 4567")
        self.assertTrue(res["is_simulated"])

    def test_verify_recipient(self):
        # Known recipient test
        res = self.mock_provider.verify_recipient(
            account_identifier="0241234567",
            channel="MTN_MOMO",
            expected_name="Kwame Asante"
        )
        self.assertTrue(res["is_verified"])
        self.assertEqual(res["registered_name"], "Kwame Asante")
        self.assertEqual(res["match_status"], "EXACT_MATCH")
        self.assertGreaterEqual(res["confidence_score"], 95.0)

    def test_initiate_payment(self):
        req = DisbursementRequest(
            reference_id="TEST-REF-001",
            amount=3000.00,
            currency="GH₵",
            recipient_name="Kwame Asante",
            account_identifier="0241234567",
            channel="MTN_MOMO",
            narration="Staff Salary",
        )
        res = self.mock_provider.initiate_payment(req)
        self.assertEqual(res.status, "SUCCESS")
        self.assertTrue(res.provider_reference.startswith("MOB-MTN-"))
        self.assertEqual(res.amount, 3000.00)

    def test_get_payment_status(self):
        res = self.mock_provider.get_payment_status("MOB-MTN-12345")
        self.assertEqual(res.status, "SUCCESS")
        self.assertEqual(res.provider_reference, "MOB-MTN-12345")

    def test_get_account_information(self):
        info = self.mock_provider.get_account_information("conn_test_01")
        self.assertEqual(info["status"], "ACTIVE")
        self.assertEqual(info["health"], "OPTIMAL")
        self.assertGreater(info["available_balance"], 0)


class PaymentOrchestratorTestCase(TestCase):
    def setUp(self):
        self.business = Business.objects.create(
            name="ABC Technologies Ltd",
            business_id="PP-ABC-001",
            registration_number="RC/TEST/2026",
            tax_number="M99999",
            trust_score=96
        )
        self.user = User.objects.create_user(
            username="tester",
            email="tester@test.com",
            password="Password123!",
            role=UserRole.FINANCE_OFFICER,
            business=self.business
        )
        self.orchestrator = PaymentOrchestrator()

    def test_fee_calculation(self):
        fee = self.orchestrator.calculate_fee(Decimal('100000.00'))
        self.assertEqual(fee, Decimal('500.00'))

        fee_small = self.orchestrator.calculate_fee(Decimal('500.00'))
        self.assertEqual(fee_small, Decimal('5.00'))

    def test_instant_payout_execution(self):
        payment = self.orchestrator.initiate_disbursement(
            business=self.business,
            recipient_name="Kwame Asante",
            account_identifier="0241234567",
            channel="MTN_MOMO",
            amount=Decimal('3000.00'),
            maker_user=self.user,
            require_preflight=True
        )
        self.assertEqual(payment.status, PaymentStatus.COMPLETED)
        self.assertTrue(payment.is_preflight_verified)
        self.assertTrue(payment.provider_reference.startswith("MTN-") or payment.provider_reference.startswith("MOB-"))

    def test_maker_checker_threshold_trigger(self):
        payment = self.orchestrator.initiate_disbursement(
            business=self.business,
            recipient_name="Kwame Asante",
            account_identifier="0241234567",
            channel="MTN_MOMO",
            amount=Decimal('600000.00'),
            maker_user=self.user,
            require_preflight=False
        )
        self.assertEqual(payment.status, PaymentStatus.PENDING_APPROVAL)
        self.assertTrue(payment.requires_checker)


class LogicalApiEndpointsTestCase(TestCase):
    """Verifies all 12 logical RESTful endpoints are registered and respond."""

    def setUp(self):
        self.client = Client()
        self.business = Business.objects.create(
            name="ABC Technologies Ltd",
            business_id="PP-ABC-001",
            registration_number="RC/TEST/2026/001",
            tax_number="M092114829104A",
            trust_score=96
        )

    def test_api_root_discovery(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("endpoints", data)
        endpoints = data["endpoints"]
        self.assertIn("auth", endpoints)
        self.assertIn("businesses", endpoints)
        self.assertIn("verification", endpoints)
        self.assertIn("accounts", endpoints)
        self.assertIn("payment_lists", endpoints)
        self.assertIn("recipients", endpoints)
        self.assertIn("payments", endpoints)
        self.assertIn("transactions", endpoints)
        self.assertIn("receive", endpoints)
        self.assertIn("payment_links", endpoints)
        self.assertIn("analytics", endpoints)
        self.assertIn("audit", endpoints)

    def test_endpoint_accessibility(self):
        routes = [
            '/api/businesses/',
            '/api/accounts/',
            '/api/recipients/',
            '/api/payments/',
            '/api/payment-lists/',
            '/api/transactions/',
            '/api/receive/links/',
            '/api/payment-links/',
            '/api/analytics/overview/',
            '/api/audit/logs/',
        ]
        for route in routes:
            res = self.client.get(route)
            self.assertIn(res.status_code, [200, 201], f"Route {route} failed with status {res.status_code}")

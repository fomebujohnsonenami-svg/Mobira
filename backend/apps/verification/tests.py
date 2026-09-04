from django.test import TestCase
from apps.verification.services import VerificationEngine
from apps.verification.models import VerificationLog, MatchStatus


class VerificationEngineTestCase(TestCase):
    def setUp(self):
        self.engine = VerificationEngine()

    def test_momo_subscriber_exact_match(self):
        res = self.engine.verify_preflight(
            channel="MTN_MOMO",
            account_identifier="+237670000111",
            expected_name="Douala Organic Supplies SARL"
        )
        self.assertTrue(res["is_verified"])
        self.assertEqual(res["match_status"], MatchStatus.EXACT_MATCH)
        self.assertGreaterEqual(res["confidence_score"], 85.0)

    def test_momo_subscriber_mismatch_warning(self):
        res = self.engine.verify_preflight(
            channel="MTN_MOMO",
            account_identifier="+237670000111",
            expected_name="Totally Unrelated Ghost Company"
        )
        self.assertFalse(res["is_verified"])
        self.assertEqual(res["match_status"], MatchStatus.MISMATCH)
        self.assertFalse(res["is_safe_to_pay"])

    def test_commercial_registry_lookup(self):
        res = self.engine.verify_preflight(
            channel="BUSINESS_RCCM",
            account_identifier="RC/DLA/2020/B/4521",
            expected_name="Douala Agro-Tech SARL"
        )
        self.assertTrue(res["is_verified"])
        self.assertEqual(res["match_status"], MatchStatus.EXACT_MATCH)

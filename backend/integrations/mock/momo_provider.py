"""Mock Mobile Money Provider simulating MTN MoMo & Orange Money."""

import time
import uuid
import difflib
from datetime import datetime
from typing import Dict, Any, Optional
from ..base.payment_provider import BasePaymentProvider
from ..base.verification_provider import BaseVerificationProvider
from ..base.dtos import (
    DisbursementRequest,
    CollectionRequest,
    PaymentResult,
    PaymentStatus,
    NameEnquiryRequest,
    NameEnquiryResult,
    RegistryVerificationRequest,
    RegistryVerificationResult,
)
from ..base.exceptions import AccountNotFoundException

KNOWN_SUBSCRIBERS = {
    # Ghanaian Identities
    "0241234567": {"name": "Kwame Asante", "carrier": "MTN Mobile Money Ghana", "kyc": "TIER_3_BUSINESS"},
    "0242223344": {"name": "Ama Mensah", "carrier": "MTN Mobile Money Ghana", "kyc": "TIER_3_BUSINESS"},
    "0243334455": {"name": "Kofi Boateng", "carrier": "MTN Mobile Money Ghana", "kyc": "TIER_3_BUSINESS"},
    "0249876543": {"name": "Efua Darkwa", "carrier": "MTN Mobile Money Ghana", "kyc": "TIER_3_BUSINESS"},
    "0241112233": {"name": "Nana Aba Anamoah", "carrier": "MTN Mobile Money Ghana", "kyc": "TIER_3_BUSINESS"},
    "0241123344": {"name": "Efua Sutherland", "carrier": "MTN Mobile Money Ghana", "kyc": "TIER_3_BUSINESS"},
    # Regional Identities
    "+237670000111": {"name": "DOUALA ORGANIC SUPPLIES SARL", "carrier": "MTN Cameroon", "kyc": "TIER_3_BUSINESS"},
    "+237677112233": {"name": "KRIBI FISHERY COOPERATIVES", "carrier": "MTN Cameroon", "kyc": "TIER_3_BUSINESS"},
    "+237690334455": {"name": "YAOUNDE LOGISTICS HUB", "carrier": "Orange Cameroun", "kyc": "TIER_3_BUSINESS"},
    "+237671998877": {"name": "BAMENDA ARTISANS COOP", "carrier": "MTN Cameroon", "kyc": "TIER_2_COOP"},
    "+237675554433": {"name": "JEAN-PAUL KAMGA", "carrier": "MTN Cameroon", "kyc": "TIER_2_INDIVIDUAL"},
    "+237694112233": {"name": "MARIE-CLAIRE NGOUO", "carrier": "Orange Cameroun", "kyc": "TIER_2_INDIVIDUAL"},
}


class MockMoMoProvider(BasePaymentProvider, BaseVerificationProvider):
    """
    Simulates high-fidelity African Mobile Money API behaviors:
    - Subscriber Name Enquiry before payout
    - USSD push payment prompts
    - Network latency and telecom references
    """

    def __init__(self, carrier_name: str = "MTN_MOMO", latency_sec: float = 0.15):
        self._carrier = carrier_name
        self._latency = latency_sec

    @property
    def provider_name(self) -> str:
        return self._carrier

    @property
    def provider_type(self) -> str:
        return "MOBILE_MONEY"

    def _calculate_fee(self, amount: float) -> float:
        fee = amount * 0.005
        return max(5.0, min(2500.0, round(fee, 2)))

    def connect_account(self, account_data: Dict[str, Any]) -> Dict[str, Any]:
        raw_identifier = str(account_data.get("account_identifier", "")).strip()
        last_digits = raw_identifier[-4:] if len(raw_identifier) >= 4 else "4821"
        masked_number = f"•••• {last_digits}"

        return {
            "id": f"conn_momo_{uuid.uuid4().hex[:8]}",
            "provider_name": self._carrier,
            "provider_type": "MOBILE_MONEY",
            "account_name": account_data.get("account_name", f"{self._carrier} Corporate"),
            "masked_number": masked_number,
            "status": "DEMO_CONNECTED",
            "is_primary": account_data.get("is_primary", False),
            "currency": account_data.get("currency", "GH₵"),
            "daily_limit": float(account_data.get("daily_limit", 5000000.00)),
            "is_simulated": True,
            "connected_at": datetime.utcnow().isoformat(),
            "last_synced_at": datetime.utcnow().isoformat(),
            "metadata": {
                "rail": "MOMO_DIRECT_PULL",
                "simulated": True,
            }
        }

    def verify_recipient(
        self,
        account_identifier: str,
        channel: str,
        expected_name: Optional[str] = None
    ) -> Dict[str, Any]:
        req = NameEnquiryRequest(
            account_identifier=account_identifier,
            channel=channel,
            expected_name=expected_name
        )
        res = self.name_enquiry(req)
        return {
            "account_identifier": res.account_identifier,
            "channel": res.channel,
            "registered_name": res.registered_name,
            "expected_name": expected_name or res.registered_name,
            "is_verified": res.name_matched,
            "match_status": "EXACT_MATCH" if res.confidence_score >= 95 else ("FUZZY_MATCH" if res.confidence_score >= 70 else "MISMATCH"),
            "confidence_score": res.confidence_score,
            "carrier_or_bank": res.carrier_or_bank,
            "verified_at": datetime.utcnow().isoformat(),
            "is_safe_to_pay": res.name_matched,
        }

    def initiate_payment(self, request: DisbursementRequest) -> PaymentResult:
        return self.disburse(request)

    def disburse(self, request: DisbursementRequest) -> PaymentResult:
        if self._latency > 0:
            time.sleep(self._latency)

        if request.account_identifier.endswith("404"):
            raise AccountNotFoundException(request.account_identifier)

        provider_ref = f"MTN-{uuid.uuid4().hex[:12].upper()}" if "MTN" in self._carrier else f"OM-{uuid.uuid4().hex[:12].upper()}"
        fee = self._calculate_fee(request.amount)

        return PaymentResult(
            reference_id=request.reference_id,
            provider_reference=provider_ref,
            status=PaymentStatus.SUCCESS,
            amount=request.amount,
            currency=request.currency,
            fee=fee,
            message=f"Successfully transferred {request.amount} {request.currency} via {self._carrier} to {request.account_identifier}",
            timestamp=datetime.utcnow(),
            raw_response={
                "provider": self._carrier,
                "external_tx_id": provider_ref,
                "recipient_msisdn": request.account_identifier,
                "settlement_rail": "DIRECT_MNO_PULL",
                "simulated": True,
            }
        )

    def get_payment_status(self, provider_reference: str) -> PaymentResult:
        return self.check_status(provider_reference)

    def check_status(self, provider_reference: str) -> PaymentResult:
        return PaymentResult(
            reference_id="QUERY",
            provider_reference=provider_reference,
            status=PaymentStatus.SUCCESS,
            amount=0,
            currency="GH₵",
            fee=0,
            message="Transaction cleared and confirmed on telecom rail",
            timestamp=datetime.utcnow(),
            raw_response={"status": "CLEARED", "simulated": True}
        )

    def get_account_information(self, account_id: str) -> Dict[str, Any]:
        return {
            "account_id": account_id,
            "provider_name": self._carrier,
            "provider_type": "MOBILE_MONEY",
            "status": "ACTIVE",
            "available_balance": 185400.00,
            "currency": "GH₵",
            "daily_limit": 5000000.00,
            "remaining_limit": 4858000.00,
            "health": "OPTIMAL",
            "last_heartbeat": datetime.utcnow().isoformat(),
            "simulated": True,
        }

    def collect(self, request: CollectionRequest) -> PaymentResult:
        if self._latency > 0:
            time.sleep(self._latency)

        provider_ref = f"COL-{self._carrier[:3]}-{uuid.uuid4().hex[:10].upper()}"
        fee = self._calculate_fee(request.amount)

        return PaymentResult(
            reference_id=request.reference_id,
            provider_reference=provider_ref,
            status=PaymentStatus.SUCCESS,
            amount=request.amount,
            currency=request.currency,
            fee=fee,
            message=f"Customer prompt approved on {request.payer_identifier} via {self._carrier}",
            timestamp=datetime.utcnow(),
            raw_response={
                "provider": self._carrier,
                "ussd_session_id": f"USSD-{uuid.uuid4().hex[:8]}",
                "payer": request.payer_identifier,
                "channel": self._carrier,
                "simulated": True,
            }
        )

    def name_enquiry(self, request: NameEnquiryRequest) -> NameEnquiryResult:
        ident = request.account_identifier.replace(" ", "").replace("-", "")

        sub = KNOWN_SUBSCRIBERS.get(ident) or KNOWN_SUBSCRIBERS.get(f"+{ident}")
        if not sub:
            short = ident[-4:]
            reg_name = f"Subscriber {short}" if not request.expected_name else request.expected_name
            carrier = "MTN Ghana" if "MTN" in self._carrier or ident.startswith("024") else "Telecel Ghana"
            kyc = "TIER_2_VERIFIED"
        else:
            reg_name = sub["name"]
            carrier = sub["carrier"]
            kyc = sub["kyc"]

        matched = True
        confidence = 100.0
        if request.expected_name:
            ratio = difflib.SequenceMatcher(None, reg_name.upper(), request.expected_name.upper()).ratio()
            confidence = round(ratio * 100, 1)
            matched = confidence >= 60.0

        return NameEnquiryResult(
            account_identifier=ident,
            registered_name=reg_name,
            channel=self._carrier,
            is_active=True,
            carrier_or_bank=carrier,
            confidence_score=confidence,
            name_matched=matched,
            kyc_level=kyc,
            details={
                "operator_network": carrier,
                "preflight_passed": matched,
                "anti_fraud_flag": "NONE" if matched else "POTENTIAL_NAME_MISMATCH",
                "simulated": True,
            }
        )

    def verify_company_registry(self, request: RegistryVerificationRequest) -> RegistryVerificationResult:
        return RegistryVerificationResult(
            registration_number=request.registration_number,
            legal_name=request.company_name,
            is_valid=True,
            status="ACTIVE"
        )

    def disconnect_account(self, account_id: str) -> bool:
        return True

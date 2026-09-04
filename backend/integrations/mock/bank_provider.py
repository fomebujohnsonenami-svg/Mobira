"""Mock Interbank Provider simulating automated clearing and bank transfers."""

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

KNOWN_BANK_ACCOUNTS = {
    "GCB-0104-9184-001": {"name": "ABC Technologies Ltd", "bank": "GCB Bank Ghana"},
    "ECOBANK-7733-OSU": {"name": "ABC Fashion House", "bank": "Ecobank Ghana"},
    "GH2110005000010012345678901": {"name": "ABC TECHNOLOGIES LTD", "bank": "GCB Bank Ghana"},
    "CM2110005000010012345678901": {"name": "DOUALA AGRO-TECH SARL", "bank": "Afriland First Bank"},
    "CM2110001000020098765432109": {"name": "KRIBI LOGISTICS CORP", "bank": "UBA Cameroon"},
}


class MockBankProvider(BasePaymentProvider, BaseVerificationProvider):
    """Simulates interbank EFT / ACH automated clearing and bank account name enquiry."""

    def __init__(self, bank_name: str = "BANK_TRANSFER", latency_sec: float = 0.2):
        self._bank = bank_name
        self._latency = latency_sec

    @property
    def provider_name(self) -> str:
        return self._bank

    @property
    def provider_type(self) -> str:
        return "BANK_ACCOUNT"

    def connect_account(self, account_data: Dict[str, Any]) -> Dict[str, Any]:
        raw_identifier = str(account_data.get("account_identifier", "")).strip()
        last_digits = raw_identifier[-4:] if len(raw_identifier) >= 4 else "9184"
        masked_number = f"•••• {last_digits}"

        return {
            "id": f"conn_bank_{uuid.uuid4().hex[:8]}",
            "provider_name": self._bank,
            "provider_type": "BANK_ACCOUNT",
            "account_name": account_data.get("account_name", "Corporate Bank Account"),
            "masked_number": masked_number,
            "status": "DEMO_CONNECTED",
            "is_primary": account_data.get("is_primary", False),
            "currency": account_data.get("currency", "GH₵"),
            "daily_limit": float(account_data.get("daily_limit", 15000000.00)),
            "is_simulated": True,
            "connected_at": datetime.utcnow().isoformat(),
            "last_synced_at": datetime.utcnow().isoformat(),
            "metadata": {
                "rail": "INTERBANK_ACH_EFT",
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

        provider_ref = f"EFT-{uuid.uuid4().hex[:12].upper()}"
        fee = 15.0

        return PaymentResult(
            reference_id=request.reference_id,
            provider_reference=provider_ref,
            status=PaymentStatus.SUCCESS,
            amount=request.amount,
            currency=request.currency,
            fee=fee,
            message=f"Interbank transfer of {request.amount} {request.currency} credited to {request.account_identifier}",
            timestamp=datetime.utcnow(),
            raw_response={
                "bank_clearing_code": "GHIPSS-INSTANT-01",
                "provider_ref": provider_ref,
                "simulated": True
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
            message="Interbank clearing settlement confirmed",
            timestamp=datetime.utcnow(),
            raw_response={"status": "SETTLED", "simulated": True}
        )

    def get_account_information(self, account_id: str) -> Dict[str, Any]:
        return {
            "account_id": account_id,
            "provider_name": self._bank,
            "provider_type": "BANK_ACCOUNT",
            "status": "ACTIVE",
            "available_balance": 500000.00,
            "currency": "GH₵",
            "daily_limit": 15000000.00,
            "remaining_limit": 14500000.00,
            "health": "OPTIMAL",
            "last_heartbeat": datetime.utcnow().isoformat(),
            "simulated": True,
        }

    def collect(self, request: CollectionRequest) -> PaymentResult:
        provider_ref = f"ACH-{uuid.uuid4().hex[:12].upper()}"
        return PaymentResult(
            reference_id=request.reference_id,
            provider_reference=provider_ref,
            status=PaymentStatus.SUCCESS,
            amount=request.amount,
            currency=request.currency,
            fee=10.0,
            message=f"Bank direct debit authorization confirmed for {request.payer_identifier}",
            timestamp=datetime.utcnow(),
            raw_response={"clearing_ref": provider_ref, "simulated": True}
        )

    def name_enquiry(self, request: NameEnquiryRequest) -> NameEnquiryResult:
        account_data = KNOWN_BANK_ACCOUNTS.get(request.account_identifier)
        if not account_data:
            short = request.account_identifier[-4:]
            reg_name = f"ENTERPRISE CORP #{short}" if not request.expected_name else request.expected_name
            bank_name = "GCB Bank Ghana"
        else:
            reg_name = account_data["name"]
            bank_name = account_data["bank"]

        matched = True
        confidence = 100.0
        if request.expected_name:
            ratio = difflib.SequenceMatcher(None, reg_name.upper(), request.expected_name.upper()).ratio()
            confidence = round(ratio * 100, 1)
            matched = confidence >= 60.0

        return NameEnquiryResult(
            account_identifier=request.account_identifier,
            registered_name=reg_name,
            channel="BANK_TRANSFER",
            is_active=True,
            carrier_or_bank=bank_name,
            confidence_score=confidence,
            name_matched=matched,
            kyc_level="TIER_3_CORPORATE",
            details={
                "bank_name": bank_name,
                "clearing_network": "GHIPSS-ACH",
                "preflight_passed": matched,
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

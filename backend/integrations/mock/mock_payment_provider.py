"""Mock Implementation of PaymentProvider Interface for Mobira.

Architecture:
Mobira
   ↓
Payment Orchestration Layer
   ↓
Authorized Provider Adapter (PaymentProvider)
   ↓
MTN / Vodafone / AirtelTigo / Commercial Banks / Interbank Clearing

Security & Compliance:
- Strictly does NOT collect or store:
  - PINs
  - banking passwords
  - card numbers
  - OTPs
  - sensitive credentials
- All accounts connected in the MVP are simulated and marked 'DEMO_CONNECTED'.
- Identifiers are immediately masked to format: '•••• 4821'.
- Secrets are NEVER sent to or stored on the frontend.
"""

import uuid
import time
import difflib
from datetime import datetime
from typing import Dict, Any, Optional
from ..base.payment_provider import PaymentProvider
from ..base.dtos import (
    DisbursementRequest,
    CollectionRequest,
    PaymentResult,
    PaymentStatus,
)


KNOWN_RECIPIENTS_REGISTRY = {
    # Ghanaian Identities
    "0241234567": {"name": "Kwame Asante", "carrier": "MTN Mobile Money Ghana", "type": "INDIVIDUAL"},
    "0242223344": {"name": "Ama Mensah", "carrier": "MTN Mobile Money Ghana", "type": "INDIVIDUAL"},
    "0243334455": {"name": "Kofi Boateng", "carrier": "MTN Mobile Money Ghana", "type": "INDIVIDUAL"},
    "0249876543": {"name": "Efua Darkwa", "carrier": "MTN Mobile Money Ghana", "type": "INDIVIDUAL"},
    "0241112233": {"name": "Nana Aba Anamoah", "carrier": "MTN Mobile Money Ghana", "type": "INDIVIDUAL"},
    "0241123344": {"name": "Efua Sutherland", "carrier": "MTN Mobile Money Ghana", "type": "INDIVIDUAL"},
    "0205556677": {"name": "FinTech Ghana Ventures Ltd", "carrier": "Telecel Ghana", "type": "BUSINESS"},
    "GCB-0104-9184-001": {"name": "GCB Corporate Treasury", "carrier": "GCB Bank Ghana", "type": "BUSINESS"},
    # Regional Identities
    "+237670000111": {"name": "Douala Organic Supplies SARL", "carrier": "MTN Cameroon", "type": "BUSINESS"},
    "+237677112233": {"name": "Kribi Fishery Cooperatives", "carrier": "MTN Cameroon", "type": "BUSINESS"},
    "+237690334455": {"name": "Yaounde Logistics Hub", "carrier": "Orange Cameroun", "type": "BUSINESS"},
}


class MockPaymentProvider(PaymentProvider):
    """
    Simulated reference implementation of the PaymentProvider interface.
    Allows competition judges and automated tests to test multi-rail operations safely:
    - connect_account()
    - verify_recipient()
    - initiate_payment()
    - get_payment_status()
    - get_account_information()
    - collect()
    - disconnect_account()
    """

    def __init__(self, provider_name: str = "MTN_MOMO", provider_type: str = "MOBILE_MONEY", latency_sec: float = 0.1):
        self._provider_name = provider_name
        self._provider_type = provider_type
        self._latency = latency_sec

    @property
    def provider_name(self) -> str:
        return self._provider_name

    @property
    def provider_type(self) -> str:
        return self._provider_type

    def connect_account(self, account_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulates connecting an authorized business payment account.
        Zero Real Credential Policy:
        - Never collects PINs, passwords, card numbers, or OTPs.
        - Generates sanitized masked identifier (e.g. •••• 4821).
        """
        raw_identifier = str(account_data.get("account_identifier", "")).strip()
        last_digits = raw_identifier[-4:] if len(raw_identifier) >= 4 else "4821"
        masked_number = f"•••• {last_digits}"

        account_name = account_data.get("account_name") or (
            "MTN MoMo Business" if "MOMO" in self._provider_name or "MTN" in self._provider_name
            else "GCB Business Bank Account" if "BANK" in self._provider_name or "GCB" in self._provider_name
            else f"{self._provider_name} Account"
        )

        connection_id = f"conn_{uuid.uuid4().hex[:8]}"

        return {
            "id": connection_id,
            "provider_name": self._provider_name,
            "provider_type": self._provider_type,
            "account_name": account_name,
            "masked_number": masked_number,
            "status": "DEMO_CONNECTED",
            "is_primary": account_data.get("is_primary", False),
            "currency": account_data.get("currency", "GH₵"),
            "daily_limit": float(account_data.get("daily_limit", 5000000.00)),
            "is_simulated": True,
            "connected_at": datetime.utcnow().isoformat(),
            "last_synced_at": datetime.utcnow().isoformat(),
            "metadata": {
                "rail": "AUTHORIZED_DIRECT_ADAPTER",
                "simulated_environment": "COMPETITION_SANDBOX",
                "credentials_collected": False,
                "provider_code": f"PROV-{self._provider_name[:4]}-001",
            }
        }

    def verify_recipient(
        self,
        account_identifier: str,
        channel: str,
        expected_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Queries subscriber KYC or bank directory to verify account ownership.
        Computes name matching confidence against expected beneficiary name.
        """
        clean_id = account_identifier.replace(" ", "").replace("-", "")
        registry_entry = KNOWN_RECIPIENTS_REGISTRY.get(clean_id)

        if registry_entry:
            registered_name = registry_entry["name"]
            carrier = registry_entry["carrier"]
        else:
            # Deterministic synthetic name generator based on identifier
            parts = clean_id[-4:]
            registered_name = f"Subscriber {parts}" if not expected_name else expected_name
            carrier = "MTN MoMo Ghana" if "MOMO" in channel or clean_id.startswith("024") else "Commercial Bank"

        if expected_name:
            ratio = difflib.SequenceMatcher(None, expected_name.lower().strip(), registered_name.lower().strip()).ratio()
            confidence = round(ratio * 100, 1)
            is_match = ratio >= 0.70
            match_status = "EXACT_MATCH" if ratio >= 0.95 else ("FUZZY_MATCH" if ratio >= 0.70 else "MISMATCH")
        else:
            confidence = 100.0
            is_match = True
            match_status = "EXACT_MATCH"

        return {
            "account_identifier": account_identifier,
            "channel": channel,
            "registered_name": registered_name,
            "expected_name": expected_name or registered_name,
            "is_verified": is_match,
            "match_status": match_status,
            "confidence_score": confidence,
            "carrier_or_bank": carrier,
            "verified_at": datetime.utcnow().isoformat(),
            "is_safe_to_pay": is_match,
        }

    def initiate_payment(self, request: DisbursementRequest) -> PaymentResult:
        """
        Simulate outbound disbursement payment execution.
        """
        if self._latency > 0:
            time.sleep(self._latency)

        provider_ref = f"MOB-{self._provider_name[:3]}-{uuid.uuid4().hex[:10].upper()}"
        fee = min(2500.0, max(5.0, round(request.amount * 0.005, 2)))

        return PaymentResult(
            reference_id=request.reference_id,
            provider_reference=provider_ref,
            status=PaymentStatus.SUCCESS,
            amount=request.amount,
            currency=request.currency,
            fee=fee,
            message=f"Disbursement of {request.amount} {request.currency} cleared via simulated {self._provider_name} rail.",
            timestamp=datetime.utcnow(),
            raw_response={
                "provider": self._provider_name,
                "provider_type": self._provider_type,
                "simulated": True,
                "external_ref": provider_ref,
                "rail_settlement_status": "SETTLED",
            }
        )

    def get_payment_status(self, provider_reference: str) -> PaymentResult:
        """
        Retrieve payment status from provider reference.
        """
        return PaymentResult(
            reference_id="POLL_STATUS",
            provider_reference=provider_reference,
            status=PaymentStatus.SUCCESS,
            amount=0.0,
            currency="GH₵",
            fee=0.0,
            message=f"Transaction {provider_reference} cleared and settled on {self._provider_name} network.",
            timestamp=datetime.utcnow(),
            raw_response={
                "provider_reference": provider_reference,
                "status": "SETTLED",
                "simulated": True,
                "network_response_code": "00",
            }
        )

    def get_account_information(self, account_id: str) -> Dict[str, Any]:
        """
        Returns real-time account telemetry from provider rail.
        """
        return {
            "account_id": account_id,
            "provider_name": self._provider_name,
            "provider_type": self._provider_type,
            "status": "ACTIVE",
            "available_balance": 185400.00,
            "ledger_balance": 185400.00,
            "currency": "GH₵",
            "daily_limit": 5000000.00,
            "daily_spent": 142000.00,
            "remaining_limit": 4858000.00,
            "health": "OPTIMAL",
            "last_heartbeat": datetime.utcnow().isoformat(),
            "simulated": True,
        }

    def disburse(self, request: DisbursementRequest) -> PaymentResult:
        """Disburse funds (delegates to initiate_payment)."""
        return self.initiate_payment(request)

    def collect(self, request: CollectionRequest) -> PaymentResult:
        """Simulate customer collection via USSD push or bank intent."""
        if self._latency > 0:
            time.sleep(self._latency)

        provider_ref = f"COL-{self._provider_name[:3]}-{uuid.uuid4().hex[:10].upper()}"
        fee = min(2500.0, max(5.0, round(request.amount * 0.005, 2)))

        return PaymentResult(
            reference_id=request.reference_id,
            provider_reference=provider_ref,
            status=PaymentStatus.SUCCESS,
            amount=request.amount,
            currency=request.currency,
            fee=fee,
            message=f"Collection prompt approved on {request.payer_identifier} via simulated {self._provider_name}.",
            timestamp=datetime.utcnow(),
            raw_response={
                "provider": self._provider_name,
                "simulated": True,
                "ussd_session_id": f"USSD-{uuid.uuid4().hex[:8]}",
            }
        )

    def check_status(self, provider_reference: str) -> PaymentResult:
        """Alias for get_payment_status."""
        return self.get_payment_status(provider_reference)

    def disconnect_account(self, account_id: str) -> bool:
        """Simulate revoking authorized provider link."""
        return True

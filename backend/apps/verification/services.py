"""Verification Engine orchestrating pre-flight KYB/KYC checks."""

import uuid
from integrations.factory import get_payment_provider
from integrations.mock.registry_provider import MockRegistryProvider
from integrations.base.dtos import (
    NameEnquiryRequest,
    RegistryVerificationRequest,
)
from .models import VerificationLog, TargetType, MatchStatus


class VerificationEngine:
    """
    Unified anti-fraud verification engine powering Mobira's pre-flight checks.
    """

    def __init__(self):
        self.registry_provider = MockRegistryProvider()

    def verify_preflight(self, channel: str, account_identifier: str, expected_name: str = "") -> dict:
        channel_upper = channel.upper()
        verif_code = f"VRF-{uuid.uuid4().hex[:8].upper()}"

        if 'REGISTRY' in channel_upper or 'RCCM' in channel_upper or 'TIN' in channel_upper:
            req = RegistryVerificationRequest(
                registration_number=account_identifier,
                company_name=expected_name
            )
            res = self.registry_provider.verify_company_registry(req)
            target_type = TargetType.BUSINESS_RCCM
            confidence = res.matched_ratio
            is_safe = res.is_valid
            match_status = MatchStatus.EXACT_MATCH if res.is_valid else MatchStatus.NOT_FOUND
            registered_name = res.legal_name
            carrier_or_bank = "National Commercial Registry"
        else:
            provider = get_payment_provider(channel_upper)
            vf_res = provider.verify_recipient(
                account_identifier=account_identifier,
                channel=channel_upper,
                expected_name=expected_name
            )

            target_type = TargetType.BANK_ACCOUNT if 'BANK' in channel_upper else TargetType.PHONE_MOMO
            confidence = vf_res["confidence_score"]
            is_safe = vf_res["is_verified"]
            registered_name = vf_res["registered_name"]
            carrier_or_bank = vf_res["carrier_or_bank"]

            if confidence >= 85.0:
                match_status = MatchStatus.EXACT_MATCH
            elif confidence >= 60.0:
                match_status = MatchStatus.PARTIAL_MATCH
            else:
                match_status = MatchStatus.MISMATCH

        # Record audit log
        log_entry = VerificationLog.objects.create(
            verification_code=verif_code,
            target_type=target_type,
            target_identifier=account_identifier,
            expected_name=expected_name,
            registered_name=registered_name,
            match_status=match_status,
            confidence_score=confidence,
            carrier_or_bank=carrier_or_bank,
            is_safe_to_pay=is_safe,
            raw_details={
                "channel": channel_upper,
                "verified_at": str(uuid.uuid1()),
                "risk_rating": "LOW" if is_safe else "HIGH",
            }
        )

        return {
            "verification_id": verif_code,
            "is_verified": is_safe,
            "match_status": match_status,
            "confidence_score": confidence,
            "registered_name": registered_name,
            "expected_name": expected_name,
            "carrier_or_bank": carrier_or_bank,
            "target_identifier": account_identifier,
            "is_safe_to_pay": is_safe,
            "details": {
                "preflight_passed": is_safe,
                "anti_fraud_flag": "NONE" if is_safe else "POTENTIAL_NAME_MISMATCH"
            }
        }

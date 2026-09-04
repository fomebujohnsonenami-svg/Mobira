"""Mock National Business & Tax Registry Provider."""

import difflib
from datetime import datetime
from ..base.verification_provider import BaseVerificationProvider
from ..base.dtos import (
    NameEnquiryRequest,
    NameEnquiryResult,
    RegistryVerificationRequest,
    RegistryVerificationResult,
)

KNOWN_REGISTRY_ENTITIES = {
    "RC/DLA/2020/B/4521": {
        "legal_name": "DOUALA AGRO-TECH SARL",
        "tin": "M052012849312A",
        "status": "ACTIVE",
        "registration_date": "2020-05-14",
        "tax_status": "COMPLIANT",
        "trust_rating": "GOLD",
        "capital_xaf": 15000000,
    },
    "RC/KRI/2018/B/1102": {
        "legal_name": "KRIBI FISHERY COOPERATIVES",
        "tin": "M031811902451C",
        "status": "ACTIVE",
        "registration_date": "2018-03-22",
        "tax_status": "COMPLIANT",
        "trust_rating": "GOLD",
        "capital_xaf": 25000000,
    },
    "RC/YAO/2022/B/8821": {
        "legal_name": "YAOUNDE LOGISTICS HUB",
        "tin": "M082217829103B",
        "status": "ACTIVE",
        "registration_date": "2022-08-10",
        "tax_status": "COMPLIANT",
        "trust_rating": "TIER_1",
        "capital_xaf": 5000000,
    },
    "RC/BDA/2021/C/0491": {
        "legal_name": "BAMENDA ARTISANS COOP",
        "tin": "M042109823120E",
        "status": "ACTIVE",
        "registration_date": "2021-04-18",
        "tax_status": "COMPLIANT",
        "trust_rating": "TIER_1",
        "capital_xaf": 3000000,
    },
}

class MockRegistryProvider(BaseVerificationProvider):
    """
    Simulates national registries (RCCM, DGI Tax Authority) to verify commercial legality.
    """

    @property
    def provider_name(self) -> str:
        return "NATIONAL_COMMERCIAL_REGISTRY_MOCK"

    def name_enquiry(self, request: NameEnquiryRequest) -> NameEnquiryResult:
        # Fallback implementation
        return NameEnquiryResult(
            account_identifier=request.account_identifier,
            registered_name=request.expected_name or "REGISTERED ENTITY",
            channel=request.channel,
            is_active=True,
            carrier_or_bank="REGISTRY",
            confidence_score=100.0,
            name_matched=True
        )

    def verify_company_registry(self, request: RegistryVerificationRequest) -> RegistryVerificationResult:
        reg_num = request.registration_number.strip().upper()
        record = KNOWN_REGISTRY_ENTITIES.get(reg_num)

        if not record:
            # Check by matching company name in values
            for rccm, ent in KNOWN_REGISTRY_ENTITIES.items():
                if difflib.SequenceMatcher(None, ent["legal_name"], request.company_name.upper()).ratio() > 0.6:
                    record = ent
                    reg_num = rccm
                    break

        if record:
            ratio = difflib.SequenceMatcher(None, record["legal_name"], request.company_name.upper()).ratio()
            return RegistryVerificationResult(
                registration_number=reg_num,
                legal_name=record["legal_name"],
                is_valid=True,
                status=record["status"],
                registration_date=record["registration_date"],
                tax_compliance_status=record["tax_status"],
                matched_ratio=round(ratio * 100, 1)
            )

        # Dynamic fallback for arbitrary entered numbers in demo
        is_plausible = len(reg_num) >= 5
        return RegistryVerificationResult(
            registration_number=reg_num,
            legal_name=request.company_name.upper() if request.company_name else "VERIFIED COMMERCIAL ENTITY",
            is_valid=is_plausible,
            status="ACTIVE" if is_plausible else "NOT_FOUND",
            registration_date="2023-01-15",
            tax_compliance_status="COMPLIANT" if is_plausible else "UNKNOWN",
            matched_ratio=88.0 if is_plausible else 0.0
        )

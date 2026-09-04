"""Data Transfer Objects for Payment and Identity Rails."""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime

class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    TIMEOUT = "TIMEOUT"
    CANCELLED = "CANCELLED"

@dataclass
class DisbursementRequest:
    reference_id: str
    amount: float
    currency: str
    recipient_name: str
    account_identifier: str  # Phone number (e.g. +237670000111) or Bank Account/IBAN
    channel: str             # MTN_MOMO, ORANGE_MONEY, BANK_TRANSFER
    narration: str = ""
    idempotency_key: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class CollectionRequest:
    reference_id: str
    amount: float
    currency: str
    payer_name: str
    payer_identifier: str    # Phone number or Account
    channel: str
    narration: str = ""
    callback_url: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class PaymentResult:
    reference_id: str
    provider_reference: str
    status: PaymentStatus
    amount: float
    currency: str
    fee: float
    message: str
    timestamp: datetime = field(default_factory=datetime.utcnow)
    raw_response: Dict[str, Any] = field(default_factory=dict)

@dataclass
class NameEnquiryRequest:
    account_identifier: str
    channel: str
    expected_name: Optional[str] = None

@dataclass
class NameEnquiryResult:
    account_identifier: str
    registered_name: str
    channel: str
    is_active: bool
    carrier_or_bank: str
    confidence_score: float = 100.0  # Fuzzy match percentage if expected_name provided
    name_matched: bool = True
    kyc_level: str = "TIER_2"
    details: Dict[str, Any] = field(default_factory=dict)

@dataclass
class RegistryVerificationRequest:
    registration_number: str  # e.g. RCCM or TIN/NIU
    company_name: str

@dataclass
class RegistryVerificationResult:
    registration_number: str
    legal_name: str
    is_valid: bool
    status: str              # ACTIVE, SUSPENDED, DISSOLVED
    registration_date: Optional[str] = None
    tax_compliance_status: str = "COMPLIANT"
    matched_ratio: float = 100.0

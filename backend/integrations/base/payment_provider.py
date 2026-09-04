"""Abstract Base Interface for Payment Provider Integrations."""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from .dtos import DisbursementRequest, CollectionRequest, PaymentResult


class PaymentProvider(ABC):
    """
    Contract that all authorized payment provider adapters (MTN, Orange, Commercial Banks, PSPs)
    must implement.
    
    Architecture:
    Mobira
       ↓
    Payment Orchestration Layer
       ↓
    Authorized Provider Adapter (PaymentProvider)
       ↓
    MTN / Bank / PSP
    
    Ensures zero coupling between Mobira core business orchestration and underlying provider APIs.
    Neither the frontend nor the core database ever directly store raw provider secrets or user PINs.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Identifier of the provider (e.g. MTN_MOMO, BUSINESS_BANK, ORANGE_MONEY, MOCK_PROVIDER)."""
        pass

    @property
    @abstractmethod
    def provider_type(self) -> str:
        """Type of provider rail: MOBILE_MONEY or BANK_ACCOUNT."""
        pass

    @abstractmethod
    def connect_account(self, account_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulates connecting an authorized business account.
        Strictly does not collect or store PINs, banking passwords, card numbers, or OTPs.
        Returns a sanitized connection object with masked identifier (e.g. •••• 4821).
        """
        pass

    @abstractmethod
    def verify_recipient(
        self,
        account_identifier: str,
        channel: str,
        expected_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Queries telecom KYC registry or interbank directory to verify recipient identity.
        Returns verification status, returned account name, and match confidence.
        """
        pass

    @abstractmethod
    def initiate_payment(self, request: DisbursementRequest) -> PaymentResult:
        """
        Initiates an outbound disbursement payment to a recipient wallet or bank account.
        """
        pass

    @abstractmethod
    def get_payment_status(self, provider_reference: str) -> PaymentResult:
        """
        Polls payment execution status from provider rail using provider reference.
        """
        pass

    @abstractmethod
    def get_account_information(self, account_id: str) -> Dict[str, Any]:
        """
        Retrieves real-time account details, available balance, daily limits, and health status
        from the connected provider.
        """
        pass

    def disburse(self, request: DisbursementRequest) -> PaymentResult:
        """Disburse funds (delegates to initiate_payment for consistency)."""
        return self.initiate_payment(request)

    @abstractmethod
    def collect(self, request: CollectionRequest) -> PaymentResult:
        """Initiate a collection (USSD Push or bank intent) from a customer."""
        pass

    def check_status(self, provider_reference: str) -> PaymentResult:
        """Poll transaction status (delegates to get_payment_status)."""
        return self.get_payment_status(provider_reference)

    @abstractmethod
    def disconnect_account(self, account_id: str) -> bool:
        """Revoke authorized connection with provider."""
        pass


# Backwards compatibility alias
BasePaymentProvider = PaymentProvider

"""Abstract Base Class for Verification & KYB/KYC Providers."""

from abc import ABC, abstractmethod
from .dtos import (
    NameEnquiryRequest,
    NameEnquiryResult,
    RegistryVerificationRequest,
    RegistryVerificationResult,
)

class BaseVerificationProvider(ABC):
    """
    Contract for identity and registry verification adapters.
    Provides pre-flight checks, phone-to-name enquiry, and legal entity validation.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the verification provider."""
        pass

    @abstractmethod
    def name_enquiry(self, request: NameEnquiryRequest) -> NameEnquiryResult:
        """
        Verify account holder name for a given phone or bank account number.
        """
        pass

    @abstractmethod
    def verify_company_registry(self, request: RegistryVerificationRequest) -> RegistryVerificationResult:
        """
        Verify corporate registration (RCCM, TIN) against national registry.
        """
        pass

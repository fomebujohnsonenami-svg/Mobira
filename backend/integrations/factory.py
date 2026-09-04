"""Payment Provider Factory for resolving multi-rail payment adapters."""

from typing import Optional, Dict
from .base.payment_provider import PaymentProvider
from .mock.mock_payment_provider import MockPaymentProvider
from .mock.momo_provider import MockMoMoProvider
from .mock.bank_provider import MockBankProvider


# Provider instance cache
_PROVIDERS: Dict[str, PaymentProvider] = {}


def get_payment_provider(channel_or_name: str = "MTN_MOMO") -> PaymentProvider:
    """
    Factory function to resolve the appropriate PaymentProvider adapter
    for a given payment channel or provider identifier.
    
    Supported channels:
    - 'MTN_MOMO' -> MockMoMoProvider (MTN MoMo Business)
    - 'ORANGE_MONEY' -> MockMoMoProvider (Orange Money)
    - 'VODAFONE_CASH' / 'TELECEL' -> MockMoMoProvider (Telecel Cash)
    - 'BANK_TRANSFER' / 'GCB_BANK' -> MockBankProvider (Interbank ACH/EFT)
    - Default / Any other -> MockPaymentProvider
    """
    key = str(channel_or_name).upper().strip()

    if key in _PROVIDERS:
        return _PROVIDERS[key]

    if "MTN" in key or "MOMO" in key:
        provider = MockMoMoProvider(carrier_name="MTN_MOMO")
    elif "ORANGE" in key:
        provider = MockMoMoProvider(carrier_name="ORANGE_MONEY")
    elif "VODAFONE" in key or "TELECEL" in key:
        provider = MockMoMoProvider(carrier_name="VODAFONE_CASH")
    elif "BANK" in key or "EFT" in key or "ACH" in key or "GCB" in key:
        provider = MockBankProvider(bank_name="BANK_TRANSFER")
    else:
        provider = MockPaymentProvider(provider_name=channel_or_name)

    _PROVIDERS[key] = provider
    return provider

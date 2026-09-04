"""Exception hierarchy for payment & verification provider integrations."""

class ProviderException(Exception):
    """Base exception for all provider integration errors."""
    def __init__(self, message: str, provider_code: str = "ERR_GENERIC", details: dict = None):
        super().__init__(message)
        self.message = message
        self.provider_code = provider_code
        self.details = details or {}

class ProviderTimeoutException(ProviderException):
    """Raised when telecom or bank rail fails to respond in SLA window."""
    def __init__(self, message: str = "Provider rail timed out"):
        super().__init__(message, provider_code="ERR_TIMEOUT")

class AccountNotFoundException(ProviderException):
    """Raised when the specified mobile wallet or bank account doesn't exist."""
    def __init__(self, account_identifier: str):
        super().__init__(
            f"Account identifier {account_identifier} was not found on provider rail",
            provider_code="ERR_ACCOUNT_NOT_FOUND",
            details={"account_identifier": account_identifier}
        )

class InsufficientBalanceException(ProviderException):
    """Raised when source or destination wallet lacks funds."""
    def __init__(self, message: str = "Insufficient funds to execute transfer"):
        super().__init__(message, provider_code="ERR_INSUFFICIENT_FUNDS")

class DuplicateTransactionException(ProviderException):
    """Raised when idempotency key or provider reference is reused."""
    def __init__(self, key: str):
        super().__init__(
            f"Transaction with key {key} already processed or in-flight",
            provider_code="ERR_DUPLICATE_TX",
            details={"idempotency_key": key}
        )

import re
from decimal import Decimal
from rest_framework import serializers

SUPPORTED_CHANNELS = ['MTN_MOMO', 'ORANGE_MONEY', 'BANK_TRANSFER', 'VODAFONE_CASH']
SUPPORTED_CURRENCIES = ['GHS', 'GH₵', 'XAF', 'USD', 'EUR']

def validate_positive_amount(value, min_amount=Decimal('0.01'), max_amount=Decimal('50000000.00')):
    """Validates that an amount is strictly positive and within platform limits."""
    try:
        dec_val = Decimal(str(value))
    except Exception:
        raise serializers.ValidationError("Invalid numerical amount format.")
    
    if dec_val < min_amount:
        raise serializers.ValidationError(f"Amount must be at least {min_amount}.")
    if dec_val > max_amount:
        raise serializers.ValidationError(f"Amount exceeds the single transaction limit of {max_amount}.")
    return dec_val

def validate_phone_number(value):
    """
    Validates phone numbers (Ghanaian 10-digit formats like 024xxxxxxx or international +233xxxxxxxxx).
    Strips dangerous characters and validates structural format.
    """
    if not value or not isinstance(value, str):
        raise serializers.ValidationError("Phone number is required.")
    
    cleaned = re.sub(r'[\s\-\(\)]', '', value.strip())
    if not re.match(r'^(\+[1-9]\d{8,14}|0\d{9})$', cleaned):
        raise serializers.ValidationError("Invalid phone number format. Expected e.g. 0241234567 or +233241234567.")
    return cleaned

def validate_account_identifier(value):
    """Validates account identifiers (MOMO phone number or Bank Account / IBAN)."""
    if not value or not isinstance(value, str):
        raise serializers.ValidationError("Account identifier is required.")
    
    cleaned = value.strip()
    if len(cleaned) < 4 or len(cleaned) > 100:
        raise serializers.ValidationError("Account identifier must be between 4 and 100 characters.")
    
    if re.search(r'[<>"\';()&+]', cleaned):
        raise serializers.ValidationError("Account identifier contains illegal or dangerous characters.")
    
    return cleaned

def sanitize_text(value, max_length=255, required=True):
    """Sanitizes text inputs by stripping control characters and HTML tags."""
    if value is None:
        if required:
            raise serializers.ValidationError("This field is required.")
        return ""
    
    text = str(value).strip()
    if not text and required:
        raise serializers.ValidationError("This field cannot be blank.")
    
    cleaned = re.sub(r'<[^>]*>', '', text)
    cleaned = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', cleaned)
    
    if len(cleaned) > max_length:
        raise serializers.ValidationError(f"Text exceeds maximum length of {max_length} characters.")
    
    return cleaned

def validate_channel(value):
    """Validates payment channel against authorized providers."""
    if not value:
        raise serializers.ValidationError("Payment channel is required.")
    
    channel = str(value).strip().upper()
    if channel not in SUPPORTED_CHANNELS:
        raise serializers.ValidationError(f"Unsupported channel '{channel}'. Allowed: {', '.join(SUPPORTED_CHANNELS)}.")
    return channel

def validate_currency(value):
    """Validates transaction currency."""
    if not value:
        return 'GHS'
    curr = str(value).strip().upper()
    if curr not in SUPPORTED_CURRENCIES:
        return 'GHS'
    return curr

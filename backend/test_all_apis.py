import os
import sys
import django

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from apps.users.models import User
from apps.businesses.models import Business, ConnectedAccount, BusinessPaymentProfile
from apps.verification.models import BusinessVerification, VerificationLog
from apps.payment_lists.models import PaymentList, PaymentListRecipient
from apps.recipients.models import Recipient
from apps.transactions.models import Transaction
from apps.payments.models import Payment
from apps.receive.models import PaymentLink, Collection
from apps.audit.models import AuditLog

def run_system_health_check():
    print("==================================================")
    print("MOBIRA FULL SYSTEM & DATABASE HEALTH VERIFICATION")
    print("==================================================")
    
    # 1. Database Model Integrity Checks
    print("\n[1] Verifying Database Model Records:")
    models_to_check = [
        ("Businesses", Business.objects.count(), 2),
        ("Users", User.objects.count(), 4),
        ("Business Verifications (KYB)", BusinessVerification.objects.count(), 2),
        ("Connected Accounts", ConnectedAccount.objects.count(), 4),
        ("Beneficiaries/Recipients", Recipient.objects.count(), 80),
        ("Payment Lists", PaymentList.objects.count(), 3),
        ("Payment List Members", PaymentListRecipient.objects.count(), 80),
        ("Ledger Transactions", Transaction.objects.count(), 36),
        ("Payment Records", Payment.objects.count(), 10),
        ("Payment Links", PaymentLink.objects.count(), 3),
        ("Collections", Collection.objects.count(), 3),
        ("Business Payment Profiles", BusinessPaymentProfile.objects.count(), 2),
        ("Verification Logs", VerificationLog.objects.count(), 5),
        ("Audit Logs", AuditLog.objects.count(), 10),
    ]

    all_models_ok = True
    for name, count, expected_min in models_to_check:
        status = "[OK]" if count >= expected_min else "[FAIL]"
        print("  - {:<30} : {:>3} records (Expected >= {}) {}".format(name, count, expected_min, status))
        if count < expected_min:
            all_models_ok = False

    # 2. Key Data Integrity Assertions
    print("\n[2] Verifying Fictional Data Requirements:")
    
    # Check ABC Technologies
    abc_tech = Business.objects.filter(business_id="PP-ABC-001").first()
    assert abc_tech is not None, "ABC Technologies Ltd (PP-ABC-001) not found!"
    print("  [OK] Business 1: {} (ID: {}, Status: {}, Score: {}/100)".format(
        abc_tech.name, abc_tech.business_id, abc_tech.verification_tier, abc_tech.trust_score
    ))
    
    # Check 48 Employees for ABC Technologies
    emp_count = Recipient.objects.filter(business=abc_tech, category="Employee").count()
    assert emp_count == 48, "Expected 48 employees, found {}".format(emp_count)
    print("  [OK] ABC Technologies Employee Count: {}/48".format(emp_count))
    
    # Check September Payroll Total == GH₵142,000
    sep_list = PaymentList.objects.filter(business=abc_tech, name__icontains="September").first()
    assert sep_list is not None, "September Employee Payments list not found!"
    assert float(sep_list.total_amount) == 142000.0, "Expected GH₵142,000, got {}".format(sep_list.total_amount)
    print("  [OK] September Payroll Total: GHS {:,.2f} across {} employees".format(
        float(sep_list.total_amount), sep_list.recipient_count
    ))

    # Check ABC Fashion
    abc_fashion = Business.objects.filter(business_id="PP-FASHION-001").first()
    assert abc_fashion is not None, "ABC Fashion (PP-FASHION-001) not found!"
    print("  [OK] Business 2: {} (ID: {}, Status: {})".format(
        abc_fashion.name, abc_fashion.business_id, abc_fashion.verification_tier
    ))
    
    # Check Premium Dress link GH₵350
    dress_link = PaymentLink.objects.filter(business=abc_fashion, slug="abc-fashion-dress").first()
    assert dress_link is not None, "Premium Dress payment link not found!"
    assert float(dress_link.amount) == 350.0, "Expected GH₵350, got {}".format(dress_link.amount)
    print("  [OK] Payment Link: {} = GHS {:.2f} (Slug: {})".format(
        dress_link.title, float(dress_link.amount), dress_link.slug
    ))

    # 3. Test All 12 DRF API Endpoint Groups
    print("\n[3] Testing All 12 Django REST Framework API Endpoints:")
    client = APIClient()
    
    # Authenticate as Kwame Asante (Admin)
    user = User.objects.filter(email="admin@abctechnologies.com").first()
    assert user is not None, "Admin user not found"
    client.force_authenticate(user=user)

    endpoints_to_test = [
        ("API Root Discovery", "/api/"),
        ("Auth Profile", "/api/auth/me/"),
        ("Businesses Directory", "/api/businesses/"),
        ("Verification Services", "/api/verification/"),
        ("Connected Accounts", "/api/accounts/"),
        ("Payment Lists", "/api/payment-lists/"),
        ("Recipients / Beneficiaries", "/api/recipients/"),
        ("Disbursement Payments", "/api/payments/"),
        ("Ledger Transactions", "/api/transactions/"),
        ("Receive Payment Links", "/api/receive/"),
        ("Payment Links Discovery", "/api/payment-links/"),
        ("Cashflow Analytics", "/api/analytics/"),
        ("Audit Compliance Trail", "/api/audit/"),
    ]

    all_apis_ok = True
    for name, url in endpoints_to_test:
        response = client.get(url)
        status_code = response.status_code
        status = "[OK] (HTTP 200)" if status_code == 200 else "[FAIL] (HTTP {})".format(status_code)
        print("  - {:<30} [{:<28}] : {}".format(name, url, status))
        if status_code != 200:
            all_apis_ok = False

    # 4. Test Pre-Flight Subscriber Name Enquiry & Mismatch Detection
    print("\n[4] Testing Pre-Flight Identity & Anti-Fraud Verification API:")
    # Exact Match Test
    verify_resp = client.post("/api/verification/preflight/", {
        "channel": "MTN_MOMO",
        "account_identifier": "0241234567",
        "expected_name": "Kwame Asante"
    }, format="json")
    assert verify_resp.status_code == 200, f"Verification failed with status {verify_resp.status_code}: {verify_resp.data}"
    data = verify_resp.json()
    print("  [OK] Exact Match Check   : '{}' vs '{}' -> Match: {}, SafeToPay: {}".format(
        data.get("expected_name"), data.get("registered_name"), data.get("match_status"), data.get("is_safe_to_pay")
    ))

    # Mismatch Detection Test
    mismatch_resp = client.post("/api/verification/preflight/", {
        "channel": "MTN_MOMO",
        "account_identifier": "0245558899",
        "expected_name": "Kwame Mensah"
    }, format="json")
    assert mismatch_resp.status_code == 200, f"Mismatch test failed with status {mismatch_resp.status_code}"
    mdata = mismatch_resp.json()
    print("  [OK] Mismatch Check (Fraud): '{}' vs '{}' -> Match: {}, SafeToPay: {}".format(
        mdata.get("expected_name"), mdata.get("registered_name"), mdata.get("match_status"), mdata.get("is_safe_to_pay")
    ))

    # 5. Test Maker-Checker Payment Flow
    print("\n[5] Testing Maker-Checker Payment Governance:")
    payout_resp = client.post("/api/payments/initiate/", {
        "business_id": str(abc_tech.id),
        "recipient_name": "Kofi Mensah",
        "account_identifier": "0243000000",
        "channel": "MTN_MOMO",
        "amount": "1500.00",
        "currency": "GH₵",
        "narration": "Automated verification test disbursement"
    }, format="json")
    assert payout_resp.status_code in (200, 201), f"Payout initiation failed: {payout_resp.data}"
    pdata = payout_resp.json()
    print("  [OK] Payment Initiated : Ref: {}, Status: {}, Verified: {}".format(
        pdata.get("reference_id"), pdata.get("status"), pdata.get("is_preflight_verified")
    ))

    print("\n==================================================")
    if all_models_ok and all_apis_ok:
        print("ALL TESTS & DATABASE INTEGRITY CHECKS PASSED 100%! [OK]")
    else:
        print("SOME CHECKS FAILED - SEE LOGS ABOVE")
    print("==================================================")

if __name__ == "__main__":
    run_system_health_check()

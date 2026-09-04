export type VerificationTier = 'UNVERIFIED' | 'BASIC_VERIFIED' | 'VERIFIED_TIER_1' | 'GOLD_VERIFIED';

export type PaymentChannel = 'MTN_MOMO' | 'ORANGE_MONEY' | 'BANK_TRANSFER';

export type PaymentStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';

export type TransactionDirection = 'DISBURSEMENT' | 'COLLECTION';

export interface Business {
  id: string;
  name: string;
  trade_name?: string;
  business_id?: string;
  legal_form: string;
  registration_number: string;
  tax_number: string;
  category?: string;
  sector: string;
  country: string;
  city: string;
  location?: string;
  address?: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  description?: string;
  verification_tier: VerificationTier;
  trust_score: number;
  is_active: boolean;
  daily_payment_limit: number;
  daily_limit_xaf?: number;
  primary_momo_number?: string;
  primary_bank_account?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'FINANCE_OFFICER' | 'AUDITOR' | 'CUSTOMER';
  phone_number?: string;
  business?: string;
  business_name?: string;
  business_trust_score?: number;
  business_tier?: VerificationTier;
  is_verified: boolean;
}

export interface VerificationResult {
  verification_id: string;
  is_verified: boolean;
  match_status: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' | 'NOT_FOUND';
  confidence_score: number;
  registered_name: string;
  expected_name?: string;
  carrier_or_bank: string;
  is_safe_to_pay: boolean;
  target_identifier: string;
  warning?: string | null;
}

export interface Recipient {
  id: string;
  name: string;
  company_name?: string;
  channel: PaymentChannel;
  account_identifier: string;
  category: string;
  is_verified: boolean;
  verified_name?: string;
  verification_confidence: number;
  total_disbursed_xaf: number;
  payout_count: number;
  created_at: string;
}

export interface Payment {
  id: string;
  reference_id: string;
  business_name?: string;
  recipient_name: string;
  account_identifier: string;
  channel: PaymentChannel;
  amount: number;
  currency: string;
  fee: number;
  narration?: string;
  status: PaymentStatus;
  requires_checker: boolean;
  is_preflight_verified: boolean;
  preflight_confidence: number;
  maker_name?: string;
  checker_name?: string;
  provider_name?: string;
  provider_reference?: string;
  failure_reason?: string;
  created_at: string;
  completed_at?: string;
}

export interface PaymentBatchItem {
  id: string;
  recipient_name: string;
  account_identifier: string;
  channel: PaymentChannel;
  amount: number;
  fee: number;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  error_message?: string;
  provider_reference?: string;
}

export interface PaymentBatch {
  id: string;
  batch_code: string;
  title: string;
  status: 'DRAFT' | 'VALIDATED' | 'EXECUTING' | 'COMPLETED' | 'PARTIAL_FAILURE';
  total_amount: number;
  total_fee: number;
  total_count: number;
  processed_count: number;
  successful_count: number;
  failed_count: number;
  items?: PaymentBatchItem[];
  created_at: string;
  completed_at?: string;
}

export type PaymentListCategory =
  | 'Employees'
  | 'Suppliers'
  | 'Contractors'
  | 'Vendors'
  | 'Other beneficiaries';

export interface PaymentListRecipient {
  id: string;
  name: string;
  phone?: string;
  account_identifier?: string;
  channel?: string;
  provider?: string;
  account?: string;
  amount: number;
  role_or_item?: string;
  is_verified: boolean;
  returned_account_name?: string;
}

export interface PaymentList {
  id: string;
  name: string;
  category: PaymentListCategory;
  recipient_count: number;
  total_amount: number;
  currency: string;
  description?: string;
  status: 'READY' | 'DISBURSING' | 'COMPLETED';
  last_disbursed_at?: string;
  created_at: string;
  sample_recipients?: PaymentListRecipient[];
  recipients?: PaymentListRecipient[];
}

export interface RecipientVerificationItem {
  id: string;
  saved_recipient_name: string;
  saved_phone: string;
  masked_phone: string;
  provider: string;
  account: string;
  amount: number;
  returned_account_name: string;
  match_status: 'MATCH_VERIFIED' | 'NAME_MISMATCH';
  is_match: boolean;
  error_message?: string | null;
}

export interface PaymentListVerificationResponse {
  payment_list_id: string;
  list_name: string;
  total_checked: number;
  has_mismatch: boolean;
  matched_count: number;
  mismatched_count: number;
  results: RecipientVerificationItem[];
}

export interface PaymentLink {
  id: string;
  slug: string;
  business_name: string;
  business_tier: VerificationTier;
  business_trust_score: number;
  title: string;
  description: string;
  amount?: number | null;
  currency: string;
  reference?: string;
  expiry?: string;
  expires_at?: string;
  allow_custom_amount: boolean;
  is_active: boolean;
  payment_url: string;
  qr_data: string;
  qr_code_data?: string;
  total_collected_xaf: number;
  collections_count: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  reference: string;
  direction: TransactionDirection;
  amount: number;
  fee: number;
  currency: string;
  channel: PaymentChannel;
  counterparty_name: string;
  counterparty_identifier: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REVERSED';
  provider_reference?: string;
  description?: string;
  created_at: string;
}

export interface AnalyticsOverview {
  currency: string;
  kpis: {
    total_volume: number;
    total_disbursed: number;
    total_collected: number;
    net_cashflow: number;
    total_fees: number;
    success_rate_percentage: number;
    total_transactions_count: number;
    active_recipients_count: number;
    preflight_verifications_count: number;
  };
  trust: {
    score: number;
    tier: VerificationTier;
    days_clean_record: number;
    identity_match_rate: number;
  };
  channel_distribution: Array<{
    name: string;
    volume: number;
    percentage: number;
    color: string;
  }>;
  monthly_trends: Array<{
    month: string;
    disbursements: number;
    collections: number;
  }>;
}

export type NotificationType = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';

export type NotificationCategory =
  | 'VERIFICATION'
  | 'PAYMENTS'
  | 'SECURITY'
  | 'PAYMENT_LISTS'
  | 'SYSTEM'
  | 'GENERAL';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  is_read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogItem {
  id: string;
  action: string;
  user?: string;
  user_email?: string;
  user_name?: string;
  business?: string;
  business_name?: string;
  reference_id?: string;
  ip_address?: string;
  timestamp: string;
  created_at?: string;
  metadata: Record<string, any>;
  details?: Record<string, any>;
}

export interface ConnectedAccount {
  id: string;
  provider_name: string;
  provider_type: 'MOBILE_MONEY' | 'BANK_ACCOUNT';
  account_name: string;
  masked_number: string;
  status: 'DEMO_CONNECTED' | 'CONNECTED' | 'DISCONNECTED';
  is_primary: boolean;
  currency: string;
  daily_limit?: number;
  is_simulated?: boolean;
  created_at?: string;
  last_synced_at?: string;
}

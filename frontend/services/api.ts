import {
  Business,
  User,
  VerificationResult,
  Recipient,
  Payment,
  PaymentBatch,
  PaymentLink,
  Transaction,
  AnalyticsOverview,
  AuditLogItem,
  ConnectedAccount,
  PaymentList,
  PaymentListCategory,
  PaymentListRecipient,
  PaymentListVerificationResponse,
  RecipientVerificationItem,
  AppNotification,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Seed demo state fallback so live UI works seamlessly in all environments
const MOCK_BUSINESS: Business = {
  id: '87b3221e-12cd-4f51-93e1-7e87ab09c450',
  name: 'ABC Technologies Ltd',
  trade_name: 'ABC Technologies',
  business_id: 'PP-ABC-001',
  legal_form: 'LTD',
  registration_number: 'CS123452021',
  tax_number: 'M092114829104A',
  category: 'Technology & Software',
  sector: 'Technology & Software',
  country: 'Ghana',
  city: 'Accra',
  location: 'Accra, Ghana',
  address: '14 Independence Avenue, Ridge, Accra',
  phone: '+233 24 123 4567',
  email: 'info@abctechnologies.com',
  website: 'https://abctechnologies.com',
  logo_url: '/logo.svg',
  description: 'Leading provider of enterprise financial orchestration, cloud infrastructure, and verified B2B identity rails across West and Central Africa.',
  verification_tier: 'GOLD_VERIFIED',
  trust_score: 96,
  is_active: true,
  daily_payment_limit: 15000000,
  daily_limit_xaf: 15000000,
  primary_momo_number: '+233241234567',
  primary_bank_account: 'GH2110005000010012345678901',
  created_at: '2021-04-12T08:00:00Z',
};

const MOCK_RECIPIENTS: Recipient[] = [
  {
    id: 'rec_1',
    name: 'Douala Organic Supplies',
    company_name: 'Douala Organic Supplies SARL',
    channel: 'MTN_MOMO',
    account_identifier: '+237670000111',
    category: 'Supplier',
    is_verified: true,
    verified_name: 'DOUALA ORGANIC SUPPLIES SARL',
    verification_confidence: 98.5,
    total_disbursed_xaf: 4500000,
    payout_count: 8,
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'rec_2',
    name: 'Kribi Fishery Cooperatives',
    company_name: 'Kribi Fishery Cooperatives',
    channel: 'MTN_MOMO',
    account_identifier: '+237677112233',
    category: 'Supplier',
    is_verified: true,
    verified_name: 'KRIBI FISHERY COOPERATIVES',
    verification_confidence: 99.0,
    total_disbursed_xaf: 8750000,
    payout_count: 14,
    created_at: '2026-07-15T09:30:00Z',
  },
  {
    id: 'rec_3',
    name: 'Yaounde Logistics Hub',
    company_name: 'Yaounde Logistics Hub SARL',
    channel: 'ORANGE_MONEY',
    account_identifier: '+237690334455',
    category: 'Contractor',
    is_verified: true,
    verified_name: 'YAOUNDE LOGISTICS HUB',
    verification_confidence: 94.0,
    total_disbursed_xaf: 2300000,
    payout_count: 5,
    created_at: '2026-08-01T14:15:00Z',
  },
  {
    id: 'rec_4',
    name: 'UBA Heavy Machinery Leasing',
    company_name: 'UBA Heavy Equipments Ltd',
    channel: 'BANK_TRANSFER',
    account_identifier: 'CM2110001000020098765432109',
    category: 'Contractor',
    is_verified: true,
    verified_name: 'UBA HEAVY EQUIPMENTS LTD',
    verification_confidence: 96.0,
    total_disbursed_xaf: 15000000,
    payout_count: 3,
    created_at: '2026-06-20T11:00:00Z',
  },
];

let mockPayments: Payment[] = [
  {
    id: 'pay_1',
    reference_id: 'MOB-DISB-20260903-8812',
    recipient_name: 'Douala Organic Supplies',
    account_identifier: '+237670000111',
    channel: 'MTN_MOMO',
    amount: 250000,
    currency: 'XAF',
    fee: 1250,
    narration: 'Payment for 250kg fertilizer sacks',
    status: 'COMPLETED',
    requires_checker: false,
    is_preflight_verified: true,
    preflight_confidence: 98.5,
    maker_name: 'Jeanne Ngono',
    provider_name: 'MTN_MOMO',
    provider_reference: 'MTN-78A9C1284B',
    created_at: '2026-09-03T18:40:00Z',
    completed_at: '2026-09-03T18:40:02Z',
  },
  {
    id: 'pay_2',
    reference_id: 'MOB-DISB-20260903-9120',
    recipient_name: 'Kribi Fishery Cooperatives',
    account_identifier: '+237677112233',
    channel: 'MTN_MOMO',
    amount: 650000,
    currency: 'XAF',
    fee: 2500,
    narration: 'Batch #88 smoked mackerel delivery',
    status: 'PENDING_APPROVAL',
    requires_checker: true,
    is_preflight_verified: true,
    preflight_confidence: 99.0,
    maker_name: 'Jeanne Ngono',
    created_at: '2026-09-03T19:15:00Z',
  },
];

let mockPaymentLinks: PaymentLink[] = [
  {
    id: 'plink_abc_fashion',
    slug: 'abc-fashion-dress',
    business_name: 'ABC Fashion',
    business_tier: 'GOLD_VERIFIED',
    business_trust_score: 99,
    title: 'Premium Dress',
    description: 'Bespoke handwoven couture with verified business trust badge.',
    amount: 350,
    currency: 'GH₵',
    reference: 'REF-FASHION-2026-01',
    expiry: '2026-10-31',
    allow_custom_amount: false,
    is_active: true,
    payment_url: 'http://localhost:3000/customer/abc-fashion-dress',
    qr_data: 'https://mobira.africa/pay/abc-fashion-dress',
    total_collected_xaf: 4200,
    collections_count: 12,
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'plink_1',
    slug: 'pay-douala-agrotech-inv104',
    business_name: 'Douala Agro-Tech SARL',
    business_tier: 'GOLD_VERIFIED',
    business_trust_score: 94,
    title: 'B2B Invoice #INV-2026-104: 500kg Organic Cocoa',
    description: 'Verified bulk export payment for premium beans batch #49',
    amount: 450000,
    currency: 'XAF',
    allow_custom_amount: false,
    is_active: true,
    payment_url: 'http://localhost:3000/customer/pay-douala-agrotech-inv104',
    qr_data: 'https://mobira.africa/pay/pay-douala-agrotech-inv104',
    total_collected_xaf: 900000,
    collections_count: 2,
    created_at: '2026-09-01T12:00:00Z',
  },
  {
    id: 'plink_2',
    slug: 'douala-agrotech-depot',
    business_name: 'Douala Agro-Tech SARL',
    business_tier: 'GOLD_VERIFIED',
    business_trust_score: 94,
    title: 'Douala Akwa Wholesale Depot Checkout',
    description: 'Scan and pay directly at warehouse counter',
    amount: null,
    currency: 'XAF',
    allow_custom_amount: true,
    is_active: true,
    payment_url: 'http://localhost:3000/customer/douala-agrotech-depot',
    qr_data: 'https://mobira.africa/pay/douala-agrotech-depot',
    total_collected_xaf: 3250000,
    collections_count: 18,
    created_at: '2026-08-20T08:30:00Z',
  },
];

let mockBatches: PaymentBatch[] = [
  {
    id: 'batch_1',
    batch_code: 'BATCH-20260901-78A1',
    title: 'September 2026 Field Staff Payouts (Payroll)',
    status: 'COMPLETED',
    total_amount: 1450000,
    total_fee: 4500,
    total_count: 5,
    processed_count: 5,
    successful_count: 5,
    failed_count: 0,
    items: [
      { id: 'i1', recipient_name: 'Paul Biya Jr.', account_identifier: '+237670112233', channel: 'MTN_MOMO', amount: 250000, fee: 1250, status: 'SUCCESS', provider_reference: 'MTN-B01' },
      { id: 'i2', recipient_name: 'Esther Mbarga', account_identifier: '+237690445566', channel: 'ORANGE_MONEY', amount: 350000, fee: 1750, status: 'SUCCESS', provider_reference: 'OM-B02' },
      { id: 'i3', recipient_name: 'Alain Tchuente', account_identifier: '+237677990011', channel: 'MTN_MOMO', amount: 300000, fee: 1500, status: 'SUCCESS', provider_reference: 'MTN-B03' },
      { id: 'i4', recipient_name: 'Clarisse Fotso', account_identifier: '+237699112244', channel: 'ORANGE_MONEY', amount: 280000, fee: 1400, status: 'SUCCESS', provider_reference: 'OM-B04' },
      { id: 'i5', recipient_name: 'Samuel Ndongo', account_identifier: '+237675123456', channel: 'MTN_MOMO', amount: 270000, fee: 1350, status: 'SUCCESS', provider_reference: 'MTN-B05' },
    ],
    created_at: '2026-09-01T08:00:00Z',
    completed_at: '2026-09-01T08:02:15Z',
  },
];

let mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    reference: 'MOB-TX-20260903-01',
    direction: 'COLLECTION',
    amount: 450000,
    fee: 1250,
    currency: 'XAF',
    channel: 'MTN_MOMO',
    counterparty_name: 'Continental Foods SA',
    counterparty_identifier: '+237677889900',
    status: 'SUCCESS',
    provider_reference: 'MTN-COL-8921471',
    description: 'Collection for Cocoa Batch #104',
    created_at: '2026-09-03T17:10:00Z',
  },
  {
    id: 'tx_2',
    reference: 'MOB-TX-20260903-02',
    direction: 'DISBURSEMENT',
    amount: 250000,
    fee: 1250,
    currency: 'XAF',
    channel: 'MTN_MOMO',
    counterparty_name: 'Douala Organic Supplies',
    counterparty_identifier: '+237670000111',
    status: 'SUCCESS',
    provider_reference: 'MTN-DISB-7729103',
    description: 'Raw materials settlement',
    created_at: '2026-09-03T16:20:00Z',
  },
  {
    id: 'tx_3',
    reference: 'MOB-TX-20260902-03',
    direction: 'DISBURSEMENT',
    amount: 850000,
    fee: 2500,
    currency: 'XAF',
    channel: 'ORANGE_MONEY',
    counterparty_name: 'Yaounde Logistics Hub',
    counterparty_identifier: '+237690334455',
    status: 'SUCCESS',
    provider_reference: 'OM-DISB-9912048',
    description: 'Intercity cold-chain freight fee',
    created_at: '2026-09-02T14:45:00Z',
  },
  {
    id: 'tx_4',
    reference: 'MOB-TX-20260902-04',
    direction: 'COLLECTION',
    amount: 1200000,
    fee: 1500,
    currency: 'XAF',
    channel: 'BANK_TRANSFER',
    counterparty_name: 'Supermarché Sawa Akwa',
    counterparty_identifier: 'CM2110033000030045612378945',
    status: 'SUCCESS',
    provider_reference: 'EFT-REC-4819204',
    description: 'Weekly wholesale store delivery',
    created_at: '2026-09-02T11:15:00Z',
  },
  {
    id: 'tx_5',
    reference: 'MOB-TX-20260901-05',
    direction: 'DISBURSEMENT',
    amount: 180000,
    fee: 900,
    currency: 'XAF',
    channel: 'MTN_MOMO',
    counterparty_name: 'Jean-Paul Kamga',
    counterparty_identifier: '+237675554433',
    status: 'SUCCESS',
    provider_reference: 'MTN-DISB-3104921',
    description: 'Agronomy Consultant Fee',
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'tx_batch_01',
    reference: 'MOB-TXN-2026-000184-01',
    direction: 'DISBURSEMENT',
    amount: 4800,
    fee: 24,
    currency: 'GH₵',
    channel: 'MTN_MOMO',
    counterparty_name: 'Kwame Mensah',
    counterparty_identifier: '+233 24 112 3344',
    status: 'SUCCESS',
    provider_reference: 'MTN-GH-9920148',
    description: 'September Employee Payments (Batch MOB-2026-000184)',
    created_at: '2026-09-03T21:40:00Z',
  },
  {
    id: 'tx_batch_02',
    reference: 'MOB-TXN-2026-000184-02',
    direction: 'DISBURSEMENT',
    amount: 4500,
    fee: 22,
    currency: 'GH₵',
    channel: 'MTN_MOMO',
    counterparty_name: 'Ama Boateng',
    counterparty_identifier: '+233 54 223 4455',
    status: 'SUCCESS',
    provider_reference: 'MTN-GH-9920149',
    description: 'September Employee Payments (Batch MOB-2026-000184)',
    created_at: '2026-09-03T21:35:00Z',
  },
  {
    id: 'tx_batch_03',
    reference: 'MOB-TXN-2026-000184-47',
    direction: 'DISBURSEMENT',
    amount: 3200,
    fee: 16,
    currency: 'GH₵',
    channel: 'MTN_MOMO',
    counterparty_name: 'Kofi Owusu',
    counterparty_identifier: '+233 24 667 8899',
    status: 'PENDING',
    provider_reference: 'MTN-GH-PEND-012',
    description: 'Network queue delay — Automated retry scheduled (Batch MOB-2026-000184)',
    created_at: '2026-09-03T21:25:00Z',
  },
  {
    id: 'tx_batch_04',
    reference: 'MOB-TXN-2026-000184-48',
    direction: 'DISBURSEMENT',
    amount: 2900,
    fee: 0,
    currency: 'GH₵',
    channel: 'MTN_MOMO',
    counterparty_name: 'Yaw Frimpong',
    counterparty_identifier: '+233 24 556 7788',
    status: 'FAILED',
    provider_reference: 'MTN-ERR-LIMIT-EXCEEDED',
    description: 'Recipient daily wallet balance limit exceeded (Batch MOB-2026-000184)',
    created_at: '2026-09-03T21:20:00Z',
  },
  {
    id: 'tx_rec_01',
    reference: 'MOB-TXN-2026-REC-081',
    direction: 'COLLECTION',
    amount: 350,
    fee: 5,
    currency: 'GH₵',
    channel: 'MTN_MOMO',
    counterparty_name: 'Efua Sutherland (Customer)',
    counterparty_identifier: '+233 24 778 9900',
    status: 'SUCCESS',
    provider_reference: 'MTN-REC-884102',
    description: 'Payment for Premium Dress (ABC Fashion ✓)',
    created_at: '2026-09-03T20:50:00Z',
  },
];

async function fetchWithFallback<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline or compiling -> use fallback
  }
  if (fallback !== undefined) return fallback;
  throw new Error(`Request failed for ${url}`);
}

export const MOCK_ABC_FASHION: Business = {
  id: 'biz_abc_fashion',
  business_id: 'PP-FASHION-001',
  name: 'ABC FASHION',
  trade_name: 'ABC Fashion',
  legal_form: 'LTD',
  registration_number: 'CS198242021',
  tax_number: 'C0028912401',
  category: 'Fashion & Retail',
  sector: 'Fashion & Retail',
  country: 'Ghana',
  city: 'Accra',
  location: 'Accra, Ghana',
  address: '14 Independence Avenue, Osu, Accra, Ghana',
  phone: '+233 24 990 1122',
  email: 'concierge@abcfashion.com',
  website: 'https://abcfashion.africa',
  logo_url: '/logo.svg',
  description: 'Verified luxury African apparel, handwoven Kente couture, and contemporary ready-to-wear.',
  verification_tier: 'GOLD_VERIFIED',
  trust_score: 99,
  is_active: true,
  daily_payment_limit: 5000000,
  daily_limit_xaf: 5000000,
  primary_momo_number: '+233249901122',
  created_at: '2022-01-15T08:00:00Z',
};

export const api = {
  // Business Profile
  async getBusinessProfile(): Promise<Business> {
    return fetchWithFallback<Business>('/businesses/profile/', {}, MOCK_BUSINESS);
  },

  async getPublicBusinessProfile(businessId: string): Promise<Business> {
    const fallback =
      businessId.toUpperCase().includes('FASHION') || businessId === 'PP-FASHION-001'
        ? MOCK_ABC_FASHION
        : MOCK_BUSINESS;
    return fetchWithFallback<Business>(
      `/businesses/public/${businessId}/`,
      {},
      fallback
    );
  },

  async onboardBusiness(data: Partial<Business>): Promise<{ message: string; business: Business; public_url: string }> {
    Object.assign(MOCK_BUSINESS, data);
    return fetchWithFallback<{ message: string; business: Business; public_url: string }>(
      '/businesses/onboard/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      {
        message: 'Business onboarding completed successfully.',
        business: MOCK_BUSINESS,
        public_url: `/business/${MOCK_BUSINESS.business_id || 'PP-ABC-001'}`,
      }
    );
  },

  // Verified Business Directory
  async getBusinesses(): Promise<Business[]> {
    return fetchWithFallback<Business[]>('/businesses/', {}, [
      MOCK_ABC_FASHION,
      MOCK_BUSINESS,
      {
        id: 'biz_douala',
        business_id: 'PP-DOUALA-001',
        name: 'Douala Agro-Tech SARL',
        trade_name: 'Douala Agro-Tech',
        legal_form: 'SARL',
        registration_number: 'RC/DLA/2020/B/4521',
        tax_number: 'M052012849312A',
        category: 'Agribusiness & Export',
        sector: 'Agribusiness & Export',
        country: 'Cameroon',
        city: 'Douala',
        location: 'Douala, Cameroon',
        address: 'Boulevard de la Liberté, Akwa, Douala',
        phone: '+237 679 001 122',
        email: 'contact@douala-agrotech.cm',
        description: 'Export-grade organic cocoa beans and palm kernel processing aggregator.',
        verification_tier: 'GOLD_VERIFIED',
        trust_score: 94,
        is_active: true,
        daily_payment_limit: 15000000,
        daily_limit_xaf: 15000000,
        primary_momo_number: '+237679001122',
        created_at: '2020-05-14T08:00:00Z',
      },
      {
        id: 'biz_kumasi',
        business_id: 'PP-KUMASI-002',
        name: 'Kumasi Cocoa Merchants Ltd',
        trade_name: 'Kumasi Cocoa',
        legal_form: 'LTD',
        registration_number: 'CS890122020',
        tax_number: 'C0081920311',
        category: 'Agribusiness & Export',
        sector: 'Agribusiness & Export',
        country: 'Ghana',
        city: 'Kumasi',
        location: 'Kumasi, Ghana',
        address: 'Harbour Road, Adum, Kumasi',
        phone: '+233 32 201 4455',
        email: 'trade@kumasicocoa.com',
        description: 'Licensed cocoa buying and export partner with verified farm-gate trace identity.',
        verification_tier: 'GOLD_VERIFIED',
        trust_score: 95,
        is_active: true,
        daily_payment_limit: 25000000,
        daily_limit_xaf: 25000000,
        primary_momo_number: '+233322014455',
        created_at: '2020-09-12T08:00:00Z',
      },
      {
        id: 'biz_2',
        business_id: 'PP-KRIBI-001',
        name: 'Kribi Fishery Cooperatives',
        legal_form: 'COOP-CA',
        registration_number: 'RC/KRI/2018/B/1102',
        tax_number: 'M031811902451C',
        category: 'Aquaculture & Fisheries',
        sector: 'Aquaculture & Fisheries',
        country: 'Cameroon',
        city: 'Kribi',
        location: 'Kribi, Cameroon',
        address: 'Port Autonome de Kribi Zone Industrielle',
        phone: '+237 677 112 233',
        email: 'orders@kribifishery.cm',
        description: 'Coastal pelagic fishery cooperative supplying commercial hospitality chains.',
        verification_tier: 'GOLD_VERIFIED',
        trust_score: 96,
        is_active: true,
        daily_payment_limit: 20000000,
        daily_limit_xaf: 20000000,
        primary_momo_number: '+237677112233',
        created_at: '2018-03-22T08:00:00Z',
      },
      {
        id: 'biz_3',
        business_id: 'PP-YAOUNDE-001',
        name: 'Yaounde Logistics Hub',
        legal_form: 'SARL',
        registration_number: 'RC/YAO/2022/B/8821',
        tax_number: 'M082217829103B',
        category: 'Logistics & Freight',
        sector: 'Logistics & Freight',
        country: 'Cameroon',
        city: 'Yaounde',
        location: 'Yaounde, Cameroon',
        address: 'Quartier Bastos, Yaounde',
        phone: '+237 690 334 455',
        email: 'dispatch@ylogistics.cm',
        description: 'Inter-regional container freight forwarding and transit warehousing.',
        verification_tier: 'VERIFIED_TIER_1',
        trust_score: 88,
        is_active: true,
        daily_payment_limit: 8000000,
        daily_limit_xaf: 8000000,
        primary_momo_number: '+237690334455',
        created_at: '2022-08-10T08:00:00Z',
      },
      {
        id: 'biz_4',
        business_id: 'PP-BAMENDA-001',
        name: 'Bamenda Artisans Coop',
        legal_form: 'GIC',
        registration_number: 'RC/BDA/2021/C/0491',
        tax_number: 'M042109823120E',
        category: 'Manufacturing & Craft',
        sector: 'Manufacturing & Craft',
        country: 'Cameroon',
        city: 'Bamenda',
        location: 'Bamenda, Cameroon',
        address: 'Commercial Avenue, Bamenda',
        phone: '+237 671 998 877',
        email: 'info@bamendacrafts.org',
        description: 'Handcrafted wood carving, indigenous textiles, and bronze guild.',
        verification_tier: 'BASIC_VERIFIED',
        trust_score: 82,
        is_active: true,
        daily_payment_limit: 5000000,
        daily_limit_xaf: 5000000,
        primary_momo_number: '+237671998877',
        created_at: '2021-04-18T08:00:00Z',
      },
      {
        id: 'biz_volta',
        business_id: 'PP-VOLTA-003',
        name: 'Volta Fresh Logistics',
        trade_name: 'Volta Logistics',
        legal_form: 'LTD',
        registration_number: 'CS554212025',
        tax_number: 'C0099412301',
        category: 'Logistics & Freight',
        sector: 'Logistics & Freight',
        country: 'Ghana',
        city: 'Accra',
        location: 'Accra, Ghana',
        address: 'Tema Motorway Industrial Park, Accra',
        phone: '+233 24 888 1234',
        email: 'ops@voltalogistics.com',
        description: 'Refrigerated container freight awaiting regulatory registry verification.',
        verification_tier: 'UNVERIFIED',
        trust_score: 38,
        is_active: true,
        daily_payment_limit: 2000000,
        daily_limit_xaf: 2000000,
        primary_momo_number: '+233248881234',
        created_at: '2026-08-15T08:00:00Z',
      },
      {
        id: 'biz_goldcoast',
        business_id: 'PP-ARTISAN-004',
        name: 'Gold Coast Artisans Studio',
        trade_name: 'Gold Coast Studio',
        legal_form: 'Enterprise',
        registration_number: 'BN102942026',
        tax_number: 'P0011293021',
        category: 'Fashion & Retail',
        sector: 'Fashion & Retail',
        country: 'Ghana',
        city: 'Kumasi',
        location: 'Kumasi, Ghana',
        address: 'Kejetia Market Complex, Kumasi',
        phone: '+233 54 990 4433',
        email: 'crafts@goldcoaststudio.com',
        description: 'Local boutique atelier with commercial license pending verification check.',
        verification_tier: 'UNVERIFIED',
        trust_score: 42,
        is_active: true,
        daily_payment_limit: 1500000,
        daily_limit_xaf: 1500000,
        primary_momo_number: '+233549904433',
        created_at: '2026-08-20T08:00:00Z',
      },
    ]);
  },

  // Anti-fraud Pre-flight Verification
  async preflightVerify(channel: string, account_identifier: string, expected_name: string = ''): Promise<VerificationResult> {
    const fallbackResult: VerificationResult = {
      verification_id: `VRF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      is_verified: !account_identifier.endsWith('404'),
      match_status: account_identifier.endsWith('404')
        ? 'NOT_FOUND'
        : expected_name && expected_name.toLowerCase().includes('ghost')
        ? 'MISMATCH'
        : 'EXACT_MATCH',
      confidence_score: expected_name && expected_name.toLowerCase().includes('ghost') ? 22.0 : 98.5,
      registered_name: account_identifier.includes('670000111')
        ? 'DOUALA ORGANIC SUPPLIES SARL'
        : account_identifier.includes('677112233')
        ? 'KRIBI FISHERY COOPERATIVES'
        : expected_name
        ? expected_name.toUpperCase()
        : 'VERIFIED SUBSCRIBER',
      expected_name,
      carrier_or_bank: channel.includes('ORANGE') ? 'Orange Cameroun' : channel.includes('BANK') ? 'Afriland First Bank' : 'MTN Cameroon',
      is_safe_to_pay: !account_identifier.endsWith('404') && !(expected_name && expected_name.toLowerCase().includes('ghost')),
      target_identifier: account_identifier,
      warning:
        expected_name && expected_name.toLowerCase().includes('ghost')
          ? 'Warning: Registered telecom holder deviates from invoice name! High risk of payment misdirection.'
          : null,
    };

    return fetchWithFallback<VerificationResult>(
      '/verification/preflight/',
      {
        method: 'POST',
        body: JSON.stringify({ channel, account_identifier, expected_name }),
      },
      fallbackResult
    );
  },

  // Recipients
  async getRecipients(): Promise<Recipient[]> {
    return fetchWithFallback<Recipient[]>('/recipients/', {}, MOCK_RECIPIENTS);
  },

  async createRecipient(data: Partial<Recipient>): Promise<Recipient> {
    const newRec: Recipient = {
      id: `rec_${Date.now()}`,
      name: data.name || '',
      company_name: data.company_name || '',
      channel: data.channel || 'MTN_MOMO',
      account_identifier: data.account_identifier || '',
      category: data.category || 'Supplier',
      is_verified: true,
      verified_name: data.name?.toUpperCase(),
      verification_confidence: 97.0,
      total_disbursed_xaf: 0,
      payout_count: 0,
      created_at: new Date().toISOString(),
    };
    MOCK_RECIPIENTS.unshift(newRec);
    return fetchWithFallback<Recipient>(
      '/recipients/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      newRec
    );
  },

  // Payments / Disbursements
  async getPayments(): Promise<Payment[]> {
    return fetchWithFallback<Payment[]>('/payments/', {}, mockPayments);
  },

  async disbursePayment(data: {
    recipient_name: string;
    account_identifier: string;
    channel: string;
    amount: number;
    currency?: string;
    narration?: string;
    require_preflight?: boolean;
  }): Promise<Payment> {
    const isHighValue = data.amount >= 500000;
    const ref = `MOB-DISB-${Date.now().toString().slice(-6)}`;
    const fee = Math.max(50, Math.min(2500, Math.round(data.amount * 0.005)));

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      reference_id: ref,
      recipient_name: data.recipient_name,
      account_identifier: data.account_identifier,
      channel: data.channel as any,
      amount: data.amount,
      currency: data.currency || 'XAF',
      fee,
      narration: data.narration,
      status: isHighValue ? 'PENDING_APPROVAL' : 'COMPLETED',
      requires_checker: isHighValue,
      is_preflight_verified: data.require_preflight !== false,
      preflight_confidence: 98.5,
      maker_name: 'Jeanne Ngono',
      provider_name: data.channel,
      provider_reference: isHighValue ? undefined : `SIM-TX-${Date.now().toString().slice(-8)}`,
      created_at: new Date().toISOString(),
      completed_at: isHighValue ? undefined : new Date().toISOString(),
    };

    mockPayments.unshift(newPayment);

    if (!isHighValue) {
      mockTransactions.unshift({
        id: `tx_${Date.now()}`,
        reference: ref,
        direction: 'DISBURSEMENT',
        amount: data.amount,
        fee,
        currency: 'XAF',
        channel: data.channel as any,
        counterparty_name: data.recipient_name,
        counterparty_identifier: data.account_identifier,
        status: 'SUCCESS',
        provider_reference: newPayment.provider_reference,
        description: data.narration || `Payout to ${data.recipient_name}`,
        created_at: new Date().toISOString(),
      });
    }

    return fetchWithFallback<Payment>(
      '/payments/disburse/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      newPayment
    );
  },

  async approvePayment(reference_id: string): Promise<Payment> {
    const p = mockPayments.find((x) => x.reference_id === reference_id);
    if (p) {
      p.status = 'COMPLETED';
      p.checker_name = 'Samuel Eto (Admin/CFO)';
      p.provider_reference = `SIM-TX-${Date.now().toString().slice(-8)}`;
      p.completed_at = new Date().toISOString();

      mockTransactions.unshift({
        id: `tx_${Date.now()}`,
        reference: p.reference_id,
        direction: 'DISBURSEMENT',
        amount: p.amount,
        fee: p.fee,
        currency: 'XAF',
        channel: p.channel,
        counterparty_name: p.recipient_name,
        counterparty_identifier: p.account_identifier,
        status: 'SUCCESS',
        provider_reference: p.provider_reference,
        description: p.narration || `Approved Payout to ${p.recipient_name}`,
        created_at: new Date().toISOString(),
      });
      return p;
    }

    return fetchWithFallback<Payment>(`/payments/${reference_id}/approve/`, { method: 'POST' });
  },

  // Payment Batches (Bulk Payroll)
  async getPaymentBatches(): Promise<PaymentBatch[]> {
    return fetchWithFallback<PaymentBatch[]>('/payment-lists/', {}, mockBatches);
  },

  async createPaymentBatch(title: string, items: Array<{ recipient_name: string; account_identifier: string; channel: string; amount: number }>): Promise<PaymentBatch> {
    const totalAmount = items.reduce((acc, i) => acc + i.amount, 0);
    const totalFee = items.reduce((acc, i) => acc + Math.max(50, Math.min(2500, Math.round(i.amount * 0.005))), 0);

    const newBatch: PaymentBatch = {
      id: `batch_${Date.now()}`,
      batch_code: `BATCH-${Date.now().toString().slice(-6)}`,
      title,
      status: 'VALIDATED',
      total_amount: totalAmount,
      total_fee: totalFee,
      total_count: items.length,
      processed_count: 0,
      successful_count: 0,
      failed_count: 0,
      items: items.map((i, idx) => ({
        id: `bi_${idx}`,
        recipient_name: i.recipient_name,
        account_identifier: i.account_identifier,
        channel: i.channel as any,
        amount: i.amount,
        fee: Math.max(50, Math.min(2500, Math.round(i.amount * 0.005))),
        status: 'PENDING',
      })),
      created_at: new Date().toISOString(),
    };

    mockBatches.unshift(newBatch);
    return fetchWithFallback<PaymentBatch>(
      '/payment-lists/',
      {
        method: 'POST',
        body: JSON.stringify({ title, items }),
      },
      newBatch
    );
  },

  async executePaymentBatch(batch_code: string): Promise<PaymentBatch> {
    const batch = mockBatches.find((b) => b.batch_code === batch_code);
    if (batch) {
      batch.status = 'COMPLETED';
      batch.processed_count = batch.total_count;
      batch.successful_count = batch.total_count;
      batch.failed_count = 0;
      batch.completed_at = new Date().toISOString();
      batch.items?.forEach((item) => {
        item.status = 'SUCCESS';
        item.provider_reference = `SIM-BATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      });
      return batch;
    }

    return fetchWithFallback<PaymentBatch>(`/payment-lists/${batch_code}/execute/`, { method: 'POST' });
  },

  // Receive & Payment Links
  async getPaymentLinks(): Promise<PaymentLink[]> {
    return fetchWithFallback<PaymentLink[]>('/receive/links/', {}, mockPaymentLinks);
  },

  async createPaymentLink(data: {
    title: string;
    description?: string;
    amount?: number | null;
    currency?: string;
    reference?: string;
    expiry?: string;
    is_active?: boolean;
    allow_custom_amount?: boolean;
  }): Promise<PaymentLink> {
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
    const newLink: PaymentLink = {
      id: `plink_${Date.now()}`,
      slug,
      business_name: MOCK_BUSINESS.name,
      business_tier: MOCK_BUSINESS.verification_tier,
      business_trust_score: MOCK_BUSINESS.trust_score,
      title: data.title,
      description: data.description || '',
      amount: data.amount,
      currency: data.currency || 'GH₵',
      reference: data.reference || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      expiry: data.expiry || '2026-10-31',
      allow_custom_amount: !!data.allow_custom_amount,
      is_active: data.is_active !== undefined ? data.is_active : true,
      payment_url: `http://localhost:3000/customer/${slug}`,
      qr_data: `https://mobira.africa/pay/${slug}`,
      total_collected_xaf: 0,
      collections_count: 0,
      created_at: new Date().toISOString(),
    };

    mockPaymentLinks.unshift(newLink);
    return fetchWithFallback<PaymentLink>(
      '/receive/links/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      newLink
    );
  },

  async getPaymentLink(slug: string): Promise<PaymentLink | undefined> {
    const found = mockPaymentLinks.find((l) => l.slug === slug);
    return fetchWithFallback<PaymentLink>(`/receive/links/${slug}/`, {}, found || mockPaymentLinks[0]);
  },

  async customerPay(slug: string, data: { payer_name: string; payer_phone: string; channel: string; amount: number }): Promise<any> {
    const link = mockPaymentLinks.find((l) => l.slug === slug) || mockPaymentLinks[0];
    link.total_collected_xaf += data.amount;
    link.collections_count += 1;

    const ref = `MOB-COLL-${Date.now().toString().slice(-6)}`;
    mockTransactions.unshift({
      id: `tx_${Date.now()}`,
      reference: ref,
      direction: 'COLLECTION',
      amount: data.amount,
      fee: 750,
      currency: 'XAF',
      channel: data.channel as any,
      counterparty_name: data.payer_name,
      counterparty_identifier: data.payer_phone,
      status: 'SUCCESS',
      provider_reference: `SIM-USSD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      description: `Collection via ${link.title}`,
      created_at: new Date().toISOString(),
    });

    return fetchWithFallback<any>(
      `/receive/links/${slug}/pay/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      {
        status: 'SUCCESS',
        message: `Payment of ${data.amount} XAF successfully received via ${data.channel}!`,
        simulated_ussd_approved: true,
      }
    );
  },

  // Transactions & Statements
  async getTransactions(params?: { search?: string; direction?: string; channel?: string }): Promise<Transaction[]> {
    return fetchWithFallback<Transaction[]>('/transactions/', {}, mockTransactions);
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsOverview> {
    const totalDisbursed = mockTransactions
      .filter((t) => t.direction === 'DISBURSEMENT')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalCollected = mockTransactions
      .filter((t) => t.direction === 'COLLECTION')
      .reduce((acc, t) => acc + t.amount, 0);

    const fallback: AnalyticsOverview = {
      currency: 'XAF',
      kpis: {
        total_volume: totalDisbursed + totalCollected,
        total_disbursed: totalDisbursed,
        total_collected: totalCollected,
        net_cashflow: totalCollected - totalDisbursed,
        total_fees: 7400,
        success_rate_percentage: 99.4,
        total_transactions_count: mockTransactions.length + 142,
        active_recipients_count: MOCK_RECIPIENTS.length,
        preflight_verifications_count: 89,
      },
      trust: {
        score: 94,
        tier: 'GOLD_VERIFIED',
        days_clean_record: 184,
        identity_match_rate: 99.2,
      },
      channel_distribution: [
        { name: 'MTN Mobile Money', volume: 28400000, percentage: 58.0, color: '#EAB308' },
        { name: 'Orange Money', volume: 14200000, percentage: 29.0, color: '#F97316' },
        { name: 'Interbank EFT (GIMAC)', volume: 6350000, percentage: 13.0, color: '#0284C7' },
      ],
      monthly_trends: [
        { month: 'Apr', disbursements: 12500000, collections: 18200000 },
        { month: 'May', disbursements: 14200000, collections: 21500000 },
        { month: 'Jun', disbursements: 19800000, collections: 26900000 },
        { month: 'Jul', disbursements: 22400000, collections: 31400000 },
        { month: 'Aug', disbursements: 28100000, collections: 39800000 },
        { month: 'Sep', disbursements: totalDisbursed || 34500000, collections: totalCollected || 48200000 },
      ],
    };

    return fetchWithFallback<AnalyticsOverview>('/analytics/overview/', {}, fallback);
  },

  // ============================================================================
  // CONNECTED ACCOUNTS & PROVIDER ABSTRACTION
  // ============================================================================
  async getConnectedAccounts(): Promise<ConnectedAccount[]> {
    return fetchWithFallback<ConnectedAccount[]>(
      '/businesses/connected-accounts/',
      {},
      mockConnectedAccounts
    );
  },

  async connectAccount(data: {
    provider_name: string;
    account_name: string;
    account_identifier: string;
    is_primary?: boolean;
  }): Promise<ConnectedAccount> {
    const rawId = (data.account_identifier || '').trim();
    const lastDigits = rawId.length >= 4 ? rawId.slice(-4) : '4821';
    const masked = `•••• ${lastDigits}`;
    const provType = data.provider_name.includes('BANK') ? 'BANK_ACCOUNT' : 'MOBILE_MONEY';

    const newAccount: ConnectedAccount = {
      id: `conn_${Date.now()}`,
      provider_name: data.provider_name,
      provider_type: provType,
      account_name: data.account_name,
      masked_number: masked,
      status: 'DEMO_CONNECTED',
      is_primary: data.is_primary ?? false,
      currency: 'XAF',
      daily_limit: provType === 'BANK_ACCOUNT' ? 15000000 : 5000000,
      is_simulated: true,
      created_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString(),
    };

    if (newAccount.is_primary) {
      mockConnectedAccounts.forEach((acc) => (acc.is_primary = false));
    }
    mockConnectedAccounts = [newAccount, ...mockConnectedAccounts];

    return fetchWithFallback<ConnectedAccount>(
      '/businesses/connected-accounts/connect/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      newAccount
    );
  },

  async disconnectAccount(id: string): Promise<boolean> {
    mockConnectedAccounts = mockConnectedAccounts.filter((acc) => acc.id !== id);
    await fetchWithFallback(`/businesses/connected-accounts/${id}/disconnect/`, { method: 'POST' }, { success: true });
    return true;
  },

  async setPrimaryAccount(id: string): Promise<ConnectedAccount> {
    mockConnectedAccounts.forEach((acc) => {
      acc.is_primary = acc.id === id;
    });
    const found = mockConnectedAccounts.find((acc) => acc.id === id) || mockConnectedAccounts[0];
    return fetchWithFallback<ConnectedAccount>(
      `/businesses/connected-accounts/${id}/set-primary/`,
      { method: 'POST' },
      found
    );
  },

  // ============================================================================
  // REUSABLE PAYMENT LISTS (PAYMENT LISTS)
  // ============================================================================
  async getPaymentLists(category?: string): Promise<PaymentList[]> {
    let result = [...mockPaymentLists];
    if (category && category !== 'All') {
      result = result.filter((l) => l.category.toLowerCase() === category.toLowerCase());
    }
    const query = category && category !== 'All' ? `?category=${category}` : '';
    return fetchWithFallback<PaymentList[]>(`/payment-lists/lists/${query}`, {}, result);
  },

  async createPaymentList(data: {
    name: string;
    category: PaymentListCategory;
    recipient_count: number;
    total_amount: number;
    currency?: string;
    description?: string;
  }): Promise<PaymentList> {
    const newList: PaymentList = {
      id: `list_${Date.now()}`,
      name: data.name,
      category: data.category,
      recipient_count: data.recipient_count,
      total_amount: data.total_amount,
      currency: data.currency || 'GH₵',
      description: data.description || '',
      status: 'READY',
      created_at: new Date().toISOString(),
      sample_recipients: [
        {
          id: 'rec_1',
          name: 'Kwame Mensah',
          account_identifier: '+233 24 100 2200',
          channel: 'MTN_MOMO',
          amount: Math.round(data.total_amount / (data.recipient_count || 1)),
          is_verified: true,
        },
      ],
    };

    mockPaymentLists = [newList, ...mockPaymentLists];
    return fetchWithFallback<PaymentList>(
      '/payment-lists/lists/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      newList
    );
  },

  async getPaymentList(listId: string): Promise<PaymentList> {
    const fallback = mockPaymentLists.find((l) => l.id === listId) || mockPaymentLists[0];
    return fetchWithFallback<PaymentList>(`/payment-lists/lists/${listId}/`, {}, fallback);
  },

  async updatePaymentList(
    listId: string,
    data: {
      name?: string;
      category?: PaymentListCategory;
      description?: string;
      recipients?: PaymentListRecipient[];
    }
  ): Promise<PaymentList> {
    const found = mockPaymentLists.find((l) => l.id === listId);
    if (found) {
      if (data.name) found.name = data.name;
      if (data.category) found.category = data.category;
      if (data.description !== undefined) found.description = data.description;
      if (data.recipients) {
        found.recipients = data.recipients;
        found.sample_recipients = data.recipients;
        found.recipient_count = data.recipients.length;
        found.total_amount = data.recipients.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      }
    }
    const fallback = found || mockPaymentLists[0];
    return fetchWithFallback<PaymentList>(
      `/payment-lists/lists/${listId}/`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      fallback
    );
  },

  async duplicatePaymentList(listId: string, customName?: string): Promise<PaymentList> {
    const original = mockPaymentLists.find((l) => l.id === listId) || mockPaymentLists[0];
    const cloned: PaymentList = {
      ...original,
      id: `plist_dup_${Date.now()}`,
      name: customName || `${original.name} (Copy)`,
      status: 'READY',
      created_at: new Date().toISOString(),
      recipients: (original.recipients || original.sample_recipients || []).map((r, idx) => ({
        ...r,
        id: `rec_dup_${Date.now()}_${idx}`,
      })),
    };
    cloned.sample_recipients = cloned.recipients;
    mockPaymentLists = [cloned, ...mockPaymentLists];

    return fetchWithFallback<PaymentList>(
      `/payment-lists/lists/${listId}/duplicate/`,
      {
        method: 'POST',
        body: JSON.stringify({ name: customName }),
      },
      cloned
    );
  },

  async deletePaymentList(listId: string): Promise<boolean> {
    mockPaymentLists = mockPaymentLists.filter((l) => l.id !== listId);
    await fetchWithFallback(`/payment-lists/lists/${listId}/`, { method: 'DELETE' }, { success: true });
    return true;
  },

  async verifyPaymentListRecipients(
    listId: string,
    simulateMismatch: boolean = false
  ): Promise<PaymentListVerificationResponse> {
    const plist = mockPaymentLists.find((l) => l.id === listId) || mockPaymentLists[0];
    const items = plist.recipients || plist.sample_recipients || [];

    // Fallback simulation if backend endpoint is unavailable
    const results: RecipientVerificationItem[] = items.map((r, idx) => {
      const isMismatch = simulateMismatch && (idx === 0 || idx === 1);
      const returnedName = isMismatch ? 'Yaw Mensah' : r.name;
      const cleanPhone = r.phone || r.account_identifier || '024 112 3344';
      const parts = cleanPhone.split(' ');
      const masked = parts.length >= 2 ? `${parts[0]} XXX XXXX` : `${cleanPhone.slice(0, 3)} XXX XXXX`;

      return {
        id: r.id,
        saved_recipient_name: r.name,
        saved_phone: cleanPhone,
        masked_phone: masked,
        provider: r.provider || r.channel || 'MTN MoMo',
        account: r.account || r.account_identifier || cleanPhone,
        amount: r.amount,
        returned_account_name: returnedName,
        match_status: isMismatch ? 'NAME_MISMATCH' : 'MATCH_VERIFIED',
        is_match: !isMismatch,
        error_message: isMismatch ? "Recipient details don't match the saved beneficiary." : null,
      };
    });

    const fallbackResponse: PaymentListVerificationResponse = {
      payment_list_id: plist.id,
      list_name: plist.name,
      total_checked: results.length,
      has_mismatch: results.some((r) => !r.is_match),
      matched_count: results.filter((r) => r.is_match).length,
      mismatched_count: results.filter((r) => !r.is_match).length,
      results,
    };

    return fetchWithFallback<PaymentListVerificationResponse>(
      `/payment-lists/lists/${listId}/verify-recipients/`,
      {
        method: 'POST',
        body: JSON.stringify({ simulate_mismatch: simulateMismatch }),
      },
      fallbackResponse
    );
  },

  async disbursePaymentList(
    listId: string,
    hasUnresolvedMismatch: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    if (hasUnresolvedMismatch) {
      throw new Error('Cannot disburse funds with unresolved KYC name mismatches.');
    }
    const found = mockPaymentLists.find((l) => l.id === listId);
    if (found) {
      found.status = 'COMPLETED';
      found.last_disbursed_at = new Date().toISOString();
    }
    return fetchWithFallback(
      `/payment-lists/lists/${listId}/disburse/`,
      {
        method: 'POST',
        body: JSON.stringify({ has_unresolved_mismatch: hasUnresolvedMismatch }),
      },
      {
        success: true,
        message: `Disbursement to ${found?.recipient_count || 0} recipients completed successfully.`,
      }
    );
  },

  // Notifications System
  async getNotifications(): Promise<AppNotification[]> {
    return fetchWithFallback<AppNotification[]>('/notifications/', {}, [...mockNotifications]);
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) notif.is_read = true;
    await fetchWithFallback(`/notifications/${id}/read/`, { method: 'POST' }, { success: true });
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    mockNotifications.forEach((n) => (n.is_read = true));
    await fetchWithFallback('/notifications/read-all/', { method: 'POST' }, { success: true });
    return true;
  },

  async dismissNotification(id: string): Promise<boolean> {
    mockNotifications = mockNotifications.filter((n) => n.id !== id);
    await fetchWithFallback(`/notifications/${id}/`, { method: 'DELETE' }, { success: true });
    return true;
  },

  async addNotification(data: Partial<AppNotification>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: data.title || 'Notification Alert',
      message: data.message || '',
      type: data.type || 'INFO',
      category: data.category || 'GENERAL',
      is_read: false,
      created_at: new Date().toISOString(),
      action_url: data.action_url,
      metadata: data.metadata,
    };
    mockNotifications = [newNotif, ...mockNotifications];
    return fetchWithFallback<AppNotification>(
      '/notifications/',
      { method: 'POST', body: JSON.stringify(newNotif) },
      newNotif
    );
  },

  // Audit Logging
  async getAuditLogs(params?: { search?: string; action?: string }): Promise<AuditLogItem[]> {
    let list = [...mockAuditLogs];
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.action.toLowerCase().includes(q) ||
          (a.user_name && a.user_name.toLowerCase().includes(q)) ||
          (a.user_email && a.user_email.toLowerCase().includes(q)) ||
          (a.reference_id && a.reference_id.toLowerCase().includes(q)) ||
          JSON.stringify(a.metadata || {}).toLowerCase().includes(q)
      );
    }
    if (params?.action && params.action !== 'ALL') {
      list = list.filter((a) => a.action.toLowerCase() === params.action?.toLowerCase());
    }

    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.action && params.action !== 'ALL') query.set('action', params.action);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return fetchWithFallback<AuditLogItem[]>(`/audit/${queryString}`, {}, list);
  },

  async logAuditEvent(action: string, metadata: Record<string, any> = {}, referenceId?: string): Promise<AuditLogItem> {
    const newLog: AuditLogItem = {
      id: `aud_${Date.now()}`,
      action,
      user_name: 'Jeanne Ngono',
      user_email: 'jeanne@abctechnologies.com',
      business_name: 'ABC Technologies Ltd',
      reference_id: referenceId || `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      metadata,
    };
    mockAuditLogs = [newLog, ...mockAuditLogs];
    return fetchWithFallback<AuditLogItem>(
      '/audit/',
      { method: 'POST', body: JSON.stringify({ action, metadata, reference_id: newLog.reference_id }) },
      newLog
    );
  },

  async resetDemo(): Promise<{ status: string; message: string }> {
    return fetchWithFallback<{ status: string; message: string }>(
      '/reset-demo/',
      { method: 'POST' },
      { status: 'success', message: 'Demo data reset successfully to initial state.' }
    );
  },
};

let mockPaymentLists: PaymentList[] = [
  {
    id: 'plist_sep_employees',
    name: 'September Employee Payments',
    category: 'Employees',
    recipient_count: 48,
    total_amount: 142000,
    currency: 'GH₵',
    description: 'Monthly recurring corporate salary disbursements with pre-flight telecom KYC verification.',
    status: 'READY',
    created_at: '2026-09-01T09:00:00Z',
    sample_recipients: [
      { id: 'r1', name: 'Kwame Asante', account_identifier: '+233 24 112 3344', channel: 'MTN_MOMO', amount: 4800, role_or_item: 'Senior Software Engineer', is_verified: true },
      { id: 'r2', name: 'Ama Boateng', account_identifier: '+233 54 223 4455', channel: 'MTN_MOMO', amount: 4500, role_or_item: 'Product Designer', is_verified: true },
      { id: 'r3', name: 'Kofi Mensah', account_identifier: '+233 20 334 5566', channel: 'ORANGE_MONEY', amount: 4200, role_or_item: 'DevOps Specialist', is_verified: true },
      { id: 'r4', name: 'Abena Osei', account_identifier: '01004 88210 4821', channel: 'BANK_TRANSFER', amount: 5600, role_or_item: 'Finance Controller', is_verified: true },
      { id: 'r5', name: 'Yaw Frimpong', account_identifier: '+233 24 998 1122', channel: 'MTN_MOMO', amount: 3900, role_or_item: 'QA Engineer', is_verified: true },
    ],
  },
  {
    id: 'plist_monthly_suppliers',
    name: 'Monthly Suppliers',
    category: 'Suppliers',
    recipient_count: 20,
    total_amount: 32500,
    currency: 'GH₵',
    description: 'Verified agricultural produce aggregators, cold-chain transport, and warehouse logistics providers.',
    status: 'READY',
    created_at: '2026-09-02T11:15:00Z',
    sample_recipients: [
      { id: 's1', name: 'Ashanti Agro-Produce Ltd', account_identifier: '+233 24 776 5544', channel: 'MTN_MOMO', amount: 8500, role_or_item: 'Organic Cocoa Beans Batch #41', is_verified: true },
      { id: 's2', name: 'Volta Logistics Transport', account_identifier: '+233 50 112 9900', channel: 'MTN_MOMO', amount: 6200, role_or_item: 'Refrigerated Transport Delivery', is_verified: true },
      { id: 's3', name: 'Koforidua Packaging Co', account_identifier: '02008 33410 9184', channel: 'BANK_TRANSFER', amount: 4800, role_or_item: 'Corrugated Export Boxes', is_verified: true },
      { id: 's4', name: 'Central Region Cold Storage', account_identifier: '+233 24 334 1122', channel: 'MTN_MOMO', amount: 5100, role_or_item: 'Storage Unit Rental', is_verified: true },
    ],
  },
  {
    id: 'plist_contractor_payments',
    name: 'Contractor Payments',
    category: 'Contractors',
    recipient_count: 12,
    total_amount: 18700,
    currency: 'GH₵',
    description: 'External development specialists, regulatory legal counsel, and UI design consultants.',
    status: 'READY',
    created_at: '2026-09-03T14:30:00Z',
    sample_recipients: [
      { id: 'c1', name: 'DevStack Solutions Ghana', account_identifier: '+233 24 881 2299', channel: 'MTN_MOMO', amount: 6500, role_or_item: 'Smart Contract Audit & Pen-Test', is_verified: true },
      { id: 'c2', name: 'Accra Legal Advisors LLP', account_identifier: '01009 55410 2210', channel: 'BANK_TRANSFER', amount: 5200, role_or_item: 'Fintech Regulatory Compliance Filing', is_verified: true },
      { id: 'c3', name: 'PixelCraft UX Studio', account_identifier: '+233 55 443 2211', channel: 'MTN_MOMO', amount: 4000, role_or_item: 'Design System & Mobile Mockups', is_verified: true },
      { id: 'c4', name: 'CloudPeak DevOps Consultancy', account_identifier: '+233 24 556 7788', channel: 'MTN_MOMO', amount: 3000, role_or_item: 'Kubernetes Cluster Provisioning', is_verified: true },
    ],
  },
];


let mockConnectedAccounts: ConnectedAccount[] = [
  {
    id: 'acc_momo',
    provider_name: 'MTN_MOMO',
    provider_type: 'MOBILE_MONEY',
    account_name: 'MTN MoMo Business',
    masked_number: '•••• 4821',
    status: 'DEMO_CONNECTED',
    is_primary: true,
    currency: 'XAF',
    daily_limit: 5000000,
    is_simulated: true,
    created_at: '2026-08-15T10:00:00Z',
    last_synced_at: '2026-09-03T21:30:00Z',
  },
  {
    id: 'acc_bank',
    provider_name: 'BANK_TRANSFER',
    provider_type: 'BANK_ACCOUNT',
    account_name: 'Business Bank Account',
    masked_number: '•••• 9184',
    status: 'DEMO_CONNECTED',
    is_primary: false,
    currency: 'XAF',
    daily_limit: 15000000,
    is_simulated: true,
    created_at: '2026-08-10T14:30:00Z',
    last_synced_at: '2026-09-03T21:30:00Z',
  },
];

let mockNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Business verification completed',
    message: 'ABC Technologies Ltd has attained Gold Verified status (Score: 96/100) after RCCM and Tax Compliance check.',
    type: 'SUCCESS',
    category: 'VERIFICATION',
    is_read: false,
    created_at: '2026-09-03T21:50:00Z',
    action_url: '/verify',
    metadata: {
      business_name: 'ABC Technologies Ltd',
      tier: 'GOLD_VERIFIED',
      trust_score: 96,
      registration_number: 'CS123452021',
    },
  },
  {
    id: 'notif_2',
    title: 'Payment successful',
    message: 'Batch MOB-2026-000184: 48/48 payments completed successfully. GH₵142,000 disbursed via MTN MoMo Business.',
    type: 'SUCCESS',
    category: 'PAYMENTS',
    is_read: false,
    created_at: '2026-09-03T21:40:00Z',
    action_url: '/transactions',
    metadata: {
      batch_id: 'MOB-2026-000184',
      total_amount: 142000,
      recipients: 48,
      provider: 'MTN MoMo Business — Demo',
    },
  },
  {
    id: 'notif_3',
    title: 'Payment failed',
    message: 'Transaction MOB-TXN-2026-000184-48 failed: Recipient wallet limit exceeded (+233 24 556 7788).',
    type: 'ERROR',
    category: 'PAYMENTS',
    is_read: false,
    created_at: '2026-09-03T21:20:00Z',
    action_url: '/transactions',
    metadata: {
      tx_id: 'MOB-TXN-2026-000184-48',
      recipient: 'Yaw Frimpong',
      amount: 2900,
      reason: 'Recipient daily wallet balance limit exceeded',
    },
  },
  {
    id: 'notif_4',
    title: 'Recipient mismatch detected',
    message: 'Pre-flight check detected name mismatch: Saved beneficiary Kwame Mensah returned provider account Yaw Mensah.',
    type: 'WARNING',
    category: 'SECURITY',
    is_read: false,
    created_at: '2026-09-03T20:15:00Z',
    action_url: '/payment-lists',
    metadata: {
      saved_name: 'Kwame Mensah',
      returned_name: 'Yaw Mensah',
      phone: '024 112 3344',
      match_status: 'NAME_MISMATCH',
    },
  },
  {
    id: 'notif_5',
    title: 'Payment list updated',
    message: "Payment list 'September Employee Payments' was updated with 48 verified recipients and total GH₵142,000.",
    type: 'INFO',
    category: 'PAYMENT_LISTS',
    is_read: true,
    created_at: '2026-09-03T19:00:00Z',
    action_url: '/payment-lists',
    metadata: {
      list_id: 'plist_sep_employees',
      list_name: 'September Employee Payments',
      recipient_count: 48,
      total_amount: 142000,
    },
  },
  {
    id: 'notif_6',
    title: 'Payment received',
    message: "Received GH₵350 from Efua Sutherland for 'Premium Dress' via MTN MoMo (Ref: MOB-REC-884102).",
    type: 'SUCCESS',
    category: 'PAYMENTS',
    is_read: true,
    created_at: '2026-09-03T18:30:00Z',
    action_url: '/statements',
    metadata: {
      amount: 350,
      payer: 'Efua Sutherland',
      item: 'Premium Dress',
      reference: 'MOB-REC-884102',
    },
  },
  {
    id: 'notif_7',
    title: 'Payment link created',
    message: "New active payment link created for 'Premium Dress' (GH₵350) with instant QR checkout.",
    type: 'INFO',
    category: 'PAYMENTS',
    is_read: true,
    created_at: '2026-09-03T17:00:00Z',
    action_url: '/receive',
    metadata: {
      title: 'Premium Dress',
      amount: 350,
      slug: 'abc-fashion-dress',
      url: '/customer/abc-fashion-dress',
    },
  },
];

let mockAuditLogs: AuditLogItem[] = [
  {
    id: 'aud_10',
    action: 'payment link created',
    user: 'usr_maker',
    user_name: 'Jeanne Ngono',
    user_email: 'jeanne@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'REF-LINK-2026-01',
    ip_address: '197.234.221.4',
    timestamp: '2026-09-03T21:45:00Z',
    created_at: '2026-09-03T21:45:00Z',
    metadata: {
      title: 'Premium Dress',
      amount: 350,
      currency: 'GH₵',
      slug: 'abc-fashion-dress',
      qr_enabled: true,
    },
  },
  {
    id: 'aud_9',
    action: 'payment failed',
    user: undefined,
    user_name: 'Mobira Automated Sentinel',
    user_email: 'system@mobira.internal',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'MOB-TXN-2026-000184-48',
    ip_address: '10.0.4.12',
    timestamp: '2026-09-03T21:40:02Z',
    created_at: '2026-09-03T21:40:02Z',
    metadata: {
      recipient: 'Yaw Frimpong',
      phone: '+233 24 556 7788',
      amount: 2900,
      error_code: 'ERR_WALLET_LIMIT_EXCEEDED',
      reason: 'Recipient daily wallet balance limit exceeded',
    },
  },
  {
    id: 'aud_8',
    action: 'payment completed',
    user: 'usr_checker',
    user_name: 'Paul Biya (CFO)',
    user_email: 'cfo@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'MOB-2026-000184',
    ip_address: '197.234.221.18',
    timestamp: '2026-09-03T21:40:00Z',
    created_at: '2026-09-03T21:40:00Z',
    metadata: {
      batch_id: 'MOB-2026-000184',
      successful_count: 48,
      total_disbursed: 142000,
      currency: 'GH₵',
      network_reference: 'MTN-GH-9920148',
    },
  },
  {
    id: 'aud_7',
    action: 'payment authorized',
    user: 'usr_checker',
    user_name: 'Paul Biya (CFO)',
    user_email: 'cfo@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'MOB-2026-000184',
    ip_address: '197.234.221.18',
    timestamp: '2026-09-03T21:38:00Z',
    created_at: '2026-09-03T21:38:00Z',
    metadata: {
      recipients: 48,
      total_amount: 142000,
      currency: 'GH₵',
      provider: 'MTN MoMo Business — Demo',
      verification_status: '48/48 Verified',
    },
  },
  {
    id: 'aud_6',
    action: 'recipient verified',
    user: 'usr_maker',
    user_name: 'Jeanne Ngono',
    user_email: 'jeanne@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'KYC-REC-4821',
    ip_address: '197.234.221.4',
    timestamp: '2026-09-03T21:30:00Z',
    created_at: '2026-09-03T21:30:00Z',
    metadata: {
      saved_recipient: 'Kwame Mensah',
      phone: '+233 24 112 3344',
      returned_account_name: 'Kwame Mensah',
      match_status: 'MATCH_VERIFIED',
      confidence_score: 99.2,
    },
  },
  {
    id: 'aud_5',
    action: 'payment list imported',
    user: 'usr_maker',
    user_name: 'Jeanne Ngono',
    user_email: 'jeanne@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'PLIST-IMP-0903',
    ip_address: '197.234.221.4',
    timestamp: '2026-09-03T21:20:00Z',
    created_at: '2026-09-03T21:20:00Z',
    metadata: {
      filename: 'September_Employee_Payments.csv',
      total_rows: 48,
      valid_recipients: 48,
      total_amount: 142000,
      currency: 'GH₵',
    },
  },
  {
    id: 'aud_4',
    action: 'verification completed',
    user: 'usr_compliance',
    user_name: 'Mobira Regulatory Gateway',
    user_email: 'compliance@mobira.africa',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'VERIF-GOLD-001',
    ip_address: '10.0.1.1',
    timestamp: '2026-09-03T18:00:00Z',
    created_at: '2026-09-03T18:00:00Z',
    metadata: {
      status: 'VERIFIED',
      tier: 'GOLD_VERIFIED',
      trust_score: 96,
      rccm_status: 'ACTIVE_GOOD_STANDING',
      tax_compliance: 'TAX_CURRENT',
    },
  },
  {
    id: 'aud_3',
    action: 'verification submitted',
    user: 'usr_maker',
    user_name: 'Jeanne Ngono',
    user_email: 'jeanne@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'SUB-VERIF-7821',
    ip_address: '197.234.221.4',
    timestamp: '2026-09-03T17:45:00Z',
    created_at: '2026-09-03T17:45:00Z',
    metadata: {
      registration_number: 'CS123452021',
      tax_number: 'M092114829104A',
      category: 'Technology & Software',
      requested_tier: 'GOLD_VERIFIED',
    },
  },
  {
    id: 'aud_2',
    action: 'business created',
    user: 'usr_maker',
    user_name: 'Jeanne Ngono',
    user_email: 'jeanne@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'BIZ-INIT-ABC',
    ip_address: '197.234.221.4',
    timestamp: '2026-09-03T16:00:00Z',
    created_at: '2026-09-03T16:00:00Z',
    metadata: {
      business_name: 'ABC Technologies Ltd',
      business_id: 'PP-ABC-001',
      legal_form: 'LTD',
      location: 'Accra, Ghana',
    },
  },
  {
    id: 'aud_1',
    action: 'login',
    user: 'usr_maker',
    user_name: 'Jeanne Ngono',
    user_email: 'jeanne@abctechnologies.com',
    business: 'biz_abc_technologies',
    business_name: 'ABC Technologies Ltd',
    reference_id: 'SESS-LOGIN-8841',
    ip_address: '197.234.221.4',
    timestamp: '2026-09-03T15:55:00Z',
    created_at: '2026-09-03T15:55:00Z',
    metadata: {
      auth_method: 'PASSKEY_MFA',
      ip: '197.234.221.4',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    },
  },
];

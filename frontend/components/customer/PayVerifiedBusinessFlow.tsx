'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  Smartphone,
  Check,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Business } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/components/ui/Toast';

export interface PayVerifiedBusinessFlowProps {
  businesses: Business[];
}

export const PayVerifiedBusinessFlow: React.FC<PayVerifiedBusinessFlowProps> = ({ businesses }) => {
  const { toast } = useToast();

  // Search by: Business name, Business ID, Phone, Category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Active Flow States
  // Selected business for public profile modal
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Payment flow steps: 'PRODUCT_SELECT' | 'PAYMENT_REVIEW' | 'PROCESSING' | 'SUCCESS'
  const [paymentStep, setPaymentStep] = useState<
    'NONE' | 'PRODUCT_SELECT' | 'PAYMENT_REVIEW' | 'PROCESSING' | 'SUCCESS'
  >('NONE');

  // Product selection & amount
  const [selectedProduct, setSelectedProduct] = useState({
    title: 'Premium Dress',
    amount: 350,
    currency: 'GH₵',
  });
  const [customerPhone, setCustomerPhone] = useState('024 112 3344');
  const [customerChannel, setCustomerChannel] = useState('MTN_MOMO');
  const [txRef, setTxRef] = useState('MOB-PAY-2026-08492');

  const categories = [
    'ALL',
    'Fashion & Retail',
    'Technology & Software',
    'Agribusiness & Export',
    'Aquaculture & Fisheries',
  ];

  // Filtering businesses
  const filtered = businesses.filter((b) => {
    // Category match
    if (selectedCategory !== 'ALL') {
      const bCat = b.category || b.sector || '';
      if (!bCat.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    }

    // Search match across: Business name, Business ID, Phone, Category
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = b.name.toLowerCase().includes(q) || (b.trade_name && b.trade_name.toLowerCase().includes(q));
      const matchId = (b.business_id && b.business_id.toLowerCase().includes(q)) || (b.id && b.id.toLowerCase().includes(q));
      const matchPhone = b.phone && b.phone.toLowerCase().includes(q);
      const matchCat = (b.category && b.category.toLowerCase().includes(q)) || (b.sector && b.sector.toLowerCase().includes(q));

      return matchName || matchId || matchPhone || matchCat;
    }

    return true;
  });

  // Handle opening public profile
  const handleOpenProfile = (b: Business) => {
    setSelectedBusiness(b);
  };

  // Start payment flow
  const handleStartPayment = (b: Business) => {
    setSelectedBusiness(b);
    setPaymentStep('PRODUCT_SELECT');
  };

  // Proceed to Payment Review
  const handleProceedToReview = () => {
    setPaymentStep('PAYMENT_REVIEW');
  };

  // Authorize Payment
  const handleAuthorize = () => {
    setPaymentStep('PROCESSING');
    setTimeout(() => {
      setTxRef(`MOB-PAY-2026-${Date.now().toString().slice(-6)}`);
      setPaymentStep('SUCCESS');
      toast({
        type: 'success',
        title: 'Payment Complete',
        message: `GH₵${selectedProduct.amount} paid to ${selectedBusiness?.name} ✓`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="p-6 bg-gradient-to-br from-navy-950 to-navy-900 border border-navy-800 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Customer Experience
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pay a Verified Business
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Never send money to unverified personal accounts. Search accredited merchants by{' '}
            <strong className="text-yellow-400">Business Name</strong>,{' '}
            <strong className="text-yellow-400">Business ID</strong>,{' '}
            <strong className="text-yellow-400">Phone</strong>, or{' '}
            <strong className="text-yellow-400">Category</strong>.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Business Name (e.g. ABC Fashion), Business ID (e.g. PP-FASHION-001), Phone, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-navy-900/90 border-2 border-yellow-500/50 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 font-medium"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-bold shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-yellow-500 text-navy-950 font-black'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {filtered.length} verified merchant{filtered.length === 1 ? '' : 's'}</span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline"
          >
            Clear search filters
          </button>
        )}
      </div>

      {/* Verified Business Result Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No verified businesses found"
          description={
            searchQuery
              ? `No merchants match "${searchQuery}". Try searching by registered company name, ID (e.g. PP-FASHION-001), phone, or select another category.`
              : 'No verified businesses match the selected category filter.'
          }
          actionLabel="Clear Search Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => {
            const isFashion = b.business_id === 'PP-FASHION-001' || b.name.toUpperCase().includes('FASHION');

            return (
              <Card
                key={b.id}
                onClick={() => handleOpenProfile(b)}
                className="p-6 border-2 border-slate-200 dark:border-navy-800 hover:border-yellow-500/70 transition-all cursor-pointer shadow-subtle hover:shadow-modal flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Business Name with Verified Tick */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black text-navy-950 dark:text-white uppercase tracking-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                          {b.name}
                        </h3>
                        <span
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-black shrink-0 shadow-sm"
                          title="Verified by Mobira"
                        >
                          ✓
                        </span>
                      </div>

                      {/* 🔵 VERIFIED BUSINESS Badge */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          VERIFIED BUSINESS
                        </span>
                      </div>
                    </div>

                    {b.business_id && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                        {b.business_id}
                      </span>
                    )}
                  </div>

                  {/* Location & Category */}
                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {b.location || `${b.city}, ${b.country}`}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      {b.category || b.sector}
                    </p>
                  </div>

                  {/* Verified Payment Destination Indicator */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Verified Payment Destination</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-850 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-navy-950 dark:group-hover:text-white flex items-center gap-1">
                    View Profile <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartPayment(b);
                    }}
                    className="text-xs font-black uppercase tracking-wider py-1.5 px-4 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
                  >
                    [ PAY NOW ]
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER BUSINESS PROFILE MODAL                                           */}
      {/* ========================================================================= */}
      {selectedBusiness && paymentStep === 'NONE' && (
        <Modal
          isOpen={!!selectedBusiness && paymentStep === 'NONE'}
          onClose={() => setSelectedBusiness(null)}
          title="Verified Merchant Profile"
          description="Official public credentials and certified payment rails."
          maxWidth="md"
        >
          <div className="space-y-6">
            {/* Merchant Identity Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 text-center space-y-3 shadow-subtle">
              {/* Business Name with Verified Tick */}
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl font-black text-navy-950 dark:text-white uppercase tracking-tight">
                  {selectedBusiness.name}
                </h3>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-black shadow-sm">
                  ✓
                </span>
              </div>

              {/* 🔵 VERIFIED BUSINESS */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                🔵 VERIFIED BUSINESS
              </div>

              {/* Location & Category */}
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-1">
                <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  {selectedBusiness.location || `${selectedBusiness.city}, ${selectedBusiness.country}`}
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">
                  {selectedBusiness.category || selectedBusiness.sector}
                </p>
              </div>

              {/* Business ID */}
              <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Business ID:
                </span>
                <span className="font-mono text-sm font-black text-navy-950 dark:text-white">
                  {selectedBusiness.business_id || 'PP-FASHION-001'}
                </span>
              </div>

              {/* Verified Payment Destination Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified Payment Destination</span>
              </div>
            </div>

            {/* Note on Private Information Protection */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Customer privacy protection active: Private accounts and banking secrets are securely masked.</span>
            </div>

            {/* Primary Action: [ PAY NOW ] */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedBusiness(null)}
                className="w-full text-xs font-bold"
              >
                Close Profile
              </Button>

              <Button
                variant="primary"
                onClick={() => setPaymentStep('PRODUCT_SELECT')}
                className="w-full text-xs font-black uppercase tracking-wider py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
              >
                [ PAY NOW ]
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER PAYMENT FLOW: STEP 1 - PRODUCT / AMOUNT SELECTION                */}
      {/* ========================================================================= */}
      {selectedBusiness && paymentStep === 'PRODUCT_SELECT' && (
        <Modal
          isOpen={paymentStep === 'PRODUCT_SELECT'}
          onClose={() => setPaymentStep('NONE')}
          title={`Pay ${selectedBusiness.name} ✓`}
          description="Select a catalog product or enter custom payment amount."
          maxWidth="md"
        >
          <div className="space-y-5">
            {/* Merchant Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-navy-950 dark:text-white">
                    {selectedBusiness.name}
                  </h4>
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">✓</span>
                </div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Verified Payment Destination</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">
                {selectedBusiness.business_id || 'PP-FASHION-001'}
              </span>
            </div>

            {/* Product Selection Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
                Select Item to Pay:
              </label>

              {/* Exact Requested Item: Premium Dress - GH₵350 */}
              <button
                type="button"
                onClick={() =>
                  setSelectedProduct({
                    title: 'Premium Dress',
                    amount: 350,
                    currency: 'GH₵',
                  })
                }
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  selectedProduct.title === 'Premium Dress'
                    ? 'border-yellow-500 bg-yellow-50/60 dark:bg-yellow-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-navy-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-navy-950 dark:text-white">
                      Premium Dress
                    </h5>
                    <p className="text-xs text-slate-500">Handcrafted bespoke African couture</p>
                  </div>
                </div>
                <span className="text-lg font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
                  GH₵350
                </span>
              </button>

              {/* Alternative Product */}
              <button
                type="button"
                onClick={() =>
                  setSelectedProduct({
                    title: 'Bespoke Kente Suit',
                    amount: 650,
                    currency: 'GH₵',
                  })
                }
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                  selectedProduct.title === 'Bespoke Kente Suit'
                    ? 'border-yellow-500 bg-yellow-50/60 dark:bg-yellow-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-navy-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-navy-950 dark:text-white">
                      Bespoke Kente Suit
                    </h5>
                    <p className="text-xs text-slate-500">Formal two-piece ceremonial suit</p>
                  </div>
                </div>
                <span className="text-lg font-black text-navy-950 dark:text-white tabular-nums">
                  GH₵650
                </span>
              </button>
            </div>

            {/* Customer Wallet Number & Rail */}
            <div className="space-y-3 pt-2">
              <Input
                label="Your Customer Mobile Number (MoMo / Orange)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="024 112 3344"
                required
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Customer Payment Rail
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCustomerChannel('MTN_MOMO')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-1.5 ${
                      customerChannel === 'MTN_MOMO'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-navy-950 dark:text-yellow-400 font-extrabold'
                        : 'border-slate-200 dark:border-navy-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerChannel('ORANGE_MONEY')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-1.5 ${
                      customerChannel === 'ORANGE_MONEY'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-navy-950 dark:text-yellow-400 font-extrabold'
                        : 'border-slate-200 dark:border-navy-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Orange Money
                  </button>
                </div>
              </div>
            </div>

            {/* Action to proceed to review */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setPaymentStep('NONE')}
                className="w-full text-xs font-bold"
              >
                Back to Profile
              </Button>

              <Button
                variant="primary"
                onClick={handleProceedToReview}
                className="w-full text-xs font-black uppercase tracking-wider py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated gap-2"
              >
                Review Payment <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER PAYMENT FLOW: STEP 2 - PAYMENT REVIEW (EXACT SPECIFICATION)      */}
      {/* ========================================================================= */}
      {selectedBusiness && paymentStep === 'PAYMENT_REVIEW' && (
        <Modal
          isOpen={paymentStep === 'PAYMENT_REVIEW'}
          onClose={() => setPaymentStep('PRODUCT_SELECT')}
          title="Payment Review"
          description="Verify recipient identity and amount before confirming."
          maxWidth="sm"
        >
          <div className="space-y-5">
            {/* Exact Wireframe Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 text-center space-y-4 shadow-modal">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                You're paying
              </span>

              {/* Business Name with Verified Tick */}
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-2xl font-black text-navy-950 dark:text-white">
                  {selectedBusiness.name}
                </h3>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-black shadow-sm">
                  ✓
                </span>
              </div>

              {/* Product Title */}
              <div className="py-2 border-y border-slate-100 dark:border-navy-800">
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                  {selectedProduct.title}
                </h4>
                <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mt-2 tabular-nums">
                  GH₵{selectedProduct.amount}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="space-y-1 text-xs">
                <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Verified Business
                </p>
                <p className="font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Payment Destination
                </p>
              </div>
            </div>

            {/* Payer Account Confirmation */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Debiting from:</span>
              <strong className="font-mono text-navy-950 dark:text-white">
                {customerPhone} ({customerChannel.replace('_', ' ')})
              </strong>
            </div>

            {/* Exact Action Button: [ AUTHORIZE PAYMENT ] */}
            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                onClick={handleAuthorize}
                className="w-full text-xs font-black uppercase tracking-wider py-3.5 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated gap-2"
              >
                [ AUTHORIZE PAYMENT ]
              </Button>

              <Button
                variant="outline"
                onClick={() => setPaymentStep('PRODUCT_SELECT')}
                className="w-full text-xs font-semibold"
              >
                Back / Change Product
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER PAYMENT FLOW: STEP 3 - PROCESSING                                */}
      {/* ========================================================================= */}
      {selectedBusiness && paymentStep === 'PROCESSING' && (
        <Modal
          isOpen={paymentStep === 'PROCESSING'}
          onClose={() => {}}
          title="Processing Payment..."
          description="Authorizing payment with verified merchant destination"
          maxWidth="sm"
        >
          <div className="py-8 text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-4 border-yellow-500 border-t-transparent animate-spin" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-navy-950 dark:text-white">
                Contacting {customerChannel === 'MTN_MOMO' ? 'MTN MoMo' : 'Orange Money'} Network
              </h4>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold animate-pulse">
                Debiting {customerPhone} for GH₵{selectedProduct.amount}...
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER PAYMENT FLOW: STEP 4 - SUCCESS                                   */}
      {/* ========================================================================= */}
      {selectedBusiness && paymentStep === 'SUCCESS' && (
        <Modal
          isOpen={paymentStep === 'SUCCESS'}
          onClose={() => {
            setPaymentStep('NONE');
            setSelectedBusiness(null);
          }}
          title="Payment Successful!"
          description="Official receipt and settlement confirmation"
          maxWidth="sm"
        >
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-300 dark:border-emerald-700/60">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-navy-950 dark:text-white">
                GH₵{selectedProduct.amount} Paid
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Successfully cleared to {selectedBusiness.name} ✓
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Ref:</span>
                <span className="font-mono font-bold text-navy-950 dark:text-white">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Item:</span>
                <span className="font-bold text-navy-950 dark:text-white">{selectedProduct.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant Destination:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Verified Payment Destination ✓
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Debited Account:</span>
                <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">{customerPhone}</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                setPaymentStep('NONE');
                setSelectedBusiness(null);
              }}
              className="w-full text-xs font-black uppercase tracking-wider py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
            >
              Done / Return to Directory
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

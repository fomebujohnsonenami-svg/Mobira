'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Check,
  Share2,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  QrCode,
  ArrowRight,
  Sparkles,
  Lock,
  FileCheck,
  Copy,
  ShoppingBag,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { api, MOCK_ABC_FASHION } from '@/services/api';
import { Business } from '@/types';

export default function PublicBusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const businessId = (params.businessId as string) || 'PP-FASHION-001';

  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Customer Payment Flow States
  const [paymentStep, setPaymentStep] = useState<
    'NONE' | 'PRODUCT_SELECT' | 'PAYMENT_REVIEW' | 'PROCESSING' | 'SUCCESS'
  >('NONE');

  const [selectedProduct, setSelectedProduct] = useState({
    title: 'Premium Dress',
    amount: 350,
    currency: 'GH₵',
  });
  const [customerPhone, setCustomerPhone] = useState('024 112 3344');
  const [customerChannel, setCustomerChannel] = useState('MTN_MOMO');
  const [txRef, setTxRef] = useState('MOB-PAY-2026-FASHION-001');

  useEffect(() => {
    setIsLoading(true);
    api
      .getPublicBusinessProfile(businessId)
      .then((data) => {
        setBusiness(data);
      })
      .catch(() => {
        setBusiness(MOCK_ABC_FASHION);
      })
      .finally(() => setIsLoading(false));
  }, [businessId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        type: 'success',
        title: 'Profile Link Copied',
        message: 'Share this public verified identity with partners or customers.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartPayment = () => {
    setPaymentStep('PRODUCT_SELECT');
  };

  const handleProceedToReview = () => {
    setPaymentStep('PAYMENT_REVIEW');
  };

  const handleAuthorize = () => {
    setPaymentStep('PROCESSING');
    setTimeout(() => {
      setTxRef(`MOB-PAY-2026-${Date.now().toString().slice(-6)}`);
      setPaymentStep('SUCCESS');
      toast({
        type: 'success',
        title: 'Payment Complete',
        message: `GH₵${selectedProduct.amount} paid to ${business?.name} ✓`,
      });
    }, 1500);
  };

  if (isLoading || !business) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-yellow-500 selection:text-navy-950">
      {/* Top Public Header */}
      <header className="h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-yellow-500 text-navy-950 font-black text-sm flex items-center justify-center shadow-subtle">
            M
          </div>
          <div>
            <span className="font-black text-base text-navy-950 dark:text-white tracking-tight">
              MOBIRA
            </span>
            <span className="ml-1.5 text-[9px] uppercase font-extrabold tracking-widest text-yellow-600 dark:text-yellow-400">
              VERIFIED BUSINESS PROFILE
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share Profile'}</span>
          </button>

          <Link
            href="/pay-verified-business"
            className="px-3.5 py-1.5 rounded-lg bg-navy-900 dark:bg-navy-800 text-white hover:bg-navy-850 text-xs font-bold transition-colors shadow-subtle flex items-center gap-1"
          >
            Directory
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto p-4 sm:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* CUSTOMER BUSINESS PROFILE (EXACT SPECIFICATION)                           */}
        {/* ========================================================================= */}
        <Card className="p-8 bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 shadow-modal text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-yellow-500/10 rounded-full pointer-events-none blur-2xl" />

          {/* Business Name with Verified Tick */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-black text-navy-950 dark:text-white uppercase tracking-tight">
                {business.name}
              </h1>
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-base font-black shadow-sm"
                title="Verified by Mobira"
              >
                ✓
              </span>
            </div>

            {/* 🔵 VERIFIED BUSINESS */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              🔵 VERIFIED BUSINESS
            </div>
          </div>

          {/* Location & Category */}
          <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-extrabold text-base text-navy-950 dark:text-slate-100">
              {business.location || `${business.city}, ${business.country}`}
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs">
              {business.category || business.sector || 'Fashion & Retail'}
            </p>
          </div>

          {/* Business ID */}
          <div className="py-2 border-y border-slate-100 dark:border-navy-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Business ID:
            </span>
            <span className="font-mono text-base font-black text-navy-950 dark:text-white">
              {business.business_id || 'PP-FASHION-001'}
            </span>
          </div>

          {/* Verified Payment Destination Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Verified Payment Destination</span>
          </div>

          {/* Featured Product Preview */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-left flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-950 dark:text-white">Premium Dress</h4>
                <p className="text-[11px] text-slate-400">Handcrafted bespoke couture</p>
              </div>
            </div>
            <span className="text-lg font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
              GH₵350
            </span>
          </div>

          {/* Exact Action Button: [ PAY NOW ] */}
          <Button
            type="button"
            variant="primary"
            onClick={handleStartPayment}
            className="w-full py-4 text-sm font-black uppercase tracking-wider bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated gap-2"
          >
            [ PAY NOW ]
          </Button>

          {/* Privacy Note */}
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Private banking & corporate tax details are securely shielded.</span>
          </div>
        </Card>

        {/* Safety Notice & Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-navy-950 dark:text-slate-300">
            Mobira Verified Identity Protocol • NOT a Bank, NOT a Wallet
          </p>
          <p className="text-[11px]">
            Identity verified via official commercial registries and telecom subscriber records. All customer payments settle directly through authorized mobile money and banking rails.
          </p>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* CUSTOMER PAYMENT FLOW: PRODUCT SELECTION MODAL                            */}
      {/* ========================================================================= */}
      {paymentStep === 'PRODUCT_SELECT' && (
        <Modal
          isOpen={paymentStep === 'PRODUCT_SELECT'}
          onClose={() => setPaymentStep('NONE')}
          title={`Pay ${business.name} ✓`}
          description="Confirm product and customer mobile money details"
          maxWidth="md"
        >
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-navy-950 dark:text-white">
                    {business.name}
                  </h4>
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">✓</span>
                </div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Verified Payment Destination</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">
                {business.business_id || 'PP-FASHION-001'}
              </span>
            </div>

            {/* Product selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
                Product Item:
              </label>

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
            </div>

            {/* Customer Wallet Number & Rail */}
            <div className="space-y-3 pt-2">
              <Input
                label="Your Customer Mobile Money Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="024 112 3344"
                required
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Customer Payment Rail
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

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setPaymentStep('NONE')}
                className="w-full text-xs font-bold"
              >
                Cancel
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
      {/* CUSTOMER PAYMENT FLOW: PAYMENT REVIEW (EXACT SPECIFICATION)               */}
      {/* ========================================================================= */}
      {paymentStep === 'PAYMENT_REVIEW' && (
        <Modal
          isOpen={paymentStep === 'PAYMENT_REVIEW'}
          onClose={() => setPaymentStep('PRODUCT_SELECT')}
          title="Payment Review"
          description="Verify recipient identity and amount before authorizing."
          maxWidth="sm"
        >
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 text-center space-y-4 shadow-modal">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                You're paying
              </span>

              {/* Business Name with Verified Tick */}
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-2xl font-black text-navy-950 dark:text-white">
                  {business.name}
                </h3>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-black shadow-sm">
                  ✓
                </span>
              </div>

              {/* Product Title & Amount */}
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
                Back / Change Details
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMER PAYMENT FLOW: PROCESSING                                         */}
      {/* ========================================================================= */}
      {paymentStep === 'PROCESSING' && (
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
      {/* CUSTOMER PAYMENT FLOW: SUCCESS                                            */}
      {/* ========================================================================= */}
      {paymentStep === 'SUCCESS' && (
        <Modal
          isOpen={paymentStep === 'SUCCESS'}
          onClose={() => setPaymentStep('NONE')}
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
                Successfully cleared to {business.name} ✓
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
                <span className="text-slate-400">Destination:</span>
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
              onClick={() => setPaymentStep('NONE')}
              className="w-full text-xs font-black uppercase tracking-wider py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
            >
              Done / Return to Profile
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

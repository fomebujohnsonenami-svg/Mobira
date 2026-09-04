'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Plus,
  Copy,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  Share2,
  Download,
  CreditCard,
  Building,
  ArrowRight,
  Receipt,
  Check,
} from 'lucide-react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingState';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { CreatePaymentLinkModal } from '@/components/receive/CreatePaymentLinkModal';
import { QRCodeModal } from '@/components/receive/QRCodeModal';
import { api } from '@/services/api';
import { PaymentLink } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useToast } from '@/components/ui/Toast';
import { usePrivacy, PrivacyToggle } from '@/components/privacy/PrivacyContext';

type ReceiveTab = 'CUSTOMER_PAGES' | 'PAYMENT_LINKS' | 'QR_CODE' | 'PAYMENT_REQUESTS' | 'INVOICES';

export default function ReceivePage() {
  const { toast } = useToast();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [activeTab, setActiveTab] = useState<ReceiveTab>('CUSTOMER_PAGES');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQRLink, setSelectedQRLink] = useState<PaymentLink | null>(null);

  // Interactive Live Checkout Modal for ABC Fashion
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [payerPhone, setPayerPhone] = useState('024 112 3344');
  const [payerProvider, setPayerProvider] = useState('MTN MoMo');
  const [isPayingNow, setIsPayingNow] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Payment Request Form
  const [reqCustomerName, setReqCustomerName] = useState('');
  const [reqCustomerPhone, setReqCustomerPhone] = useState('');
  const [reqAmount, setReqAmount] = useState(350);
  const [reqNotes, setReqNotes] = useState('');
  const [reqSent, setReqSent] = useState(false);

  // Invoice Form
  const [invClientName, setInvClientName] = useState('Accra Boutique Holdings Ltd');
  const [invItem, setInvItem] = useState('Premium Dress (Bulk 3x)');
  const [invAmount, setInvAmount] = useState(1050);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPaymentLinks();
      setLinks(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load payment links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyUrl = (slug: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/customer/${slug}`;
    navigator.clipboard?.writeText(url);
    toast({
      type: 'success',
      title: 'Payment Link Copied',
      message: 'Share this link directly via WhatsApp, SMS, or Social Media.',
    });
  };

  const handleSimulatedPayNow = () => {
    setIsPayingNow(true);
    setTimeout(() => {
      setIsPayingNow(false);
      setPaymentDone(true);
      toast({
        type: 'success',
        title: 'Payment Received from Customer',
        message: 'GH₵350 received from Efua Sutherland via MTN MoMo.',
      });
    }, 1200);
  };

  const handleSendPaymentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setReqSent(true);
    toast({
      type: 'success',
      title: 'Payment Request Dispatched',
      message: `USSD billing prompt of GH₵${reqAmount} sent to ${reqCustomerPhone}.`,
    });
    setTimeout(() => {
      setReqCustomerName('');
      setReqCustomerPhone('');
      setReqSent(false);
    }, 2000);
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Receive Payments"
        subtitle="Create branded payment links, QR codes, payment requests, simple invoices, and customer checkout pages."
        badge={
          <div className="flex items-center gap-2">
            <BusinessVerificationBadge size="sm" />
            <PrivacyToggle size="sm" />
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 font-bold text-xs shadow-elevated"
            >
              <Plus className="w-4 h-4" /> Create Payment Link
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Feature Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-navy-800 text-xs">
            <button
              onClick={() => setActiveTab('CUSTOMER_PAGES')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'CUSTOMER_PAGES'
                  ? 'bg-navy-950 text-yellow-400 dark:bg-yellow-400 dark:text-navy-950 shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Customer Payment Pages
            </button>

            <button
              onClick={() => setActiveTab('PAYMENT_LINKS')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'PAYMENT_LINKS'
                  ? 'bg-navy-950 text-yellow-400 dark:bg-yellow-400 dark:text-navy-950 shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Payment Links ({links.length})
            </button>

            <button
              onClick={() => setActiveTab('QR_CODE')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'QR_CODE'
                  ? 'bg-navy-950 text-yellow-400 dark:bg-yellow-400 dark:text-navy-950 shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> QR Code
            </button>

            <button
              onClick={() => setActiveTab('PAYMENT_REQUESTS')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'PAYMENT_REQUESTS'
                  ? 'bg-navy-950 text-yellow-400 dark:bg-yellow-400 dark:text-navy-950 shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Payment Requests
            </button>

            <button
              onClick={() => setActiveTab('INVOICES')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'INVOICES'
                  ? 'bg-navy-950 text-yellow-400 dark:bg-yellow-400 dark:text-navy-950 shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Simple Invoices
            </button>
          </div>

          {loading ? (
            <CardSkeleton count={3} />
          ) : error ? (
            <ErrorState title="Something went wrong." message={error} onRetry={loadData} />
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: CUSTOMER PAYMENT PAGES (EXACT SPECIFICATION SHOWCASE)              */}
              {/* ========================================================================= */}
              {activeTab === 'CUSTOMER_PAGES' && (
                <div className="space-y-6">
                  {/* Highlight Callout */}
                  <div className="p-4 rounded-xl bg-yellow-50/50 dark:bg-navy-950 border border-yellow-300 dark:border-yellow-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                      <div>
                        <strong className="text-yellow-950 dark:text-yellow-200 block font-bold text-sm">
                          Hosted Customer Payment Pages
                        </strong>
                        <span className="text-yellow-900/80 dark:text-yellow-300/80">
                          Customers pay securely on mobile or desktop with pre-flight verification badges that guarantee trust.
                        </span>
                      </div>
                    </div>

                    <Link href="/customer/abc-fashion-dress" target="_blank">
                      <Button variant="outline" size="sm" className="text-xs font-bold gap-1.5 border-slate-300 dark:border-navy-700">
                        <ExternalLink className="w-3.5 h-3.5" /> Open Full Hosted URL
                      </Button>
                    </Link>
                  </div>

                  {/* Exact Prompt Example Featured Card */}
                  <div className="max-w-md mx-auto">
                    <Card className="p-7 bg-white dark:bg-navy-900 border-2 border-yellow-500/80 shadow-modal relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-yellow-500 text-navy-950 text-[10px] uppercase font-black px-3 py-1 rounded-bl-xl tracking-wider">
                        Live Demo Example
                      </div>

                      {/* Merchant Identity & Verified Badge */}
                      <div className="space-y-1 text-center pt-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <h2 className="text-xl font-black text-navy-950 dark:text-white">
                            ABC Fashion
                          </h2>
                          <span
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-black shadow-sm"
                            title="Verified Business by Mobira"
                          >
                            ✓
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          Verified Business
                        </p>
                      </div>

                      {/* Product / Service Item */}
                      <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-center space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Item Description
                        </span>
                        <h3 className="text-lg font-black text-navy-950 dark:text-slate-100">
                          Premium Dress
                        </h3>
                        <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mt-2 tabular-nums">
                          GH₵350
                        </p>
                      </div>

                      {/* Exact Action Button: [ PAY NOW ] */}
                      <Button
                        variant="primary"
                        onClick={() => {
                          setPaymentDone(false);
                          setIsCheckoutModalOpen(true);
                        }}
                        className="w-full py-3.5 text-sm font-black uppercase tracking-wider bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated gap-2"
                      >
                        [ PAY NOW ]
                      </Button>

                      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Protected by Mobira Pre-Flight Verification</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: PAYMENT LINKS                                                      */}
              {/* ========================================================================= */}
              {activeTab === 'PAYMENT_LINKS' && (
                links.length === 0 ? (
                  <EmptyState
                    icon={ExternalLink}
                    title="No payment links found"
                    description="Create reusable customer payment links to receive funds online."
                    actionLabel="Create Payment Link"
                    onAction={() => setIsCreateOpen(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {links.map((link) => (
                      <Card
                        key={link.id}
                        className="p-6 flex flex-col justify-between border-2 border-slate-200 dark:border-navy-800 hover:border-yellow-500/60 transition-all shadow-subtle rounded-2xl bg-white dark:bg-navy-900"
                      >
                        <div className="space-y-3">
                          {/* Title & Amount Header */}
                          <div>
                            <h3 className="font-black text-lg text-navy-950 dark:text-white leading-snug">
                              {link.title}
                            </h3>
                            <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-1 tabular-nums">
                              {link.amount ? formatCurrency(link.amount, link.currency || 'GH₵') : 'GH₵350'}
                            </p>
                          </div>

                          {/* Payment Link label & Active status */}
                          <div className="py-2 border-y border-slate-100 dark:border-navy-800 flex items-center justify-between">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                              Payment Link
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {link.is_active !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Description or Reference */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                            <p className="line-clamp-2">{link.description || 'Public checkout link protected by Mobira pre-flight verification.'}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                              <span>Ref: {link.reference || 'REF-FASHION-01'}</span>
                              <span>Exp: {link.expiry || '2026-10-31'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions: [ COPY LINK ] and [ VIEW ] */}
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-850 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyUrl(link.slug)}
                              className="w-full text-xs font-black uppercase tracking-wider gap-1.5 border-slate-300 dark:border-navy-700"
                            >
                              <Copy className="w-3.5 h-3.5" /> [ COPY LINK ]
                            </Button>

                            <Link href={`/customer/${link.slug}`} target="_blank" className="w-full">
                              <Button
                                variant="primary"
                                size="sm"
                                className="w-full text-xs font-black uppercase tracking-wider gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> [ VIEW ]
                              </Button>
                            </Link>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedQRLink(link)}
                            className="w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white gap-1 py-1"
                          >
                            <QrCode className="w-3.5 h-3.5 text-yellow-500" /> View QR Code for This Payment Page
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              )}

              {/* ========================================================================= */}
              {/* TAB 3: QR CODE GENERATOR                                                  */}
              {/* ========================================================================= */}
              {activeTab === 'QR_CODE' && (
                <div className="max-w-md mx-auto">
                  <Card className="p-7 text-center space-y-4 border-2 border-slate-200 dark:border-navy-800 shadow-modal">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <h3 className="text-lg font-black text-navy-950 dark:text-white">ABC Fashion</h3>
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">✓</span>
                      </div>
                      <p className="text-xs text-slate-500">Scan to pay with MTN MoMo, Orange Money, or Bank</p>
                    </div>

                    {/* QR Matrix Representation */}
                    <div className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl border-2 border-dashed border-yellow-500 flex items-center justify-center shadow-inner">
                      <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-yellow-400 p-2 text-center space-y-2">
                        <QrCode className="w-24 h-24 stroke-[1.5]" />
                        <span className="text-[10px] font-mono text-slate-300 font-bold tracking-widest uppercase">
                          MOBIRA-QR-PP-001
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast({ type: 'success', title: 'QR Downloaded', message: 'Printable SVG QR code saved.' })}
                        className="text-xs font-bold gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download SVG
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => copyUrl('abc-fashion-dress')}
                        className="text-xs font-bold gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share QR URL
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: PAYMENT REQUESTS                                                   */}
              {/* ========================================================================= */}
              {activeTab === 'PAYMENT_REQUESTS' && (
                <div className="max-w-lg mx-auto">
                  <Card className="p-6 space-y-4 border-2 border-slate-200 dark:border-navy-800 shadow-modal">
                    <div>
                      <h3 className="text-base font-extrabold text-navy-950 dark:text-white">
                        Send Direct Payment Request
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Triggers a native USSD mobile money push directly on the customer's handset.
                      </p>
                    </div>

                    <form onSubmit={handleSendPaymentRequest} className="space-y-4">
                      <Input
                        label="Customer Full Name"
                        value={reqCustomerName}
                        onChange={(e) => setReqCustomerName(e.target.value)}
                        placeholder="e.g. Efua Sutherland"
                        required
                      />

                      <Input
                        label="Customer Mobile Phone Number"
                        value={reqCustomerPhone}
                        onChange={(e) => setReqCustomerPhone(e.target.value)}
                        placeholder="e.g. 024 112 3344"
                        required
                      />

                      <Input
                        label="Requested Amount (GH₵)"
                        type="number"
                        value={reqAmount}
                        onChange={(e) => setReqAmount(Number(e.target.value))}
                        required
                      />

                      <Input
                        label="Reason / Memo for Customer"
                        value={reqNotes}
                        onChange={(e) => setReqNotes(e.target.value)}
                        placeholder="e.g. Premium Dress Balance"
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={reqSent}
                        className="w-full text-xs font-black gap-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950"
                      >
                        <Send className="w-3.5 h-3.5" /> Send USSD Payment Prompt
                      </Button>
                    </form>
                  </Card>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: SIMPLE INVOICES                                                    */}
              {/* ========================================================================= */}
              {activeTab === 'INVOICES' && (
                <div className="max-w-lg mx-auto">
                  <Card className="p-6 space-y-4 border-2 border-slate-200 dark:border-navy-800 shadow-modal">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-navy-950 dark:text-white">
                          Simple B2B Invoice Generator
                        </h3>
                        <p className="text-xs text-slate-500">Generate a payable digital invoice with 1-click checkout</p>
                      </div>
                      <Badge variant="blue" size="sm">INV-2026-089</Badge>
                    </div>

                    <div className="space-y-3 text-xs">
                      <Input
                        label="Client / Corporate Name"
                        value={invClientName}
                        onChange={(e) => setInvClientName(e.target.value)}
                      />

                      <Input
                        label="Line Item"
                        value={invItem}
                        onChange={(e) => setInvItem(e.target.value)}
                      />

                      <Input
                        label="Invoice Total (GH₵)"
                        type="number"
                        value={invAmount}
                        onChange={(e) => setInvAmount(Number(e.target.value))}
                      />

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Subtotal:</span>
                          <strong className="text-navy-950 dark:text-white">GH₵{invAmount}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pre-Flight Identity Check:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Included ✓</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-navy-800 font-bold text-sm">
                          <span>Total Payable:</span>
                          <span className="text-yellow-600 dark:text-yellow-400 font-black">GH₵{invAmount}</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => {
                          toast({
                            type: 'success',
                            title: 'Invoice Issued',
                            message: `Invoice INV-2026-089 dispatched to ${invClientName} with payment link.`,
                          });
                        }}
                        className="w-full text-xs font-black gap-2 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-navy-950"
                      >
                        <FileText className="w-3.5 h-3.5" /> Issue Digital Invoice
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal: ABC Fashion Simulated [ PAY NOW ] Checkout */}
        <Modal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          title="ABC Fashion Checkout"
          description="Simulated customer mobile payment flow"
          maxWidth="sm"
        >
          <div className="space-y-4">
            {!paymentDone ? (
              <>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Item</span>
                    <strong className="text-sm font-extrabold text-navy-950 dark:text-white">Premium Dress</strong>
                  </div>
                  <span className="text-xl font-black text-yellow-600 dark:text-yellow-400">GH₵350</span>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Customer Phone (MoMo Wallet)"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="024 112 3344"
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Select Payment Rail
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPayerProvider('MTN MoMo')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-1.5 ${
                          payerProvider === 'MTN MoMo'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-navy-950 dark:text-yellow-400'
                            : 'border-slate-200 dark:border-navy-800'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        MTN MoMo
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayerProvider('Orange Money')}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-1.5 ${
                          payerProvider === 'Orange Money'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-navy-950 dark:text-yellow-400'
                            : 'border-slate-200 dark:border-navy-800'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Orange Money
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  isLoading={isPayingNow}
                  onClick={handleSimulatedPayNow}
                  className="w-full text-xs font-black uppercase tracking-wider py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 gap-2"
                >
                  Confirm GH₵350 Payment
                </Button>
              </>
            ) : (
              <div className="text-center space-y-3 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-700">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h4 className="text-lg font-black text-navy-950 dark:text-white">Payment Successful!</h4>
                <p className="text-xs text-slate-500">
                  GH₵350 debited from {payerPhone} for Premium Dress. Receipt sent via SMS.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="w-full text-xs font-bold"
                >
                  Close Receipt
                </Button>
              </div>
            )}
          </div>
        </Modal>

        {/* Generic Create Link and QR Modals */}
        <CreatePaymentLinkModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => loadData()}
        />

        <QRCodeModal
          isOpen={!!selectedQRLink}
          onClose={() => setSelectedQRLink(null)}
          link={selectedQRLink}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}

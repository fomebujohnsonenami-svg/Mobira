'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ArrowRight,
  RotateCcw,
  Building2,
  User,
  Check,
  Smartphone,
  ShieldAlert,
  Loader2,
  CheckCircle,
  CreditCard,
  MapPin,
  Tag,
  Zap,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export interface RecipientBusinessVerificationDemoProps {
  className?: string;
}

export const RecipientBusinessVerificationDemo: React.FC<RecipientBusinessVerificationDemoProps> = ({
  className = '',
}) => {
  const { toast } = useToast();

  // ==========================================
  // 1. BUSINESS IDENTITY LOOKUP STATE
  // ==========================================
  const [businessQuery, setBusinessQuery] = useState('MOB-8829-GH');
  const [isPaidBusinessOpen, setIsPaidBusinessOpen] = useState(false);
  const [businessPayAmount] = useState('350.00');

  // Hardcoded Primary Verified Demo Business
  const verifiedDemoBusiness = {
    id: 'MOB-8829-GH',
    name: 'ABC Fashion',
    category: 'Fashion & Retail',
    location: 'Accra, Ghana',
    registrationNumber: 'RC/GH/2022/F/3456',
    taxNumber: 'GHA-TIN-2022-01234',
    phone: '+233 24 987 6543',
    trustScore: 94,
    status: 'VERIFIED',
    description: 'Bespoke contemporary African couture, luxury textiles, and ready-to-wear fashion.',
  };

  const isBusinessFound =
    businessQuery.trim().toUpperCase() === verifiedDemoBusiness.id ||
    businessQuery.trim().toUpperCase() === 'ABC FASHION' ||
    businessQuery.trim().replace(/\s+/g, '') === '+233249876543' ||
    businessQuery.trim() === '0249876543';

  // ==========================================
  // 2. RECIPIENT NAME VERIFICATION STATE
  // ==========================================
  const [savedBeneficiary, setSavedBeneficiary] = useState('Kwame Mensah');
  const [accountNumber, setAccountNumber] = useState('0240000000');
  const [recipientChannel, setRecipientChannel] = useState('MTN MoMo');
  const [isVerifyingRecipient, setIsVerifyingRecipient] = useState(false);
  const [recipientVerificationState, setRecipientVerificationState] = useState<
    'IDLE' | 'MATCH' | 'MISMATCH'
  >('MATCH'); // Default to match so judges see immediate value
  const [returnedAccountName, setReturnedAccountName] = useState('Kwame Mensah');
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);

  // Trigger simulated recipient verification
  const handleVerifyRecipient = (customPhone?: string, customExpected?: string) => {
    const phoneToTest = (customPhone ?? accountNumber).trim().replace(/\s+/g, '');
    const expectedToTest = (customExpected ?? savedBeneficiary).trim();

    setIsVerifyingRecipient(true);
    setPaymentAuthorized(false);

    setTimeout(() => {
      setIsVerifyingRecipient(false);

      // Match Case: 0240000000
      if (phoneToTest === '0240000000' && expectedToTest.toLowerCase() === 'kwame mensah') {
        setReturnedAccountName('Kwame Mensah');
        setRecipientVerificationState('MATCH');
        toast({
          type: 'success',
          title: 'Recipient Identity Verified',
          message: 'Carrier name matches saved beneficiary: Kwame Mensah (100% confidence).',
        });
      } else {
        // Mismatch Case: 0249999999 or Jeanne Ngono or anything else
        const returnedName =
          phoneToTest === '0249999999' || expectedToTest.toLowerCase().includes('jeanne')
            ? 'Jeanne Ngono'
            : 'Ama Serwaa Osei';
        setReturnedAccountName(returnedName);
        setRecipientVerificationState('MISMATCH');
        toast({
          type: 'error',
          title: 'Anti-Fraud Name Mismatch Alert',
          message: `Subscriber name is \"${returnedName}\", which does not match \"${expectedToTest}\".`,
        });
      }
    }, 1000);
  };

  // ==========================================
  // 3. QUICK DEMO PRESENTATION CONTROLS
  // ==========================================
  const loadValidMatchDemo = () => {
    setBusinessQuery('MOB-8829-GH');
    setSavedBeneficiary('Kwame Mensah');
    setAccountNumber('0240000000');
    setReturnedAccountName('Kwame Mensah');
    setRecipientVerificationState('MATCH');
    setPaymentAuthorized(false);
    toast({
      type: 'info',
      title: 'Demo State: Valid Match Loaded',
      message: 'Business ID: MOB-8829-GH & Recipient 0240000000 (Kwame Mensah) ready.',
    });
  };

  const triggerMismatchDemo = () => {
    setSavedBeneficiary('Kwame Mensah');
    setAccountNumber('0249999999');
    setReturnedAccountName('Jeanne Ngono');
    setRecipientVerificationState('MISMATCH');
    setPaymentAuthorized(false);
    toast({
      type: 'warning',
      title: 'Demo State: Mismatch Triggered',
      message: 'Account 0249999999 returned \"Jeanne Ngono\" (Mismatch vs Kwame Mensah).',
    });
  };

  const resetDemoState = () => {
    setBusinessQuery('MOB-8829-GH');
    setSavedBeneficiary('Kwame Mensah');
    setAccountNumber('0240000000');
    setReturnedAccountName('Kwame Mensah');
    setRecipientVerificationState('MATCH');
    setPaymentAuthorized(false);
    setIsPaidBusinessOpen(false);
    toast({
      type: 'info',
      title: 'Demo Reset',
      message: 'Inputs reset to original baseline state.',
    });
  };

  return (
    <div
      className={`space-y-6 rounded-3xl bg-[#131B24] p-4 sm:p-6 md:p-8 text-slate-100 border border-slate-800 shadow-2xl ${className}`}
    >
      {/* ========================================================================= */}
      {/* TOP PRESENTATION QUICK-FILL TOOLBAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#18222D] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20 shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 flex-wrap">
              Interactive Verification Suite
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40 uppercase tracking-wider">
                Live Simulator
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              One-click preset toggles for live judge evaluation & fraud prevention demos.
            </p>
          </div>
        </div>

        {/* 3 Quick Demo Buttons (Wrap nicely on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={loadValidMatchDemo}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-[#A3E635] text-[#0F172A] hover:bg-[#84CC16] transition-all active:scale-95 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valid Match</span>
          </button>

          <button
            type="button"
            onClick={triggerMismatchDemo}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/25 transition-all active:scale-95 shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Trigger Mismatch</span>
          </button>

          <button
            type="button"
            onClick={resetDemoState}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#1E293B] text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        {/* ========================================================================= */}
        {/* MODULE 1: PRESET BUSINESS IDENTITY LOOKUP (PAY A VERIFIED BUSINESS)       */}
        {/* ========================================================================= */}
        <div className="space-y-4 rounded-2xl bg-[#18222D] p-4 sm:p-6 border border-slate-800 flex flex-col justify-between min-w-0">
          <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30 font-bold shrink-0">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    1. Preset Business Identity Lookup
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pay a Verified Business with accredited credentials
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-[#38BDF8] border border-blue-800 shrink-0">
                KYB Lookup
              </span>
            </div>

            {/* Input Field: Business ID / Phone / Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between flex-wrap gap-1">
                <span>Business ID / Phone / Account Number</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Demo Key: <code className="text-[#38BDF8] font-bold">MOB-8829-GH</code>
                </span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={businessQuery}
                  onChange={(e) => setBusinessQuery(e.target.value)}
                  placeholder="Enter Business ID / Phone"
                  className="w-full pl-10 pr-24 py-2.5 bg-[#131B24] border border-slate-700 rounded-xl text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/80 focus:border-[#2563EB] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setBusinessQuery('MOB-8829-GH')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#2563EB]/20 hover:bg-[#2563EB]/40 text-[#38BDF8] text-[10px] font-bold transition-colors"
                >
                  Fill Demo
                </button>
              </div>
            </div>

            {/* Business Lookup Result */}
            {isBusinessFound ? (
              /* Verified Business Card with Electric Blue Checkmark Badge */
              <div className="p-4 sm:p-5 rounded-2xl bg-[#131B24] border-2 border-[#2563EB]/40 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Logo */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#2563EB] text-white font-black text-base flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 border border-blue-400/40">
                      AF
                    </div>
                    <div className="min-w-0 truncate">
                      {/* Business Name + Electric Blue Checkmark Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-black text-base text-white tracking-tight">
                          {verifiedDemoBusiness.name}
                        </h5>
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black text-white shadow-md shadow-blue-500/30"
                          style={{ backgroundColor: '#2563EB' }}
                        >
                          <Check className="w-3 h-3 stroke-[3.5]" />
                          <span>Verified Business</span>
                        </span>
                      </div>

                      {/* Category & Location */}
                      <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#38BDF8]" />
                          {verifiedDemoBusiness.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#A3E635]" />
                          {verifiedDemoBusiness.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Trust Score
                    </span>
                    <span className="text-sm font-black text-[#A3E635] font-mono">
                      {verifiedDemoBusiness.trustScore}/100
                    </span>
                  </div>
                </div>

                {/* Description & Entity IDs */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {verifiedDemoBusiness.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-[#18222D] border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Business ID</span>
                    <span className="text-white font-bold truncate block">{verifiedDemoBusiness.id}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#18222D] border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Registrar No.</span>
                    <span className="text-white font-bold truncate block">
                      {verifiedDemoBusiness.registrationNumber}
                    </span>
                  </div>
                </div>

                {/* Pay Now Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaidBusinessOpen(true);
                      toast({
                        type: 'success',
                        title: 'Proceeding to Direct Payment',
                        message: `Initiating verified disbursement to ${verifiedDemoBusiness.name} (${verifiedDemoBusiness.id}).`,
                      });
                    }}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:brightness-110 active:scale-98"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    <CreditCard className="w-4 h-4" />
                    PAY NOW
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Inline message if any other Business ID is entered */
              <div className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                  <span>Business ID not found or unverified.</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The identifier &quot;{businessQuery}&quot; has not completed Mobira KYB accreditation or does not exist in the registry.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setBusinessQuery('MOB-8829-GH')}
                    className="text-xs font-bold text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                  >
                    Restore demo business (MOB-8829-GH) →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODULE 2: RECIPIENT NAME VERIFICATION (PAYMENT RECIPIENT CHECK)           */}
        {/* ========================================================================= */}
        <div className="space-y-4 rounded-2xl bg-[#18222D] p-4 sm:p-6 border border-slate-800 flex flex-col justify-between min-w-0">
          <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center border border-[#A3E635]/30 font-bold shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    2. Recipient Name Verification Simulation
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Payment Recipient Check against telecom subscriber switch
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-lime-950 text-[#A3E635] border border-lime-800 shrink-0">
                Pre-Flight
              </span>
            </div>

            {/* Recipient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Saved Beneficiary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Saved Beneficiary</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={savedBeneficiary}
                    onChange={(e) => setSavedBeneficiary(e.target.value)}
                    placeholder="Kwame Mensah"
                    className="w-full pl-9 pr-3 py-2 bg-[#131B24] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A3E635]/70 focus:border-[#A3E635]"
                  />
                </div>
              </div>

              {/* Account / Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Account / Phone Number</span>
                  <span className="text-[10px] text-slate-400 font-mono">0240000000</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      setPaymentAuthorized(false);
                    }}
                    placeholder="0240000000"
                    className="w-full pl-9 pr-3 py-2 bg-[#131B24] border border-slate-700 rounded-xl text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A3E635]/70 focus:border-[#A3E635]"
                  />
                </div>
              </div>
            </div>

            {/* Channel Select & Action Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="w-full sm:w-1/2">
                <select
                  value={recipientChannel}
                  onChange={(e) => setRecipientChannel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#131B24] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A3E635]/70 font-semibold"
                >
                  <option value="MTN MoMo">MTN MoMo (Ghana)</option>
                  <option value="Vodafone Cash">Vodafone Cash (Telecel)</option>
                  <option value="Bank EFT">GCB Bank Transfer</option>
                </select>
              </div>

              <button
                type="button"
                disabled={isVerifyingRecipient}
                onClick={() => handleVerifyRecipient()}
                className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isVerifyingRecipient ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying with provider...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify with Provider</span>
                  </>
                )}
              </button>
            </div>

            {/* Verification Result Card */}
            {isVerifyingRecipient ? (
              <div className="p-4 rounded-2xl bg-[#131B24] border border-slate-700 flex items-center justify-center gap-3 py-6 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin text-[#A3E635]" />
                <span className="text-xs font-bold text-slate-300">
                  Verifying with provider...
                </span>
              </div>
            ) : recipientVerificationState === 'MATCH' ? (
              /* MATCH CASE: 🟢 MATCH VERIFIED */
              <div className="p-4 rounded-2xl bg-[#A3E635]/10 border-2 border-[#A3E635]/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  {/* Status Badge: 🟢 MATCH VERIFIED */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-[#0F172A] bg-[#A3E635] shadow-md shadow-[#A3E635]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    <span>🟢 MATCH VERIFIED</span>
                  </span>

                  <span className="text-[10px] font-mono text-[#A3E635] font-extrabold uppercase">
                    100% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#131B24] border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Saved Beneficiary
                    </span>
                    <span className="text-white font-extrabold truncate block">{savedBeneficiary}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#131B24] border border-[#A3E635]/40">
                    <span className="text-[#A3E635] block text-[10px] uppercase font-bold">
                      Returned Account Name
                    </span>
                    <span className="text-white font-extrabold truncate block">{returnedAccountName}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#A3E635]" />
                  Telecom registry subscriber matched registered KYC profile: {returnedAccountName}.
                </p>

                {/* Primary Action: ENABLED Authorize Payment Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentAuthorized(true);
                      toast({
                        type: 'success',
                        title: 'Payment Authorized',
                        message: `Disbursement of GH₵500.00 released to ${returnedAccountName}.`,
                      });
                    }}
                    className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/25 transition-all active:scale-98"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {paymentAuthorized ? 'PAYMENT AUTHORIZED ✓' : 'Authorize Payment (GH₵500.00)'}
                  </button>
                </div>
              </div>
            ) : (
              /* MISMATCH CASE: 🔴 NAME MISMATCH (#EF4444) */
              <div className="p-4 rounded-2xl bg-[#EF4444]/15 border-2 border-[#EF4444]/50 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  {/* Status Banner: 🔴 NAME MISMATCH (#EF4444) */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-white shadow-md shadow-red-500/30"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
                    <span>🔴 NAME MISMATCH</span>
                  </span>

                  <span className="text-[10px] font-mono text-[#EF4444] font-extrabold uppercase">
                    Risk Alert
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#131B24] border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Saved Beneficiary
                    </span>
                    <span className="text-slate-200 font-extrabold truncate block">{savedBeneficiary}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#131B24] border border-[#EF4444]/50">
                    <span className="text-[#EF4444] block text-[10px] uppercase font-bold">
                      Returned Account Name
                    </span>
                    <span className="text-white font-extrabold truncate block">{returnedAccountName}</span>
                  </div>
                </div>

                {/* Alert Text */}
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/80 text-[11px] text-red-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Recipient details don&apos;t match the saved beneficiary ({savedBeneficiary}). Please review before authorizing.
                  </p>
                </div>

                {/* Actions: Disabled Primary Button + Highlighted Red Cancel / Review Details */}
                <div className="pt-1 space-y-2">
                  <button
                    type="button"
                    disabled={true}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 bg-slate-800/60 border border-slate-700 cursor-not-allowed opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Authorize Payment (Disabled)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountNumber('0240000000');
                      setReturnedAccountName('Kwame Mensah');
                      setRecipientVerificationState('MATCH');
                      toast({
                        type: 'info',
                        title: 'Cancelled Mismatched Payout',
                        message: 'Restored recipient details to verified Kwame Mensah (0240000000).',
                      });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white border-2 border-[#EF4444] hover:bg-[#EF4444]/20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-98"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Cancel / Review Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE PAYMENT CONFIRMATION MODAL FOR ABC FASHION                    */}
      {/* ========================================================================= */}
      {isPaidBusinessOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#18222D] border-2 border-[#2563EB]/50 p-6 text-white space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
                  AF
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Direct Business Payment</h4>
                  <p className="text-[10px] text-slate-400">Accredited Merchant Checkout</p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                style={{ backgroundColor: '#2563EB' }}
              >
                Verified Business
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-bold text-white">ABC Fashion (Accra, Ghana)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Business ID:</span>
                <span className="font-mono font-bold text-[#38BDF8]">MOB-8829-GH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Rail:</span>
                <span className="font-bold text-slate-200">MTN MoMo Business Rail</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-bold">Amount to Disburse:</span>
                <span className="font-black text-base text-[#A3E635] font-mono">
                  GH₵{businessPayAmount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaidBusinessOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold transition-all text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPaidBusinessOpen(false);
                  toast({
                    type: 'success',
                    title: 'Payment Dispatched Successfully',
                    message: `GH₵${businessPayAmount} settled instantly to ABC Fashion (MOB-8829-GH).`,
                  });
                }}
                className="w-1/2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-blue-500/30 transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#2563EB' }}
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

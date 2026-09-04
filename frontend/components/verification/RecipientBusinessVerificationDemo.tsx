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
  Sparkles,
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
  const [businessNameInput, setBusinessNameInput] = useState('ABC Fashion');
  const [businessQuery, setBusinessQuery] = useState('700235');
  const [isSearchingBusiness, setIsSearchingBusiness] = useState(false);
  const [isPaidBusinessOpen, setIsPaidBusinessOpen] = useState(false);
  const [businessPayAmount] = useState('350.00');

  // Hardcoded Primary Verified Demo Business
  const verifiedDemoBusiness = {
    id: '700235',
    businessCode: 'MOB-8829-GH',
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
    businessQuery.trim() === '700235' ||
    businessQuery.trim().toUpperCase() === 'MOB-8829-GH' ||
    businessQuery.trim().toUpperCase() === 'PP-ABC-001' ||
    businessQuery.trim().toUpperCase() === 'ABC FASHION';

  const handleSearchBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingBusiness(true);
    setTimeout(() => {
      setIsSearchingBusiness(false);
      if (isBusinessFound) {
        toast({
          type: 'success',
          title: 'Verified Business Found',
          message: 'ABC Fashion (BIN: 700235) verified with Electric Blue checkmark.',
        });
      } else {
        toast({
          type: 'error',
          title: 'Business Lookup Failed',
          message: 'Business not found. Try entering Business Identification Number: 700235',
        });
      }
    }, 600);
  };

  // ==========================================
  // 2. RECIPIENT NAME VERIFICATION STATE
  // ==========================================
  const [savedBeneficiary, setSavedBeneficiary] = useState('Kwame Mensah');
  const [accountNumber, setAccountNumber] = useState('0240000000');
  const [recipientChannel, setRecipientChannel] = useState('MTN MoMo');
  const [isVerifyingRecipient, setIsVerifyingRecipient] = useState(false);
  const [recipientVerificationState, setRecipientVerificationState] = useState<
    'IDLE' | 'MATCH' | 'MISMATCH'
  >('MATCH');
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
        const returnedName =
          phoneToTest === '0249999999' || expectedToTest.toLowerCase().includes('jeanne')
            ? 'Jeanne Ngono'
            : 'Ama Serwaa Osei';
        setReturnedAccountName(returnedName);
        setRecipientVerificationState('MISMATCH');
        toast({
          type: 'error',
          title: 'Anti-Fraud Name Mismatch Alert',
          message: `Subscriber name is "${returnedName}", which does not match "${expectedToTest}".`,
        });
      }
    }, 800);
  };

  // ==========================================
  // 3. QUICK DEMO PRESENTATION CONTROLS
  // ==========================================
  const loadValidMatchDemo = () => {
    setBusinessNameInput('ABC Fashion');
    setBusinessQuery('700235');
    setSavedBeneficiary('Kwame Mensah');
    setAccountNumber('0240000000');
    setReturnedAccountName('Kwame Mensah');
    setRecipientVerificationState('MATCH');
    setPaymentAuthorized(false);
    toast({
      type: 'info',
      title: 'Loaded Demo: Exact Identity Match',
      message: 'Business ID: 700235 and Recipient: Kwame Mensah loaded.',
    });
  };

  const loadMismatchDemo = () => {
    setBusinessNameInput('ABC Fashion');
    setBusinessQuery('700235');
    setSavedBeneficiary('Kwame Mensah');
    setAccountNumber('0249999999');
    setReturnedAccountName('Jeanne Ngono');
    setRecipientVerificationState('MISMATCH');
    setPaymentAuthorized(false);
    toast({
      type: 'error',
      title: 'Loaded Demo: Anti-Fraud Name Mismatch',
      message: 'Recipient number 0249999999 will return mismatched identity.',
    });
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Demo Quick Selector Bar */}
      <div className="p-4 bg-[#18222D] border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Interactive Verification Demo Scenarios
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={loadValidMatchDemo}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40 hover:bg-[#A3E635]/25 transition-all text-center"
          >
            Scenario 1: Verified Business (700235)
          </button>
          <button
            type="button"
            onClick={loadMismatchDemo}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/40 hover:bg-red-500/25 transition-all text-center"
          >
            Scenario 2: Fraud Mismatch Check
          </button>
        </div>
      </div>

      {/* Grid: 2 Interactive Demonstration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* =================================================================== */}
        {/* SECTION 1: PRESET BUSINESS IDENTITY LOOKUP                          */}
        {/* =================================================================== */}
        <div className="p-6 bg-[#18222D] border border-slate-800 rounded-2xl shadow-subtle space-y-5 text-white">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  1. Business Identity Verification
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Lookup registered enterprise by Business Identification Number
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/40">
              KYB DIRECT
            </span>
          </div>

          {/* Business Input Form */}
          <form onSubmit={handleSearchBusiness} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={businessNameInput}
                onChange={(e) => setBusinessNameInput(e.target.value)}
                placeholder="ABC Fashion"
                className="w-full bg-[#131B24] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  Business Identification Number (BIN)
                </label>
                <button
                  type="button"
                  onClick={() => setBusinessQuery('700235')}
                  className="text-[10px] font-bold text-[#A3E635] hover:underline"
                >
                  Fill BIN 700235
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={businessQuery}
                  onChange={(e) => setBusinessQuery(e.target.value)}
                  placeholder="700235"
                  className="w-full bg-[#131B24] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono tracking-wider focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearchingBusiness}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              {isSearchingBusiness ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying in Registry...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lookup & Verify Business</span>
                </>
              )}
            </button>
          </form>

          {/* Business Lookup Result View */}
          {isBusinessFound ? (
            <div className="p-4 bg-[#131B24] border-2 border-[#2563EB]/50 rounded-xl space-y-4 animate-in fade-in-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563EB] to-blue-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                    AF
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {verifiedDemoBusiness.name}
                      </h4>
                      {/* Blue Verified Checkmark Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-black tracking-wider shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>VERIFIED</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      BIN: {verifiedDemoBusiness.id} • {verifiedDemoBusiness.businessCode}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Trust Score</span>
                  <span className="text-sm font-black text-[#A3E635] font-mono">
                    {verifiedDemoBusiness.trustScore}/100
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {verifiedDemoBusiness.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sector</span>
                  <span className="font-semibold text-slate-200">{verifiedDemoBusiness.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-200">{verifiedDemoBusiness.location}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPaidBusinessOpen(true)}
                className="w-full py-2.5 rounded-xl font-black text-xs bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-md shadow-[#A3E635]/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>PAY VERIFIED BUSINESS (GH₵{businessPayAmount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl text-center space-y-2">
              <p className="text-xs font-bold text-red-300">
                Business Not Found
              </p>
              <p className="text-[11px] text-slate-400">
                Please enter the registered demo Business Identification Number: <button type="button" onClick={() => setBusinessQuery('700235')} className="text-[#A3E635] font-mono font-bold underline">700235</button>
              </p>
            </div>
          )}

          {/* Payment Modal */}
          {isPaidBusinessOpen && (
            <div className="p-4 bg-[#131B24] border border-[#A3E635]/40 rounded-xl space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white">Payment Authorized to ABC Fashion</span>
                <span className="text-[#A3E635]">GH₵350.00</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Disbursement routed to Verified MoMo Merchant: +233 24 987 6543 (Carrier Verified).
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsPaidBusinessOpen(false);
                  toast({
                    type: 'success',
                    title: 'Payment Disbursed',
                    message: 'GH₵350.00 sent to ABC Fashion with 0% wrong-number risk.',
                  });
                }}
                className="w-full py-2 rounded-lg text-xs font-bold bg-[#A3E635] text-[#0F172A]"
              >
                Confirm & Complete Payment
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* SECTION 2: LIVE PRE-FLIGHT RECIPIENT IDENTITY CHECK                */}
        {/* =================================================================== */}
        <div className="p-6 bg-[#18222D] border border-slate-800 rounded-2xl shadow-subtle space-y-5 text-white">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  2. Pre-Flight Recipient Name Enquiry
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Real-time subscriber name validation before money moves
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40">
              ANTI-FRAUD
            </span>
          </div>

          {/* Form */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Expected Beneficiary Name
              </label>
              <input
                type="text"
                value={savedBeneficiary}
                onChange={(e) => setSavedBeneficiary(e.target.value)}
                placeholder="Kwame Mensah"
                className="w-full bg-[#131B24] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#A3E635]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Mobile Money / Account Identifier
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="0240000000"
                className="w-full bg-[#131B24] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#A3E635]"
              />
            </div>

            <button
              type="button"
              onClick={() => handleVerifyRecipient()}
              disabled={isVerifyingRecipient}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] flex items-center justify-center gap-2 transition-all shadow-md shadow-[#A3E635]/20"
            >
              {isVerifyingRecipient ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enquiring Carrier Telco Node...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Pre-Flight Name Check</span>
                </>
              )}
            </button>
          </div>

          {/* Verification Status Feedback Card */}
          {recipientVerificationState === 'MATCH' ? (
            <div className="p-4 bg-[#131B24] border-2 border-[#A3E635]/50 rounded-xl space-y-3 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#A3E635]">
                  <CheckCircle2 className="w-4 h-4" /> EXACT IDENTITY MATCH (100%)
                </span>
                <span className="text-[10px] font-mono text-slate-400">MTN MoMo Ghana</span>
              </div>
              <div className="p-2.5 bg-[#18222D] rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Saved Beneficiary:</span>
                  <span className="font-bold text-white">{savedBeneficiary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Carrier Registered Name:</span>
                  <span className="font-bold text-[#A3E635]">{returnedAccountName}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300">
                Account confirmed active and KYC compliant. Safe to proceed with payout.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-950/40 border-2 border-red-500/60 rounded-xl space-y-3 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-red-400">
                  <AlertTriangle className="w-4 h-4" /> FRAUD WARNING: NAME MISMATCH
                </span>
                <span className="text-[10px] font-mono text-slate-400">Security Triggered</span>
              </div>
              <div className="p-2.5 bg-[#18222D] rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected:</span>
                  <span className="font-bold text-white">{savedBeneficiary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Actual Registered Name:</span>
                  <span className="font-bold text-red-400">{returnedAccountName}</span>
                </div>
              </div>
              <p className="text-[11px] text-red-200">
                Payment blocked to protect funds. Contact recipient to verify mobile number.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

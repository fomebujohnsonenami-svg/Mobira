'use client';

import React, { useState } from 'react';
import { ShieldCheck, Building2, Lock, CheckCircle2, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export interface BusinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  onSuccess: () => void;
}

export const BusinessVerificationModal: React.FC<BusinessVerificationModalProps> = ({
  isOpen,
  onClose,
  businessName,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [bizName, setBizName] = useState(businessName || 'ABC Technologies Ltd');
  const [bin, setBin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedBin = bin.trim();
    if (!trimmedBin) {
      setError('Please enter your Business Identification Number.');
      return;
    }

    // Exact required valid BIN: 700235 (also accept demo code MOB-8829-GH / PP-ABC-001)
    if (
      trimmedBin !== '700235' &&
      trimmedBin.toUpperCase() !== 'MOB-8829-GH' &&
      trimmedBin.toUpperCase() !== 'PP-ABC-001'
    ) {
      setError('Invalid Business Identification Number. Please enter a valid registered BIN (Demo BIN: 700235).');
      toast({
        type: 'error',
        title: 'Verification Failed',
        message: 'Business Identification Number not found in Registrar registry.',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        type: 'success',
        title: 'Identity Verified & Accredited',
        message: `Business ${bizName} has been officially verified with BIN: ${trimmedBin}`,
      });
      onSuccess();
    }, 1200);
  };

  const handleQuickFill = () => {
    setBin('700235');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/85 backdrop-blur-md animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-[#18222D] border-2 border-[#2563EB]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-left space-y-6 relative overflow-hidden animate-in zoom-in-95 text-white"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-black tracking-wide">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>OFFICIAL BUSINESS VERIFICATION (KYB)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Verify Business Identity
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Provide your registered legal business name and Business Identification Number to undergo real-time registrar validation and unlock the Blue Verified Business badge.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Registered Business Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="ABC Technologies Ltd"
                disabled={isLoading}
                className="w-full bg-[#131B24] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Business Identification Number (BIN / TIN)
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-[#A3E635] hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-Fill Demo BIN (700235)
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={bin}
                onChange={(e) => {
                  setBin(e.target.value);
                  setError('');
                }}
                placeholder="700235"
                disabled={isLoading}
                className="w-full bg-[#131B24] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono tracking-wider focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter identification number <span className="font-mono text-[#A3E635] font-bold">700235</span> to validate against Ghana Registrar General & Revenue Authority.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full sm:flex-1 py-3 text-xs sm:text-sm font-black bg-[#2563EB] hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 gap-2 justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking Registrar...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Business Identity</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 text-xs font-bold border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Footnote */}
        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Mobira verifies corporate registration, beneficial ownership, and telecom KYC identity.</span>
        </div>
      </div>
    </div>
  );
};

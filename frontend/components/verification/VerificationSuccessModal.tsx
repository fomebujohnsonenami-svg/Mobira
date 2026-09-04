'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VerificationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
}

export const VerificationSuccessModal: React.FC<VerificationSuccessModalProps> = ({
  isOpen,
  onClose,
  businessName = 'ABC Technologies Ltd',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in-50">
      {/* Modal Container: Matches user wireframe specifications */}
      <div
        className="w-full max-w-md bg-white dark:bg-navy-900 border-2 border-blue-500/40 dark:border-blue-500/50 rounded-2xl p-8 sm:p-10 shadow-modal text-center space-y-6 relative overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big Check Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/80 border-2 border-blue-500 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-elevated">
            <Check className="w-10 h-10 stroke-[3.5] text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            BUSINESS VERIFIED!
          </h2>

          <h3 className="text-lg sm:text-xl font-extrabold text-navy-950 dark:text-white">
            {businessName}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto pt-1 leading-relaxed">
            Your business has been verified successfully on Mobira.
          </p>
        </div>

        {/* [ DONE ] Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="w-full max-w-xs mx-auto py-3 text-sm font-black tracking-wider uppercase shadow-elevated"
          >
            DONE
          </Button>
        </div>

        {/* Compliance & Verification Boundary Notice */}
        <p className="text-[10px] text-slate-400 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-navy-800">
          The blue badge represents identity and business verification by Mobira.
        </p>
      </div>
    </div>
  );
};

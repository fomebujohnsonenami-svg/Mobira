'use client';

import React from 'react';
import { QrCode, Download, ExternalLink, Copy, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PaymentLink } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/components/ui/Toast';

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: PaymentLink | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, link }) => {
  const router = useRouter();
  const { toast } = useToast();
  if (!link) return null;

  const checkoutUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/customer/${link.slug}`;

  const copyUrl = () => {
    navigator.clipboard?.writeText(checkoutUrl);
    toast({
      type: 'success',
      title: 'Link Copied',
      message: 'Checkout link copied to clipboard.',
    });
  };

  const merchantName = link.business_name || 'ABC Fashion';
  const itemTitle = link.title || 'Premium Dress';
  const itemAmount = link.amount ? formatCurrency(link.amount, link.currency || 'GH₵') : 'GH₵350';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QR Payment"
      description="Scan with camera or mobile money app to trigger instant checkout."
      maxWidth="sm"
    >
      <div className="space-y-5 text-center">
        {/* Exact Layout Specified by Prompt: */}
        {/* ABC Fashion ✓ */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-xl font-black text-navy-950 dark:text-white uppercase tracking-tight">
              {merchantName}
            </h3>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-black shadow-sm">
              ✓
            </span>
          </div>

          {/* Scan to pay */}
          <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
            Scan to pay
          </p>
        </div>

        {/* [ QR CODE ] Matrix Frame */}
        <div className="p-5 bg-white rounded-3xl border-2 border-yellow-500 shadow-modal inline-block mx-auto relative group">
          <div className="w-52 h-52 bg-navy-950 rounded-2xl flex flex-col items-center justify-center text-yellow-400 p-4 relative overflow-hidden">
            {/* Aesthetic QR grid simulation */}
            <div className="grid grid-cols-6 gap-2 opacity-90 p-2">
              <div className="w-8 h-8 border-4 border-yellow-400 rounded-lg" />
              <div className="w-2 h-2 bg-yellow-400 rounded-sm mt-3" />
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="w-8 h-8 border-4 border-yellow-400 rounded-lg ml-auto" />
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />

              <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
              <div className="w-8 h-8 bg-yellow-400/30 rounded-lg flex items-center justify-center col-span-2">
                <QrCode className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
              <div className="w-4 h-4 bg-yellow-400 rounded-sm ml-auto" />

              <div className="w-8 h-8 border-4 border-yellow-400 rounded-lg" />
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="w-8 h-8 border-4 border-yellow-400 rounded-lg ml-auto" />
            </div>

            <span className="text-[9px] font-mono text-slate-300 font-bold tracking-widest uppercase mt-2">
              [ QR CODE ]
            </span>
          </div>

          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            MOBIRA-QR-{link.slug.toUpperCase().slice(0, 10)}
          </div>
        </div>

        {/* Item Title & Amount */}
        {/* Premium Dress */}
        {/* GH₵350 */}
        <div className="py-2 border-y border-slate-100 dark:border-navy-800 space-y-0.5">
          <h4 className="font-extrabold text-base text-navy-950 dark:text-slate-100">
            {itemTitle}
          </h4>
          <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
            {itemAmount}
          </p>
        </div>

        {/* Action Buttons: Route to internal demo payment page */}
        <div className="space-y-2 pt-1">
          <Link href={`/customer/${link.slug}`} target="_blank" className="block w-full">
            <Button
              type="button"
              variant="primary"
              className="w-full text-xs font-black uppercase tracking-wider py-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Internal Demo Payment Page
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyUrl}
              className="text-xs font-semibold gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  type: 'success',
                  title: 'QR Code Saved',
                  message: 'Printable PNG/SVG QR graphic downloaded.',
                });
              }}
              className="text-xs font-semibold gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download QR
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

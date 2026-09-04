'use client';

import React from 'react';
import Link from 'next/link';
import { Send, QrCode, ShieldCheck, Plus, ListTodo } from 'lucide-react';

export interface QuickActionsProps {
  onOpenSendModal?: () => void;
  onOpenReceiveModal?: () => void;
  onOpenVerifyModal?: () => void;
  onOpenCreateListModal?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenSendModal,
  onOpenReceiveModal,
  onOpenVerifyModal,
  onOpenCreateListModal,
}) => {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
      {/* 1. PAY */}
      <button
        type="button"
        onClick={onOpenSendModal}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-md shadow-[#A3E635]/20 transition-all active:scale-95"
      >
        <Send className="w-3.5 h-3.5 text-[#0F172A] fill-current" />
        <span>Pay</span>
      </button>

      {/* 2. RECEIVE */}
      <button
        type="button"
        onClick={onOpenReceiveModal}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1E293B] border border-slate-700 text-white hover:border-[#A3E635]/60 hover:bg-[#283548] transition-all active:scale-95 shadow-sm"
      >
        <QrCode className="w-3.5 h-3.5 text-[#A3E635]" />
        <span>Receive</span>
      </button>

      {/* 3. VERIFY */}
      <button
        type="button"
        onClick={onOpenVerifyModal}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1E293B] border border-slate-700 text-white hover:border-[#2563EB]/60 hover:bg-[#283548] transition-all active:scale-95 shadow-sm"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>Verify</span>
      </button>

      {/* 4. PAYMENT LIST */}
      {onOpenCreateListModal ? (
        <button
          type="button"
          onClick={onOpenCreateListModal}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1E293B] border border-slate-700 text-white hover:border-[#A3E635]/60 hover:bg-[#283548] transition-all active:scale-95 shadow-sm"
        >
          <ListTodo className="w-3.5 h-3.5 text-amber-400" />
          <span>Batch List</span>
        </button>
      ) : (
        <Link
          href="/payment-lists"
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1E293B] border border-slate-700 text-white hover:border-[#A3E635]/60 hover:bg-[#283548] transition-all active:scale-95 shadow-sm"
        >
          <ListTodo className="w-3.5 h-3.5 text-amber-400" />
          <span>Batch List</span>
        </Link>
      )}
    </div>
  );
};

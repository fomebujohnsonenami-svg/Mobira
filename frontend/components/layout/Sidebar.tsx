'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  Send,
  ListTodo,
  QrCode,
  Building2,
  Receipt,
  FileSpreadsheet,
  BarChart3,
  Settings,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Zap,
  Bell,
  Lock,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBusiness } from './BusinessContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/verify', label: 'Verify Business', icon: ShieldCheck },
  { href: '/payments', label: 'Pay', icon: Send },
  { href: '/payment-lists', label: 'Payment Lists', icon: ListTodo },
  { href: '/receive', label: 'Receive', icon: QrCode },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/statements', label: 'Statements', icon: FileSpreadsheet },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/audit', label: 'Audit Logs', icon: Lock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobile = false }) => {
  const pathname = usePathname();
  const { currentBusiness, resetDemo } = useBusiness();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleConfirmReset = () => {
    resetDemo();
    setIsResetConfirmOpen(false);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        'bg-[#131B24] flex flex-col justify-between text-slate-300 select-none border-r border-slate-800',
        isMobile
          ? 'w-full h-full z-50 overflow-y-auto p-2'
          : 'w-64 shrink-0 min-h-screen hidden lg:flex'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" onClick={handleNavClick} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black text-lg tracking-tight shadow-lg shadow-[#A3E635]/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">MOBIRA</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40 tracking-wider">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-[#A3E635] font-bold tracking-wider uppercase">
                TRUST & PAYMENTS
              </p>
            </div>
          </Link>

          {isMobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-[#A3E635] text-[#0F172A] shadow-md shadow-[#A3E635]/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-[#18222D] group'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-[#0F172A]' : 'text-slate-400 group-hover:text-[#A3E635]'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Business Entity Status */}
      <div className="p-3 border-t border-slate-800 space-y-2.5 bg-[#0F172A]/90">
        <Link
          href="/connected-accounts"
          onClick={handleNavClick}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#18222D] border border-slate-800 hover:border-[#A3E635]/50 text-xs text-slate-300 hover:text-white transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#A3E635] group-hover:scale-110 transition-transform" />
            <span className="font-bold">Connected Rails</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0F172A] text-[#A3E635] font-mono font-bold">
            Active
          </span>
        </Link>

        {/* Business KYC Card */}
        <div className="p-3 rounded-xl bg-[#18222D] border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="font-black text-white text-xs truncate max-w-[130px]">
              {currentBusiness.name}
            </span>
            <span className="text-[10px] font-mono text-[#A3E635] font-bold shrink-0">
              96/100
            </span>
          </div>

          <div className="pt-0.5 flex items-center justify-between text-[10px]">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
              Verified Business
            </span>

            <Link
              href={`/business/${currentBusiness.business_id}`}
              onClick={handleNavClick}
              className="text-[#38BDF8] hover:underline font-bold"
            >
              Profile →
            </Link>
          </div>
        </div>

        {/* Reset Demo Button */}
        <button
          type="button"
          onClick={() => setIsResetConfirmOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#18222D] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-subtle group"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#A3E635] group-hover:-rotate-90 transition-transform duration-200" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data"
        description="Revert all local modifications and test lists back to baseline state."
        confirmLabel="Reset"
        variant="warning"
      />
    </aside>
  );
};

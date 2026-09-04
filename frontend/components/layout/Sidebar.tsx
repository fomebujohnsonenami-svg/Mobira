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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBusiness } from './BusinessContext';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
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
  const { currentBusiness, resetDemo, isDemoMode } = useBusiness();
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
        'bg-navy-950 flex flex-col justify-between text-slate-300 select-none',
        isMobile
          ? 'w-72 h-full z-50 overflow-y-auto'
          : 'w-64 border-r border-navy-850 shrink-0 min-h-screen hidden lg:flex'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-navy-850 flex items-center justify-between">
          <Link href="/dashboard" onClick={handleNavClick} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-yellow-500 text-navy-950 flex items-center justify-center font-black text-lg tracking-tight shadow-subtle group-hover:bg-yellow-400 transition-colors">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">MOBIRA</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 tracking-wider">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                TRUST & PAYMENTS
              </p>
            </div>
          </Link>

          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
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
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-yellow-500 text-navy-950 shadow-subtle font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-900'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-navy-950' : 'text-slate-400 group-hover:text-yellow-400'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Business Profile, Demo Mode Indicator, Reset Demo */}
      <div className="p-3 border-t border-navy-850 space-y-2.5 bg-navy-950/90">
        {/* Connected Accounts Quick Link */}
        <Link
          href="/connected-accounts"
          onClick={handleNavClick}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-navy-900/90 border border-navy-800 hover:border-yellow-500/50 text-xs text-slate-300 hover:text-white transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Connected Accounts</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-950 text-yellow-400 font-mono font-bold">
            Simulated
          </span>
        </Link>

        {/* 1. Business Profile Card */}
        <div className="p-3 rounded-xl bg-navy-900/90 border border-navy-800 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <BusinessVerificationBadge showLabel={false} size="sm" />
            <span className="text-[10px] font-mono text-yellow-400 font-bold shrink-0">
              {currentBusiness.trust_score}/100
            </span>
          </div>

          <div className="pt-0.5">
            <BusinessVerificationBadge showName={false} showLabel={true} size="sm" />
          </div>

          <p className="text-[10px] text-slate-400 truncate">
            {currentBusiness.registration_number || 'RC/GH/2021/B/8921'}
          </p>

          <div className="flex items-center justify-between pt-1.5 border-t border-navy-800/80 text-[10px]">
            <span className="text-slate-400 truncate">
              {currentBusiness.category || currentBusiness.sector || 'Technology & Software'}
            </span>
            <Link
              href={`/business/${currentBusiness.business_id || 'PP-ABC-001'}`}
              onClick={handleNavClick}
              className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1 shrink-0"
              title="View Public Verified Profile"
            >
              <span>Public Profile</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>

        {/* 2. Demo Mode Indicator */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
            <span className="font-bold text-yellow-400 text-[10px] uppercase tracking-wider">
              {isDemoMode ? 'Demo Mode' : 'Live Mode'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Simulated Rails</span>
        </div>

        {/* 3. Reset Demo Button with Confirmation Dialog */}
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 active:bg-navy-950 text-slate-300 hover:text-white border border-navy-800 hover:border-slate-700 text-xs font-semibold transition-all shadow-subtle group"
          title="Reset all demo state to original baseline"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-yellow-400 group-hover:-rotate-90 transition-transform duration-200" />
          <span>Reset Demo</span>
        </button>

        {/* Reset Demo Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={handleConfirmReset}
          title="Reset Demo Data"
          description="Are you sure you want to reset demo data? All local modifications and temporary test transactions will revert to the baseline seed dataset."
          confirmLabel="Reset to Baseline"
          variant="warning"
        />
      </div>
    </aside>
  );
};

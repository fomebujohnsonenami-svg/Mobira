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
        'bg-white dark:bg-[#131B24] flex flex-col justify-between text-slate-700 dark:text-slate-300 select-none border-r border-slate-200 dark:border-slate-800 transition-colors duration-200',
        isMobile
          ? 'w-full h-full z-50 overflow-y-auto p-2'
          : 'w-64 shrink-0 min-h-screen hidden lg:flex'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" onClick={handleNavClick} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black text-lg tracking-tight shadow-lg shadow-[#A3E635]/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">MOBIRA</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#A3E635]/15 text-[#84CC16] dark:text-[#A3E635] border border-[#A3E635]/40 tracking-wider">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-[#65A30D] dark:text-[#A3E635] font-bold tracking-wider uppercase">
                TRUST & PAYMENTS
              </p>
            </div>
          </Link>

          {isMobile && onClose && (
            <button
              onClick={onClose}
              type="button"
              aria-label="Close navigation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-[#A3E635] text-[#0F172A] font-black shadow-md shadow-[#A3E635]/20 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#0F172A]' : 'text-slate-400 dark:text-slate-400')} />
                <span className="truncate">{item.label}</span>
                {item.href === '/verify' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Reset Demo CTA */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          type="button"
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-left transition-all text-xs"
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">Reset Demo Data</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">GH₵</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data"
        description="Are you sure you want to reset demo data? All temporary test transactions, created payment lists, and local modifications will revert to the baseline seed dataset."
        confirmLabel="Reset Demo"
        variant="warning"
      />
    </aside>
  );
};

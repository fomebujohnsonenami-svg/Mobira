'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useBusiness } from './BusinessContext';
import { useAuth } from '@/components/auth/AuthContext';
import { RotateCcw, Lock, ArrowRight } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';

export const DashboardLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resetDemo } = useBusiness();
  const { user, isAuthenticated, isLoading, demoLogin } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleConfirmReset = () => {
    resetDemo();
    setIsResetConfirmOpen(false);
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#18222D] border-2 border-[#A3E635]/40 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] flex items-center justify-center mx-auto shadow-lg shadow-[#A3E635]/20">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Enterprise Feature Locked</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Please authenticate with your enterprise account to access this tool.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131B24] border border-slate-800 text-left space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Enterprise Credentials:
            </span>
            <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
              <span>Email:</span>
              <strong className="text-white">mobira@gmail.com</strong>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
              <span>Password:</span>
              <strong className="text-[#A3E635]">mobira123</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Go to Sign In
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={async () => {
                await demoLogin('mobira@gmail.com');
              }}
            >
              <span>Instant Unlock</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Mobile / Tablet Slide-over Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-navy-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Body */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#131B24] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Persistent DEMO MODE Announcement Banner */}
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/30 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 select-none shrink-0 transition-colors">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-500 text-sm">🟡</span>
            <strong className="font-black tracking-wide uppercase">DEMO MODE</strong>
            <span className="hidden md:inline text-amber-700 dark:text-amber-400 text-[11px]">
              — Payments are simulated for demonstration purposes.
            </span>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40 text-[11px] font-extrabold transition-all group shadow-sm"
            title="Reset demo data to original baseline"
          >
            <RotateCcw className="w-3 h-3 group-hover:-rotate-90 transition-transform duration-200" />
            <span className="hidden xs:inline">Reset Demo</span>
          </button>
        </div>

        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Main Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Demo Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data"
        description="Are you sure you want to reset demo data? All temporary test transactions, created payment lists, and local modifications will revert to the baseline seed dataset."
        confirmLabel="Reset Demo"
        variant="warning"
      />
    </div>
  );
};

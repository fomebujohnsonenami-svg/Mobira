'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useBusiness } from './BusinessContext';
import { RotateCcw } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const DashboardLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resetDemo } = useBusiness();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleConfirmReset = () => {
    resetDemo();
    setIsResetConfirmOpen(false);
  };

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

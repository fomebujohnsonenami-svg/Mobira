'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PrivacyContextType {
  isBlinded: boolean;
  togglePrivacy: () => void;
  setBlinded: (blinded: boolean) => void;
  formatAmount: (amount: number | string | undefined | null, currency?: string) => string;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to blinded amounts for privacy & security
  const [isBlinded, setIsBlinded] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mobira_privacy_blinded');
      if (saved !== null) {
        setIsBlinded(saved === 'true');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const togglePrivacy = () => {
    setIsBlinded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mobira_privacy_blinded', String(next));
      } catch (e) {}
      return next;
    });
  };

  const setBlinded = (blinded: boolean) => {
    setIsBlinded(blinded);
    try {
      localStorage.setItem('mobira_privacy_blinded', String(blinded));
    } catch (e) {}
  };

  const formatAmount = (amount: number | string | undefined | null, currency = 'GH₵'): string => {
    if (isBlinded) {
      return `${currency} ••••••••`;
    }
    if (amount === undefined || amount === null) return `${currency} 0.00`;
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return `${currency} 0.00`;
    return `${currency} ${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <PrivacyContext.Provider
      value={{
        isBlinded,
        togglePrivacy,
        setBlinded,
        formatAmount,
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

export const PrivacyToggle: React.FC<{ className?: string; size?: 'sm' | 'md'; showLabel?: boolean }> = ({
  className = '',
  size = 'md',
  showLabel = true,
}) => {
  const { isBlinded, togglePrivacy } = usePrivacy();
  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={togglePrivacy}
      title={isBlinded ? 'Click to reveal financial balances' : 'Click to blind financial balances (Privacy Mode)'}
      aria-label={isBlinded ? 'Reveal balances' : 'Blind balances'}
      className={`relative inline-flex items-center gap-1.5 rounded-xl font-bold transition-all duration-200 select-none active:scale-95 ${
        isBlinded
          ? 'bg-emerald-500/15 dark:bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 hover:border-emerald-300 hover:bg-emerald-500/25 shadow-sm shadow-emerald-500/20'
          : 'bg-slate-100 dark:bg-navy-900 text-slate-400 hover:text-white border border-slate-200 dark:border-navy-800 hover:border-slate-700'
      } ${isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} ${className}`}
    >
      {isBlinded ? (
        <>
          <EyeOff className={isSmall ? 'w-3.5 h-3.5 text-emerald-400' : 'w-4 h-4 text-emerald-400 animate-pulse'} />
          {showLabel && <span className="font-mono tracking-tight text-emerald-400">Masked</span>}
        </>
      ) : (
        <>
          <Eye className={isSmall ? 'w-3.5 h-3.5 text-slate-300' : 'w-4 h-4 text-slate-300'} />
          {showLabel && <span className="font-mono tracking-tight text-slate-300">Visible</span>}
        </>
      )}
    </button>
  );
};

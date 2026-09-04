'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  CheckCircle2,
  Check,
  ChevronDown,
  Building2,
  User,
  ShieldCheck,
  X,
  ExternalLink,
  LogOut,
  Menu,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PrivacyToggle } from '@/components/privacy/PrivacyContext';
import { useBusiness } from './BusinessContext';
import { useAuth } from '@/components/auth/AuthContext';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { useNotifications } from '@/components/notifications/NotificationContext';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { Business } from '@/types';

export interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { currentBusiness, availableBusinesses, switchBusiness } = useBusiness();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  // Dropdown states
  const [isBizMenuOpen, setIsBizMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const bizRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bizRef.current && !bizRef.current.contains(e.target as Node)) {
        setIsBizMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-[#131B24] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between z-20 relative select-none transition-colors duration-200">
      {/* LEFT: Mobile Menu Button & Business Selector */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Business Selector Button */}
        <div className="relative min-w-0" ref={bizRef}>
          <button
            onClick={() => setIsBizMenuOpen(!isBizMenuOpen)}
            type="button"
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-50 dark:bg-[#18222D] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800 transition-all text-left shadow-sm group max-w-[200px] xs:max-w-[260px] sm:max-w-none truncate"
          >
            <div className="w-7 h-7 rounded-lg bg-[#A3E635] text-[#0F172A] font-black flex items-center justify-center text-xs shrink-0 shadow-sm shadow-[#A3E635]/20">
              {currentBusiness.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="font-black text-slate-900 dark:text-white tracking-tight text-xs truncate max-w-[90px] xs:max-w-[130px] sm:max-w-none">
                {currentBusiness.name}
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white shrink-0"
                style={{ backgroundColor: '#2563EB' }}
              >
                <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                <span className="hidden xs:inline">Verified</span>
              </span>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform ${
                  isBizMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Business Selector Dropdown */}
          {isBizMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-modal p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-900 dark:text-white">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Switch Business Entity
                </span>
              </div>
              <div className="space-y-1 py-1">
                {availableBusinesses.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      switchBusiness(b);
                      setIsBizMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      b.id === currentBusiness.id
                        ? 'bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-white border border-[#A3E635]/40 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{b.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.business_id}</p>
                    </div>
                    {b.id === currentBusiness.id && <Check className="w-4 h-4 text-[#A3E635]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Rail Indicators, Theme Toggle, Privacy, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#A3E635] shadow-sm shadow-[#A3E635]/50 animate-pulse" />
          <span className="font-mono font-semibold">MTN MoMo • Telecel • Bank EFT</span>
        </div>

        {/* Global Privacy Blind Toggle */}
        <PrivacyToggle size="sm" />

        {/* Dark / Light Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications Drawer Toggle Button */}
        <button
          type="button"
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          aria-label="Open Notifications"
          className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A3E635] ring-2 ring-white dark:ring-[#131B24]" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-[#A3E635] text-[#0F172A] font-black text-xs flex items-center justify-center shadow-md shadow-[#A3E635]/20">
              {user?.first_name?.slice(0, 1) || 'M'}{user?.last_name?.slice(0, 1) || 'E'}
            </div>
            <div className="hidden md:block text-left pr-1">
              <span className="block font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : 'Mobira Enterprise'}
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                {user?.role?.toLowerCase() || 'Admin'}
              </span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-modal p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-900 dark:text-white">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Drawer */}
      {isNotificationsOpen && (
        <NotificationDrawer onClose={() => setIsNotificationsOpen(false)} />
      )}
    </header>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

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
    <header className="h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 px-4 sm:px-6 flex items-center justify-between z-20 relative">
      {/* LEFT: Mobile Menu Button & Business Selector */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile / Tablet Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative" ref={bizRef}>
          <button
            onClick={() => setIsBizMenuOpen(!isBizMenuOpen)}
            type="button"
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-50 dark:bg-navy-950/80 hover:bg-slate-100 dark:hover:bg-navy-850 border border-slate-200 dark:border-navy-800 transition-all text-left shadow-subtle group"
          >
            <div className="w-7 h-7 rounded-lg bg-navy-900 text-yellow-400 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
              {currentBusiness.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex items-center gap-2">
              <BusinessVerificationBadge showName={true} showLabel={true} size="sm" />

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isBizMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Business Selector Dropdown */}
          {isBizMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-modal p-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Operating Entity
                </p>
              </div>

              <div className="py-1 space-y-1 max-h-60 overflow-y-auto">
                {availableBusinesses.map((biz) => {
                  const isSelected = biz.id === currentBusiness.id;
                  return (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => {
                        switchBusiness(biz);
                        setIsBizMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors text-left ${
                        isSelected
                          ? 'bg-yellow-50 dark:bg-navy-950 text-navy-950 dark:text-yellow-400 font-bold border border-yellow-300 dark:border-yellow-700/60'
                          : 'hover:bg-slate-50 dark:hover:bg-navy-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{biz.name}</span>
                          <span
                            className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-600 text-white shrink-0"
                            title="Verified Entity"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        </div>
                        <span className="block text-[10px] text-slate-400 truncate">
                          {biz.registration_number || 'RC/GH/2021/B/8921'}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500 text-navy-950 font-black shrink-0">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, payees, or invoices..."
            className="w-full pl-10 pr-12 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg text-xs text-navy-950 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:border-yellow-500 transition-colors shadow-subtle"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-400 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT: Rails Status, Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Rails Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono font-semibold">MTN MoMo • Orange Money • Bank EFT</span>
        </div>

        {/* Theme Toggle (Light/Dark Mode) */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-slate-500 hover:text-navy-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-navy-800"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-subtle border-2 border-white dark:border-navy-900 animate-in zoom-in-50">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 z-50">
              <NotificationDrawer onClose={() => setIsNotificationsOpen(false)} />
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            type="button"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-850 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-navy-800"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-500 text-navy-950 font-black text-xs flex items-center justify-center border border-yellow-600/30 shadow-subtle">
              {(user?.first_name?.[0] || 'K')}{(user?.last_name?.[0] || 'A')}
            </div>
            <div className="hidden md:block text-left pr-1">
              <span className="block font-bold text-xs text-navy-950 dark:text-slate-100 leading-tight">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Kwame Asante'}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">Finance Admin</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-modal p-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="p-2 border-b border-slate-100 dark:border-navy-800">
                <p className="font-bold text-xs text-navy-950 dark:text-slate-100">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Kwame Asante'}
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {user?.email || 'admin@abctechnologies.com'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Checker Authorized • Admin</span>
                </div>
              </div>

              <div className="py-1 text-xs text-slate-600 dark:text-slate-300">
                <a
                  href="/settings"
                  className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors"
                >
                  Organization Settings
                </a>
                <a
                  href="/statements"
                  className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors"
                >
                  Audit Trail
                </a>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 mt-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-bold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

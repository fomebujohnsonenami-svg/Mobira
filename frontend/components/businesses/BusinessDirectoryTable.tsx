'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Tag,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Grid,
  List,
  Phone,
  Mail,
  CreditCard,
  Check,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Business } from '@/types';
import { formatCurrency, getTierColor } from '@/lib/formatters';
import { useToast } from '@/components/ui/Toast';

export interface BusinessDirectoryProps {
  businesses: Business[];
  onSelectPayBusiness?: (business: Business) => void;
}

export const BusinessDirectoryTable: React.FC<BusinessDirectoryProps> = ({
  businesses,
  onSelectPayBusiness,
}) => {
  const { toast } = useToast();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedVerifiedStatus, setSelectedVerifiedStatus] = useState<'ALL' | 'VERIFIED_ONLY' | 'UNVERIFIED'>('ALL');
  const [viewLayout, setViewLayout] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Modals
  const [selectedProfileBiz, setSelectedProfileBiz] = useState<Business | null>(null);
  const [quickPayBiz, setQuickPayBiz] = useState<Business | null>(null);
  const [payAmount, setPayAmount] = useState('350');
  const [payNarration, setPayNarration] = useState('Payment for commercial services');
  const [payStep, setPayStep] = useState<'FORM' | 'REVIEW' | 'PROCESSING' | 'SUCCESS'>('FORM');
  const [payTxId, setPayTxId] = useState('');

  // Extract unique categories and locations from data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach((b) => {
      const cat = b.category || b.sector;
      if (cat) set.add(cat);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [businesses]);

  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach((b) => {
      const loc = b.location || (b.city && b.country ? `${b.city}, ${b.country}` : b.city || b.country);
      if (loc) set.add(loc);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [businesses]);

  // Filtering logic
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const isVerified = b.verification_tier !== 'UNVERIFIED' && b.is_active !== false;

      // 1. Verified Status Filter
      if (selectedVerifiedStatus === 'VERIFIED_ONLY' && !isVerified) return false;
      if (selectedVerifiedStatus === 'UNVERIFIED' && isVerified) return false;

      // 2. Category Filter
      if (selectedCategory !== 'ALL') {
        const cat = (b.category || b.sector || '').toLowerCase();
        if (!cat.includes(selectedCategory.toLowerCase())) return false;
      }

      // 3. Location Filter
      if (selectedLocation !== 'ALL') {
        const loc = (b.location || `${b.city}, ${b.country}` || '').toLowerCase();
        if (!loc.includes(selectedLocation.toLowerCase())) return false;
      }

      // 4. Search Query (matches name, trade_name, business_id, phone, location, category, registration)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = b.name.toLowerCase().includes(q) || (b.trade_name && b.trade_name.toLowerCase().includes(q));
        const matchId = (b.business_id && b.business_id.toLowerCase().includes(q)) || b.id.toLowerCase().includes(q);
        const matchPhone = b.phone && b.phone.toLowerCase().includes(q);
        const matchLoc = (b.location && b.location.toLowerCase().includes(q)) || (b.city && b.city.toLowerCase().includes(q));
        const matchCat = (b.category && b.category.toLowerCase().includes(q)) || (b.sector && b.sector.toLowerCase().includes(q));
        const matchReg = b.registration_number && b.registration_number.toLowerCase().includes(q);

        return matchName || matchId || matchPhone || matchLoc || matchCat || matchReg;
      }

      return true;
    });
  }, [businesses, searchQuery, selectedCategory, selectedLocation, selectedVerifiedStatus]);

  const verifiedCount = businesses.filter((b) => b.verification_tier !== 'UNVERIFIED' && b.is_active !== false).length;
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'ALL' || selectedLocation !== 'ALL' || selectedVerifiedStatus !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedLocation('ALL');
    setSelectedVerifiedStatus('ALL');
  };

  // Trigger quick payment flow for a verified business
  const handleInitiatePayment = (biz: Business) => {
    if (onSelectPayBusiness) {
      onSelectPayBusiness(biz);
    } else {
      setQuickPayBiz(biz);
      setPayStep('FORM');
    }
  };

  const handleAuthorizeQuickPay = () => {
    setPayStep('PROCESSING');
    setTimeout(() => {
      const generatedTx = `MOB-PAY-${Date.now().toString().slice(-6)}`;
      setPayTxId(generatedTx);
      setPayStep('SUCCESS');
      toast({
        type: 'success',
        title: 'Payment Successful',
        message: `GH₵${payAmount} authorized to ${quickPayBiz?.name} ✓`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Directory Filter Bar */}
      <Card className="p-5 bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 shadow-sm rounded-2xl">
        <div className="space-y-4">
          {/* Top Search & Layout Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by business name, Business ID (e.g. PP-ABC-001), phone, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs sm:text-sm text-navy-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Layout switch */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setViewLayout('CARDS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewLayout === 'CARDS'
                    ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-navy-950 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> Directory Cards
              </button>
              <button
                onClick={() => setViewLayout('TABLE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewLayout === 'TABLE'
                    ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-navy-950 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Ledger Table
              </button>
            </div>
          </div>

          {/* 3 Explicit Filter Selectors: Category, Location, Verified Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-navy-800">
            {/* Filter 1: Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {availableCategories
                    .filter((c) => c !== 'ALL')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Filter 2: Location */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="ALL">All Locations</option>
                  {availableLocations
                    .filter((l) => l !== 'ALL')
                    .map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Filter 3: Verified Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Verified Status
              </label>
              <div className="relative">
                <select
                  value={selectedVerifiedStatus}
                  onChange={(e) =>
                    setSelectedVerifiedStatus(e.target.value as 'ALL' | 'VERIFIED_ONLY' | 'UNVERIFIED')
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VERIFIED_ONLY">Verified Only (✓)</option>
                  <option value="UNVERIFIED">Pending Verification</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Filter Reset / Summary */}
            <div className="flex items-end justify-between sm:justify-end gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 h-9"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <strong className="text-navy-950 dark:text-white font-bold">{filteredBusinesses.length}</strong> of{' '}
          {businesses.length} businesses
          {selectedVerifiedStatus === 'VERIFIED_ONLY' && (
            <span className="ml-1 text-blue-600 dark:text-blue-400 font-bold">(Filtered: Verified Only)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
            <Check className="w-3.5 h-3.5" /> {verifiedCount} Verified on Mobira
          </span>
        </div>
      </div>

      {/* DIRECTORY VIEW 1: CARDS GRID */}
      {viewLayout === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBusinesses.map((biz) => {
            const isVerified = biz.verification_tier !== 'UNVERIFIED' && biz.is_active !== false;
            const tierMeta = getTierColor(biz.verification_tier);

            return (
              <Card
                key={biz.id}
                className="flex flex-col justify-between p-5 bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 hover:border-blue-500/50 hover:shadow-md transition-all duration-200 rounded-2xl group"
              >
                <div className="space-y-4">
                  {/* Card Header: Avatar, Name & Prominent Verified Badge */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-900 to-navy-950 text-yellow-400 font-black flex items-center justify-center text-sm shadow-sm shrink-0 border border-navy-800">
                      {biz.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Name with prominent checkmark if verified */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-black text-navy-950 dark:text-white truncate">
                          {biz.name}
                        </h3>
                        {isVerified && (
                          <span
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-subtle shrink-0"
                            title="Verified Business"
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Business ID & Trade Name */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono font-bold text-navy-900 dark:text-slate-300">
                          {biz.business_id || 'PP-ABC-001'}
                        </span>
                        {biz.trade_name && biz.trade_name !== biz.name && (
                          <>
                            <span>•</span>
                            <span className="truncate">{biz.trade_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT VERIFIED BADGE (Only businesses with successful verification receive it) */}
                  <div>
                    {isVerified ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-black shadow-subtle">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white w-3.5 h-3.5 text-[9px] font-bold">
                          ✓
                        </span>
                        <span>VERIFIED BUSINESS</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Pending Verification</span>
                      </div>
                    )}
                  </div>

                  {/* Location & Category Meta */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium truncate">{biz.location || `${biz.city}, ${biz.country}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium truncate">{biz.category || biz.sector}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {biz.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {biz.description}
                    </p>
                  )}

                  {/* Trust Score & Verification Tier */}
                  <div className="pt-2 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] tabular-nums border ${
                          isVerified
                            ? 'bg-yellow-50 dark:bg-yellow-950/60 border-yellow-300 dark:border-yellow-700/60 text-yellow-800 dark:text-yellow-300'
                            : 'bg-slate-100 dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-slate-500'
                        }`}
                      >
                        {biz.trust_score}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Trust Score</span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      RCCM: {biz.registration_number.slice(0, 15)}
                    </span>
                  </div>
                </div>

                {/* Card Actions: Pay Now & View Profile */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProfileBiz(biz)}
                    className="flex-1 text-xs font-bold h-8 border-slate-200 dark:border-navy-700"
                  >
                    View Profile
                  </Button>

                  {isVerified ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleInitiatePayment(biz)}
                      className="flex-1 text-xs font-bold h-8 gap-1 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3" /> Pay Now
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="flex-1 text-[11px] font-bold h-8 opacity-60 cursor-not-allowed"
                      title="Direct payments restricted until verification is complete."
                    >
                      Unverified
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* DIRECTORY VIEW 2: DETAILED TABLE */}
      {viewLayout === 'TABLE' && (
        <Card className="p-0 overflow-hidden bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
                <tr>
                  <th className="py-3 px-4">Business Entity</th>
                  <th className="py-3 px-4">Business ID</th>
                  <th className="py-3 px-4">Category & Location</th>
                  <th className="py-3 px-4">Registry (RCCM)</th>
                  <th className="py-3 px-4">Trust Index</th>
                  <th className="py-3 px-4">Verified Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                {filteredBusinesses.map((biz) => {
                  const isVerified = biz.verification_tier !== 'UNVERIFIED' && biz.is_active !== false;

                  return (
                    <tr
                      key={biz.id}
                      className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-navy-900 text-yellow-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {biz.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-navy-950 dark:text-white">
                                {biz.name}
                              </span>
                              {isVerified && (
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                              {biz.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Business ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-900 dark:text-slate-200">
                        {biz.business_id || 'PP-ABC-001'}
                      </td>

                      {/* Category & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-navy-950 dark:text-slate-200">
                          {biz.category || biz.sector}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{biz.location || `${biz.city}, ${biz.country}`}</span>
                        </div>
                      </td>

                      {/* RCCM */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {biz.registration_number}
                      </td>

                      {/* Trust Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${
                              isVerified
                                ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-300'
                                : 'bg-slate-100 dark:bg-navy-800 text-slate-500'
                            }`}
                          >
                            {biz.trust_score}
                          </div>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                      </td>

                      {/* Prominent Verified Badge (Only for verified entities) */}
                      <td className="py-3.5 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-extrabold text-[11px]">
                            <span className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white w-3 h-3 text-[8px] font-bold">
                              ✓
                            </span>
                            <span>Verified Business</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-700 font-medium text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProfileBiz(biz)}
                            className="text-xs h-7 px-2.5"
                          >
                            Profile
                          </Button>
                          {isVerified ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleInitiatePayment(biz)}
                              className="text-xs h-7 px-3 gap-1"
                            >
                              Pay
                            </Button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Unverified</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredBusinesses.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 rounded-2xl">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-950 dark:text-white">
              No matching businesses found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search keywords, category filter, or location to find partner organizations.
            </p>
            <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2 text-xs">
              Reset All Filters
            </Button>
          </div>
        </Card>
      )}

      {/* MODAL 1: CUSTOMER BUSINESS PROFILE */}
      {selectedProfileBiz && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProfileBiz(null)}
          title="Verified Business Profile"
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Header with verified badge */}
            <div className="p-5 bg-gradient-to-br from-navy-950 to-navy-900 border border-navy-800 rounded-2xl text-white space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black tracking-tight text-white">
                      {selectedProfileBiz.name}
                    </h2>
                    {selectedProfileBiz.verification_tier !== 'UNVERIFIED' && (
                      <span className="text-blue-400 font-bold text-lg">✓</span>
                    )}
                  </div>
                  <div className="text-xs text-yellow-400 font-mono font-bold">
                    Business ID: {selectedProfileBiz.business_id || 'PP-ABC-001'}
                  </div>
                </div>

                {/* Prominent Verified Badge */}
                {selectedProfileBiz.verification_tier !== 'UNVERIFIED' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-black">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>VERIFIED BUSINESS</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Verification</span>
                  </div>
                )}
              </div>

              {/* Location & Sector */}
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-navy-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedProfileBiz.location || `${selectedProfileBiz.city}, ${selectedProfileBiz.country}`}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {selectedProfileBiz.category || selectedProfileBiz.sector}
                </span>
              </div>
            </div>

            {/* Destination Trust Guarantee */}
            {selectedProfileBiz.verification_tier !== 'UNVERIFIED' && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-xl flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Verified Payment Destination:</strong> All settlement channels for this entity have been matched against authorized bank/telecom records.
                </span>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Commercial Registry</span>
                <span className="font-mono font-bold text-navy-950 dark:text-white">
                  {selectedProfileBiz.registration_number}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tax Identification</span>
                <span className="font-mono font-bold text-navy-950 dark:text-white">
                  {selectedProfileBiz.tax_number}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Trust Rating</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {selectedProfileBiz.trust_score} / 100 Index
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Official Channel</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {selectedProfileBiz.primary_momo_number || selectedProfileBiz.phone}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedProfileBiz.description && (
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-navy-950 p-3 rounded-xl border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Corporate Summary</span>
                {selectedProfileBiz.description}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProfileBiz(null)}
                className="text-xs"
              >
                Close
              </Button>
              {selectedProfileBiz.verification_tier !== 'UNVERIFIED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const b = selectedProfileBiz;
                    setSelectedProfileBiz(null);
                    handleInitiatePayment(b);
                  }}
                  className="text-xs font-bold gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Pay Now
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: QUICK PAYMENT FLOW FOR VERIFIED BUSINESS */}
      {quickPayBiz && (
        <Modal
          isOpen={true}
          onClose={() => setQuickPayBiz(null)}
          title={`Pay ${quickPayBiz.name}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {payStep === 'FORM' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-blue-950 dark:text-blue-200">
                        {quickPayBiz.name}
                      </span>
                      <span className="text-blue-600 font-bold text-xs">✓</span>
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-400 font-mono">
                      Business ID: {quickPayBiz.business_id || 'PP-ABC-001'}
                    </div>
                  </div>
                  <Badge variant="blue" size="sm">
                    Verified Destination
                  </Badge>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 dark:text-white mb-1.5">
                    Amount (GH₵)
                  </label>
                  <Input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="350"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 dark:text-white mb-1.5">
                    Payment Narration
                  </label>
                  <Input
                    type="text"
                    value={payNarration}
                    onChange={(e) => setPayNarration(e.target.value)}
                    placeholder="Payment for goods or services"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setQuickPayBiz(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setPayStep('REVIEW')}
                    className="font-bold gap-1"
                  >
                    Continue to Review <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {payStep === 'REVIEW' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl space-y-3">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Payment Review
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Recipient</span>
                    <span className="text-xs font-bold text-navy-950 dark:text-white flex items-center gap-1">
                      {quickPayBiz.name} <span className="text-blue-600 font-bold">✓</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Business ID</span>
                    <span className="text-xs font-mono font-bold text-navy-950 dark:text-white">
                      {quickPayBiz.business_id || 'PP-ABC-001'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Total Amount</span>
                    <span className="text-base font-black text-navy-950 dark:text-white">
                      GH₵{Number(payAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Verification</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Verified Payment Destination ✓
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setPayStep('FORM')}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAuthorizeQuickPay}
                    className="font-bold gap-1 shadow-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Authorize Payment
                  </Button>
                </div>
              </div>
            )}

            {payStep === 'PROCESSING' && (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-navy-950 dark:text-white">
                  Processing Payment...
                </h4>
                <p className="text-xs text-slate-500">
                  Routing GH₵{payAmount} via authorized settlement rails to {quickPayBiz.name}...
                </p>
              </div>
            )}

            {payStep === 'SUCCESS' && (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-navy-950 dark:text-white">
                    Payment Successful!
                  </h4>
                  <p className="text-xs text-slate-500">
                    GH₵{payAmount} disbursed to {quickPayBiz.name} ✓
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800 text-xs font-mono">
                  Tx Ref: {payTxId}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setQuickPayBiz(null)}
                  className="w-full font-bold"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

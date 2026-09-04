'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  CheckCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ListTodo,
  QrCode,
  Sparkles,
  ExternalLink,
  X,
  Clock,
  ArrowRight,
  Filter,
  Trash2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useNotifications } from '@/components/notifications/NotificationContext';
import { AppNotification } from '@/types';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (selectedCategory === 'UNREAD' && n.is_read) return false;
      if (selectedCategory !== 'ALL' && selectedCategory !== 'UNREAD') {
        if (n.category !== selectedCategory) return false;
      }
      if (selectedType !== 'ALL' && n.type !== selectedType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchMsg = n.message.toLowerCase().includes(q);
        const matchMeta = JSON.stringify(n.metadata || {}).toLowerCase().includes(q);
        return matchTitle || matchMsg || matchMeta;
      }

      return true;
    });
  }, [notifications, selectedCategory, selectedType, searchQuery]);

  const getNotificationIcon = (n: AppNotification) => {
    if (n.category === 'VERIFICATION') {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
      );
    }
    if (n.type === 'ERROR') {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-sm">
          <XCircle className="w-5 h-5" />
        </div>
      );
    }
    if (n.type === 'WARNING' || n.category === 'SECURITY') {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-sm">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    }
    if (n.category === 'PAYMENT_LISTS') {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-sm">
          <ListTodo className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-sm">
        <CheckCircle2 className="w-5 h-5" />
      </div>
    );
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Notification Center"
        subtitle="Review real-time governance alerts, compliance verification records, pre-flight mismatch warnings, and settlement logs."
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                className="text-xs font-bold gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark All as Read
              </Button>
            )}
            <Link href="/audit">
              <Button variant="primary" size="sm" className="text-xs font-bold gap-1.5 shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5" /> View Audit Logs ↗
              </Button>
            </Link>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Controls Card */}
          <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 shadow-sm rounded-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications by title, keyword, or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs sm:text-sm text-navy-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'UNREAD', label: 'Unread' },
                  { key: 'PAYMENTS', label: 'Payments' },
                  { key: 'VERIFICATION', label: 'Verification' },
                  { key: 'SECURITY', label: 'Security' },
                  { key: 'PAYMENT_LISTS', label: 'Lists' },
                ].map((tab) => {
                  const isActive = selectedCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedCategory(tab.key)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${isActive ? 'bg-blue-600 text-white shadow-subtle' : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800'}`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Results Counter */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing <strong className="text-navy-950 dark:text-white font-bold">{filtered.length}</strong> of{' '}
              {notifications.length} alerts
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {unreadCount} Unread Actions Remaining
              </span>
            </div>
          </div>

          {/* Notification Cards List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <Card className="p-12 text-center bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 rounded-2xl">
                <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3 stroke-[1.5]" />
                <h4 className="text-base font-bold text-navy-950 dark:text-white">No notifications found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try clearing your search query or switching to another category.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="mt-4 text-xs"
                >
                  Reset Filters
                </Button>
              </Card>
            ) : (
              filtered.map((n) => (
                <Card
                  key={n.id}
                  className={`p-5 transition-all rounded-2xl border ${!n.is_read ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10' : 'border-slate-200 dark:border-navy-800'}`}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(n)}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-navy-950 dark:text-white">
                            {n.title}
                          </h3>
                          {!n.is_read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-subtle">
                              NEW
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            {n.category.replace('_', ' ')}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(n.created_at).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1.5">
                        {n.message}
                      </p>

                      {/* Metadata Chips if available */}
                      {n.metadata && Object.keys(n.metadata).length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mt-3 pt-2.5 border-t border-slate-100 dark:border-navy-800 text-[11px]">
                          {Object.entries(n.metadata).map(([k, v]) => (
                            <span
                              key={k}
                              className="px-2 py-0.5 bg-slate-100 dark:bg-navy-950 rounded-lg text-slate-600 dark:text-slate-400 font-mono text-[10px]"
                            >
                              <strong className="text-slate-800 dark:text-slate-200">{k}:</strong>{' '}
                              {String(v)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100 dark:border-navy-800">
                        <div className="flex items-center gap-3">
                          {n.action_url && (
                            <Link
                              href={n.action_url}
                              onClick={() => markAsRead(n.id)}
                              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              Open Destination Rail <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                          <button
                            onClick={() => setSelectedNotification(n)}
                            className="text-xs font-semibold text-slate-500 hover:text-navy-950 dark:hover:text-white flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" /> Inspect Details
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => (n.is_read ? null : markAsRead(n.id))}
                            className="text-xs h-8 text-slate-500 hover:text-blue-600"
                          >
                            {n.is_read ? 'Read' : 'Mark as Read'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(n.id)}
                            className="text-xs h-8 text-slate-400 hover:text-rose-600"
                            title="Dismiss notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </PageShell>

      {/* Inspector Modal */}
      {selectedNotification && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedNotification(null)}
          title={selectedNotification.title}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  Category
                </span>
                <span className="font-bold text-navy-950 dark:text-white">
                  {selectedNotification.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  Timestamp
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {new Date(selectedNotification.created_at).toISOString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  Status
                </span>
                <span className="font-bold text-blue-600">
                  {selectedNotification.is_read ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>

            <div>
              <span className="font-bold text-navy-950 dark:text-white block mb-1">
                Full Notification Content
              </span>
              <p className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedNotification.message}
              </p>
            </div>

            {selectedNotification.metadata && (
              <div>
                <span className="font-bold text-navy-950 dark:text-white block mb-1">
                  Structured Payload Metadata
                </span>
                <pre className="p-3 bg-navy-950 text-yellow-400 font-mono text-[11px] rounded-xl overflow-x-auto border border-navy-800">
                  {JSON.stringify(selectedNotification.metadata, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedNotification(null)}>
                Close
              </Button>
              {selectedNotification.action_url && (
                <Link href={selectedNotification.action_url}>
                  <Button variant="primary" size="sm" className="gap-1 font-bold">
                    Navigate <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayoutWrapper>
  );
}

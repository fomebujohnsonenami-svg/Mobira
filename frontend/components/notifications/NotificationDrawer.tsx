'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  CheckCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ListTodo,
  QrCode,
  Sparkles,
  ExternalLink,
  X,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useNotifications } from './NotificationContext';
import { AppNotification, NotificationCategory } from '@/types';
import { Button } from '@/components/ui/Button';

export interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'PAYMENTS' | 'VERIFICATION' | 'SECURITY'>('ALL');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.is_read;
    if (activeTab === 'PAYMENTS') return n.category === 'PAYMENTS';
    if (activeTab === 'VERIFICATION') return n.category === 'VERIFICATION';
    if (activeTab === 'SECURITY') return n.category === 'SECURITY';
    return true;
  });

  const getNotificationIcon = (n: AppNotification) => {
    if (n.category === 'VERIFICATION') {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
      );
    }
    if (n.type === 'ERROR') {
      return (
        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
          <XCircle className="w-4 h-4" />
        </div>
      );
    }
    if (n.type === 'WARNING' || n.category === 'SECURITY') {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }
    if (n.category === 'PAYMENT_LISTS') {
      return (
        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
          <ListTodo className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="w-80 sm:w-96 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl shadow-modal overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-sm text-navy-950 dark:text-white">Notifications</h3>
          {unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-subtle">
              {unreadCount} new
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-navy-800 text-slate-500">
              All caught up
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            title="Mark all notifications as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="px-3 pt-2.5 pb-1 border-b border-slate-100 dark:border-navy-800 flex items-center gap-1 overflow-x-auto text-[11px]">
        {(['ALL', 'UNREAD', 'PAYMENTS', 'VERIFICATION', 'SECURITY'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${isActive ? 'bg-blue-600 text-white shadow-subtle' : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800'}`}
            >
              {tab === 'ALL'
                ? 'All'
                : tab === 'UNREAD'
                ? `Unread (${unreadCount})`
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Notification Items List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-navy-850">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs px-4">
            <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2 stroke-[1.5]" />
            <p className="font-bold text-navy-950 dark:text-white">No notifications</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeTab === 'UNREAD' ? 'You have read all alerts.' : 'No alerts in this category.'}
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 flex items-start gap-3 transition-colors relative group ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''}`}
            >
              {/* Category Icon */}
              {getNotificationIcon(n)}

              {/* Body */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-navy-950 dark:text-white leading-tight">
                    {n.title}
                  </h4>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread alert" />
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {n.message}
                </p>

                {/* Footer Meta & Action */}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {n.action_url && (
                    <Link
                      href={n.action_url}
                      onClick={() => {
                        markAsRead(n.id);
                        onClose();
                      }}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      View Details <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Dismiss / Mark Read Action */}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-navy-800"
                    title="Mark as read"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => dismissNotification(n.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-navy-800"
                  title="Dismiss notification"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="p-2.5 bg-slate-50 dark:bg-navy-950 border-t border-slate-100 dark:border-navy-800 text-center">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          View All Notifications in Center <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

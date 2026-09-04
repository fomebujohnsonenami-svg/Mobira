'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Download,
  Filter,
  RefreshCw,
  User,
  Building2,
  Clock,
  Calendar,
  Code2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  FileSpreadsheet,
  Send,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingState';
import { api } from '@/services/api';
import { AuditLogItem } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function AuditLogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error('Failed to fetch audit logs', err);
      setError(err?.message || 'Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const availableActions = [
    'ALL',
    'login',
    'business created',
    'verification submitted',
    'verification completed',
    'payment list imported',
    'recipient verified',
    'payment authorized',
    'payment completed',
    'payment failed',
    'payment link created',
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      // Action filter
      if (selectedAction !== 'ALL') {
        if (l.action.toLowerCase() !== selectedAction.toLowerCase()) return false;
      }

      // User filter
      if (selectedUser !== 'ALL') {
        const uName = l.user_name || 'System';
        if (!uName.toLowerCase().includes(selectedUser.toLowerCase())) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchAction = l.action.toLowerCase().includes(q);
        const matchUser = (l.user_name || '').toLowerCase().includes(q) || (l.user_email || '').toLowerCase().includes(q);
        const matchRef = (l.reference_id || '').toLowerCase().includes(q);
        const matchMeta = JSON.stringify(l.metadata || l.details || {}).toLowerCase().includes(q);
        return matchAction || matchUser || matchRef || matchMeta;
      }

      return true;
    });
  }, [logs, selectedAction, selectedUser, searchQuery]);

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Structured JSON metadata copied.',
    });
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Action', 'User', 'Email', 'Business', 'Reference ID', 'Metadata'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp || l.created_at}"`,
      `"${l.action}"`,
      `"${l.user_name || 'System'}"`,
      `"${l.user_email || 'system@mobira.internal'}"`,
      `"${l.business_name || 'ABC Technologies Ltd'}"`,
      `"${l.reference_id || ''}"`,
      `"${JSON.stringify(l.metadata || l.details || {}).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Mobira_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: 'success',
      title: 'Audit Log Exported',
      message: `${filteredLogs.length} audit records downloaded as CSV.`,
    });
  };

  const getActionBadge = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('failed')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-black">
          <XCircle className="w-3.5 h-3.5" />
          <span>{action}</span>
        </span>
      );
    }
    if (lower.includes('completed') || lower.includes('verified') || lower.includes('created')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-black">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{action}</span>
        </span>
      );
    }
    if (lower.includes('authorized') || lower.includes('submitted')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{action}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{action}</span>
      </span>
    );
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Compliance & Audit Logs"
        subtitle="Immutable governance ledger recording user logins, business creation, identity checks, dual authorizations, payment executions, and payment link events."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              className="text-xs font-bold gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs font-bold gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit CSV
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="space-y-6">
            <TableSkeleton rows={8} cols={7} />
          </div>
        ) : error ? (
          <ErrorState title="Something went wrong." message={error} onRetry={fetchLogs} />
        ) : (
          <div className="space-y-6">
            {/* Trust Guarantee Alert */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Tamper-Resistant Regulatory Compliance Trail</span>
                    <span className="text-emerald-400 font-bold">✓ SEC/BoG Audit Compliant</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    All records store user, business, action, UTC timestamp, and granular parameter metadata.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs">
                  Total Events: {logs.length}
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <Card className="p-4 bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 shadow-sm rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by action, user, or reference ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-medium text-navy-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Action Filter */}
                <div>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="ALL">All Actions (10 Types)</option>
                    {availableActions
                      .filter((a) => a !== 'ALL')
                      .map((act) => (
                        <option key={act} value={act}>
                          {act}
                        </option>
                      ))}
                  </select>
                </div>

                {/* User Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="ALL">All Operators</option>
                    <option value="Kwame Asante">Kwame Asante (Admin)</option>
                    <option value="Ama Mensah">Ama Mensah (Finance)</option>
                    <option value="Kofi Boateng">Kofi Boateng (Auditor)</option>
                    <option value="Efua Darkwa">Efua Darkwa (Fashion Admin)</option>
                  </select>

                  {(searchQuery || selectedAction !== 'ALL' || selectedUser !== 'ALL') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedAction('ALL');
                        setSelectedUser('ALL');
                      }}
                      className="text-xs text-rose-600 dark:text-rose-400 shrink-0 h-9 px-2"
                      title="Reset filters"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Audit Ledger Table or Empty State */}
            {filteredLogs.length === 0 ? (
              <EmptyState
                icon={Lock}
                title="No audit events found"
                description="No audit events match your active search or filter parameters."
                variant="card"
              />
            ) : (
              <Card className="p-0 overflow-hidden bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
                      <tr>
                        <th className="py-3 px-4">Action Event</th>
                        <th className="py-3 px-4">Operator / User</th>
                        <th className="py-3 px-4">Operating Entity</th>
                        <th className="py-3 px-4">Reference ID</th>
                        <th className="py-3 px-4">Timestamp (UTC)</th>
                        <th className="py-3 px-4">Metadata Payload</th>
                        <th className="py-3 px-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                      {filteredLogs.map((log) => {
                        const meta = log.metadata || log.details || {};
                        return (
                          <tr
                            key={log.id}
                            className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors"
                          >
                            {/* Action Badge */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {getActionBadge(log.action)}
                            </td>

                            {/* User */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-navy-950 dark:text-white">
                                {log.user_name || 'System'}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">
                                {log.user_email || 'system@mobira.internal'}
                              </div>
                            </td>

                            {/* Business */}
                            <td className="py-3 px-4 whitespace-nowrap font-medium text-navy-900 dark:text-slate-200">
                              {log.business_name || 'ABC Technologies Ltd'}
                            </td>

                            {/* Reference ID */}
                            <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                              {log.reference_id || '—'}
                            </td>

                            {/* Timestamp */}
                            <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              {new Date(log.timestamp || log.created_at || '').toLocaleString([], {
                                dateStyle: 'short',
                                timeStyle: 'medium',
                              })}
                            </td>

                            {/* Metadata Preview */}
                            <td className="py-3 px-4 max-w-xs">
                              <div className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                {JSON.stringify(meta)}
                              </div>
                            </td>

                            {/* Inspect Modal Button */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLog(log)}
                                className="text-xs h-7 px-2.5 gap-1 font-bold"
                              >
                                <Code2 className="w-3 h-3" /> JSON
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </PageShell>

      {/* JSON Metadata Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record: ${selectedLog.action}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Action</span>
                <span className="font-bold text-navy-950 dark:text-white capitalize">
                  {selectedLog.action}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Operator</span>
                <span className="font-bold text-navy-950 dark:text-white truncate block">
                  {selectedLog.user_name || 'System'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reference ID</span>
                <span className="font-mono text-navy-950 dark:text-white truncate block">
                  {selectedLog.reference_id || 'N/A'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Timestamp</span>
                <span className="font-mono text-navy-950 dark:text-white truncate block text-[10px]">
                  {new Date(selectedLog.timestamp || selectedLog.created_at || '').toISOString()}
                </span>
              </div>
            </div>

            {/* Metadata JSON Viewer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-navy-950 dark:text-white">
                  Metadata JSON Payload:
                </span>
                <button
                  onClick={() => handleCopyJson(selectedLog.metadata || selectedLog.details || {})}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 bg-navy-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-navy-800 max-h-72">
                {JSON.stringify(selectedLog.metadata || selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayoutWrapper>
  );
}
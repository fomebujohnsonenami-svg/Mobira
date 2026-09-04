'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';

export default function LoginPage() {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('admin@abctechnologies.com');
  const [password, setPassword] = useState('demo2026');
  const [error, setError] = useState('');

  const demoPersonas = [
    {
      role: 'ADMIN',
      label: 'Corporate Admin',
      name: 'Kwame Asante',
      email: 'admin@abctechnologies.com',
      company: 'ABC Technologies Ltd',
      desc: 'Full disbursement & maker-checker approval power',
    },
    {
      role: 'FINANCE_OFFICER',
      label: 'Finance Officer',
      name: 'Ama Mensah',
      email: 'finance@abctechnologies.com',
      company: 'ABC Technologies Ltd',
      desc: 'Batch salary maker & recipient list manager',
    },
    {
      role: 'AUDITOR',
      label: 'Compliance Auditor',
      name: 'Kofi Boateng',
      email: 'auditor@abctechnologies.com',
      company: 'ABC Technologies Ltd',
      desc: 'Read-only ledger audit trail & integrity inspector',
    },
    {
      role: 'ADMIN',
      label: 'Fashion Merchant',
      name: 'Efua Darkwa',
      email: 'manager@abcfashion.com',
      company: 'ABC Fashion House',
      desc: 'QR payment links & multi-rail collections',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleSelectPersona = async (personaEmail: string) => {
    setEmail(personaEmail);
    setPassword('demo2026');
    setError('');
    await demoLogin(personaEmail);
  };

  return (
    <div className="min-h-screen bg-[#040C18] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-navy-950">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-navy-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:bg-emerald-400 transition-colors">
              M
            </div>
            <div className="text-left">
              <span className="font-black text-2xl text-white tracking-tight block">MOBIRA</span>
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-widest">
                TRUST & PAYMENTS
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 max-w-sm mx-auto pt-1">
            Enterprise orchestration and verified identity for African commercial payments.
          </p>
        </div>

        {/* 1. Fast Access for Competition Judges & Evaluators */}
        <Card className="p-5 bg-[#08162B] border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-black text-xs uppercase tracking-wider text-emerald-400">
                Demo & Evaluation Access
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-navy-950">
              ONE-CLICK LOGIN
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Click any demo persona below to log in instantly with pre-populated telemetry, verified Ghanaian businesses, and multi-rail payment lists:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoPersonas.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => handleSelectPersona(p.email)}
                disabled={isLoading}
                className="text-left p-3 rounded-xl bg-navy-900/80 border border-emerald-500/20 hover:border-emerald-400 hover:bg-navy-850 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      {p.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="font-bold text-xs text-white mt-1">{p.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{p.company}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-navy-800">
                  {p.email}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              isLoading={isLoading}
              onClick={() => handleSelectPersona('admin@abctechnologies.com')}
              className="w-full gap-2 font-black py-3 text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20"
            >
              <Award className="w-4 h-4" /> Launch Demo as Corporate Admin (Kwame Asante)
            </Button>
          </div>
        </Card>

        {/* 2. Manual Sign In Form */}
        <Card className="p-6 bg-navy-900 border border-navy-800 text-slate-100 shadow-subtle space-y-4">
          <div className="border-b border-navy-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Manual Sign In
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Use pre-configured demo credentials or your custom login
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 block">Password:</span>
              <span className="text-[11px] font-mono font-bold text-white bg-navy-950 px-1.5 py-0.5 rounded border border-navy-700">
                demo2026
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@abctechnologies.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Button
              type="submit"
              variant="secondary"
              isLoading={isLoading}
              className="w-full gap-2 font-bold py-2.5 text-xs bg-navy-800 hover:bg-navy-750 text-white border border-navy-700"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Sign In to Mobira
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an enterprise account?{' '}
            <Link
              href="/signup"
              className="font-bold text-emerald-400 hover:underline"
            >
              Sign up now
            </Link>
          </div>
        </Card>

        {/* Security & Simulation Disclaimer */}
        <p className="text-center text-[11px] text-slate-500">
          Protected by Mobira Pre-Flight Protocol. Fictional demo environment configured for competition evaluation.
        </p>
      </div>
    </div>
  );
}

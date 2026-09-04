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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    await demoLogin();
  };

  return (
    <div className="min-h-screen bg-[#040C18] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-navy-950">
      <div className="max-w-md w-full space-y-6">
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

          <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
            Enterprise orchestration and verified identity for African commercial payments.
          </p>
        </div>

        {/* 1. Fast Access: "Continue with Demo Account" */}
        <Card className="p-5 bg-navy-900 border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-xs uppercase tracking-wider text-emerald-400">
                Instant Demo Access
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-navy-950 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ABC Technologies Ltd ✓
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Instantly launches the demo dashboard with pre-configured telemetry, verified business identity, and simulated telecom rails.
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="primary"
              isLoading={isLoading}
              onClick={handleDemoLogin}
              className="w-full gap-2 font-black py-3 text-sm bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20"
            >
              <Award className="w-4 h-4" /> Continue with Demo Account
            </Button>
          </div>
        </Card>

        {/* 2. Standard Login Form */}
        <Card className="p-6 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-slate-100 shadow-subtle space-y-4">
          <div className="border-b border-slate-200 dark:border-navy-800 pb-3">
            <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100">
              Sign In to Your Business Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter authorized corporate credentials
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-semibold">
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
              className="w-full gap-2 font-bold py-2.5 text-xs"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In to Mobira
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an enterprise account?{' '}
            <Link
              href="/signup"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign up now
            </Link>
          </div>
        </Card>

        {/* Security & Simulation Disclaimer */}
        <p className="text-center text-[11px] text-slate-400">
          Protected by Mobira Pre-Flight Protocol. Do not enter real financial banking PINs or credentials.
        </p>
      </div>
    </div>
  );
}

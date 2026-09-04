'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';

export default function SignUpPage() {
  const { register, demoLogin, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register({
        full_name: fullName,
        email,
        phone,
        password,
        confirm_password: confirmPassword,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-yellow-500 selection:text-navy-950">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 text-navy-950 font-black text-xl flex items-center justify-center shadow-subtle group-hover:bg-yellow-400 transition-colors">
              M
            </div>
            <div className="text-left">
              <span className="font-black text-2xl text-white tracking-tight block">MOBIRA</span>
              <span className="text-[10px] text-yellow-400 font-bold block uppercase tracking-widest">
                TRUST & PAYMENTS
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
            Create an enterprise treasury account to disburse payouts and receive verified customer funds.
          </p>
        </div>

        {/* 1. Fast Judge Access: "Continue with Demo Account" */}
        <Card className="p-4 bg-navy-900 border border-yellow-500/40 shadow-modal flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block">
              Competition Presentation
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Skip registration with pre-seeded data
            </span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={demoLogin}
            isLoading={isLoading}
            className="shrink-0 gap-1.5 font-bold text-xs"
          >
            <Award className="w-3.5 h-3.5" /> Continue with Demo Account
          </Button>
        </Card>

        {/* 2. Registration Form */}
        <Card className="p-6 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-slate-100 shadow-subtle space-y-4">
          <div className="border-b border-slate-200 dark:border-navy-800 pb-3">
            <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100">
              Create Enterprise Account
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set up your authorized company representative
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Samuel Eto"
              required
            />

            <Input
              label="Official Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="samuel.eto@abctechnologies.cm"
              required
            />

            <Input
              label="Phone Number (Mobile Money or Corporate)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+237 670 000 111"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              isLoading={isLoading}
              className="w-full gap-2 font-bold py-2.5 text-xs mt-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" /> Create Enterprise Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-navy-950 dark:text-yellow-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </Card>

        {/* Security & Simulation Notice */}
        <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
          Mobira is an orchestration & trust layer. All payment provider rails are simulated for this competition prototype.
        </p>
      </div>
    </div>
  );
}

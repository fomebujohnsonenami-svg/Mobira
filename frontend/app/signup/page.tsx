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
            Create an enterprise treasury account to disburse payouts and receive verified customer funds.
          </p>
        </div>

        {/* 1. Fast Judge Access: "Skip Registration with Demo Account" */}
        <Card className="p-5 bg-[#08162B] border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Judges & Evaluators Quick Access
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-navy-950">
              PRE-CONFIGURED
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Skip account creation and jump straight into the live dashboard with 80+ beneficiaries and verified business identities:
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => demoLogin('admin@abctechnologies.com')}
            isLoading={isLoading}
            className="w-full gap-2 font-black py-2.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20"
          >
            <Award className="w-4 h-4" /> Skip & Launch Demo Account (Kwame Asante)
          </Button>
        </Card>

        {/* 2. Registration Form */}
        <Card className="p-6 bg-navy-900 border border-navy-800 text-slate-100 shadow-subtle space-y-4">
          <div className="border-b border-navy-800 pb-3">
            <h3 className="font-extrabold text-sm text-white">
              Create Enterprise Account
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set up your authorized corporate representative
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Kwame Asante"
              required
            />

            <Input
              label="Official Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kwame.asante@yourcompany.com"
              required
            />

            <Input
              label="Phone Number (Mobile Money or Corporate)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 24 123 4567"
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
              className="w-full gap-2 font-bold py-2.5 text-xs mt-2 bg-navy-800 hover:bg-navy-750 text-white border border-navy-700"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Create Enterprise Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-emerald-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </Card>

        {/* Security & Simulation Notice */}
        <p className="text-center text-[11px] text-slate-500">
          Protected by Mobira Pre-Flight Protocol. Fictional demo environment configured for competition evaluation.
        </p>
      </div>
    </div>
  );
}

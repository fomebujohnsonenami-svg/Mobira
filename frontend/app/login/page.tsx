'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, Award, KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('mobira@gmail.com');
  const [password, setPassword] = useState('mobira123');
  const [error, setError] = useState('');

  const demoPersonas = [
    {
      role: 'ADMIN',
      label: 'Enterprise Lead',
      name: 'Mobira Enterprise',
      email: 'mobira@gmail.com',
      pass: 'mobira123',
      company: 'ABC Technologies Ltd',
      desc: 'Primary Enterprise Portal Admin credentials',
    },
    {
      role: 'ADMIN',
      label: 'Corporate Admin',
      name: 'Kwame Asante',
      email: 'admin@abctechnologies.com',
      pass: 'demo2026',
      company: 'ABC Technologies Ltd',
      desc: 'Full disbursement & maker-checker approval power',
    },
    {
      role: 'FINANCE_OFFICER',
      label: 'Finance Officer',
      name: 'Ama Mensah',
      email: 'finance@abctechnologies.com',
      pass: 'demo2026',
      company: 'ABC Technologies Ltd',
      desc: 'Batch salary maker & recipient list manager',
    },
    {
      role: 'ADMIN',
      label: 'Fashion Merchant',
      name: 'Efua Darkwa',
      email: 'manager@abcfashion.com',
      pass: 'demo2026',
      company: 'ABC Fashion House',
      desc: 'QR payment links & multi-rail collections',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Redirect to target feature or dashboard
      router.push(redirectTarget);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Use mobira@gmail.com and password mobira123.');
    }
  };

  const handleSelectPersona = async (personaEmail: string, personaPass: string = 'mobira123') => {
    setEmail(personaEmail);
    setPassword(personaPass);
    setError('');
    await demoLogin(personaEmail);
    // Redirect to target feature or dashboard
    router.push(redirectTarget);
  };

  const handleFillEnterpriseCredentials = () => {
    setEmail('mobira@gmail.com');
    setPassword('mobira123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#131B24] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#A3E635] selection:text-[#0F172A]">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#A3E635] text-[#0F172A] font-black text-xl flex items-center justify-center shadow-lg shadow-[#A3E635]/20 group-hover:bg-[#84CC16] transition-colors">
              M
            </div>
            <div className="text-left">
              <span className="font-black text-2xl text-white tracking-tight block">MOBIRA</span>
              <span className="text-[10px] text-[#A3E635] font-bold block uppercase tracking-widest">
                ENTERPRISE PORTAL
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 max-w-sm mx-auto pt-1">
            Enterprise orchestration and verified identity for African commercial payments.
          </p>

          {redirectTarget && redirectTarget !== '/dashboard' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] text-xs font-bold">
              <Lock className="w-3 h-3" />
              <span>Sign in to continue to: <code className="font-mono text-white">{redirectTarget}</code></span>
            </div>
          )}
        </div>

        {/* 1. Direct Enterprise Credentials Box */}
        <Card className="p-5 bg-[#18222D] border-2 border-[#A3E635]/50 shadow-xl shadow-[#A3E635]/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#A3E635]" />
              <span className="font-black text-xs uppercase tracking-wider text-[#A3E635]">
                Enterprise Portal Login Credentials
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#A3E635] text-[#0F172A]">
              READY TO USE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#131B24] rounded-xl border border-slate-700/80">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email Address:</span>
              <span className="text-sm font-mono font-bold text-white select-all">mobira@gmail.com</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Password:</span>
              <span className="text-sm font-mono font-bold text-[#A3E635] select-all">mobira123</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              type="button"
              variant="primary"
              isLoading={isLoading}
              onClick={() => handleSelectPersona('mobira@gmail.com', 'mobira123')}
              className="w-full sm:flex-1 gap-2 font-black py-3 text-xs sm:text-sm bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-md shadow-[#A3E635]/25"
            >
              <Award className="w-4 h-4" /> Sign In Directly as Mobira Enterprise
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFillEnterpriseCredentials}
              className="w-full sm:w-auto text-xs font-bold border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Prefill Form
            </Button>
          </div>
        </Card>

        {/* 2. Login Form */}
        <Card className="p-6 bg-[#18222D] border border-slate-800 text-slate-100 shadow-subtle space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Enterprise Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mobira@gmail.com"
              required
              className="bg-[#131B24] border-slate-700 text-white font-mono placeholder:text-slate-500"
            />

            <Input
              label="Account Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mobira123"
              required
              className="bg-[#131B24] border-slate-700 text-white placeholder:text-slate-500"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full font-black py-3 text-sm bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-md shadow-[#A3E635]/25"
              isLoading={isLoading}
            >
              <span>Authenticate & Access Feature</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Persona Switcher Accordion */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Or Switch Corporate Role:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoPersonas.slice(1).map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleSelectPersona(p.email, p.pass)}
                  className="p-2.5 rounded-xl bg-[#131B24] border border-slate-800 hover:border-[#A3E635]/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-[#A3E635] transition-colors">
                      {p.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.company}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-400">
          <span>Need a new organization account? </span>
          <Link href="/signup" className="text-[#A3E635] font-bold hover:underline">
            Register Business
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#131B24] flex items-center justify-center text-white">Loading Enterprise Portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

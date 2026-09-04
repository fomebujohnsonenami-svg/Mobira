import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Layers,
  Send,
  QrCode,
  Zap,
  Globe2,
  Building2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#040C18] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-navy-950">
      {/* Top Bar */}
      <header className="border-b border-navy-850/80 bg-[#040C18]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-navy-950 font-black flex items-center justify-center text-lg shadow-lg shadow-emerald-500/20">
              M
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight">MOBIRA</span>
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-widest">
                TRUST & PAYMENT ORCHESTRATION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="gap-2 font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20">
                Launch Enterprise Portal <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-20 flex-1">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wide">PRE-FLIGHT RECIPIENT IDENTITY VERIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            The Trust & Identity Layer for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">African Business Payments</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Mobira orchestrates business disbursements and collections across existing mobile money networks and commercial banks with real-time pre-flight identity matching.
          </p>

          {/* Proposition Tag */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="px-3.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-black text-white shadow-sm">
              PAY
            </span>
            <span className="text-emerald-400 font-bold">•</span>
            <span className="px-3.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-black text-white shadow-sm">
              RECEIVE
            </span>
            <span className="text-emerald-400 font-bold">•</span>
            <span className="px-3.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-black text-white shadow-sm">
              VERIFY
            </span>
            <span className="text-emerald-400 font-bold">•</span>
            <span className="px-3.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-black text-white shadow-sm">
              GROW
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 font-black bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-xl shadow-emerald-500/25 px-6">
                Open Business Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-navy-700 bg-navy-900/90 hover:bg-navy-850 hover:border-emerald-500/40 px-6">
                Test Pre-Flight Verification
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PAY */}
          <Card className="p-6 bg-navy-900/80 border border-navy-800 hover:border-emerald-500/40 text-white transition-all group hover:shadow-xl hover:shadow-emerald-950/20">
            <div className="w-12 h-12 rounded-xl bg-navy-950 border border-navy-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all">
              <Send className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">1. PAY</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Disburse bulk salaries and vendor settlements across MTN Mobile Money, Vodafone Cash, and Bank EFT with dual-approval maker-checker governance.
            </p>
            <Link href="/payments" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Disbursement Engine &rarr;
            </Link>
          </Card>

          {/* RECEIVE */}
          <Card className="p-6 bg-navy-900/80 border border-navy-800 hover:border-emerald-500/40 text-white transition-all group hover:shadow-xl hover:shadow-emerald-950/20">
            <div className="w-12 h-12 rounded-xl bg-navy-950 border border-navy-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">2. RECEIVE</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Generate branded payment links and dynamic QR codes that display verified corporate identity and trigger seamless customer USSD mobile push prompts.
            </p>
            <Link href="/receive" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Payment Links & QR &rarr;
            </Link>
          </Card>

          {/* VERIFY */}
          <Card className="p-6 bg-navy-900/80 border border-navy-800 hover:border-emerald-500/40 text-white transition-all group hover:shadow-xl hover:shadow-emerald-950/20">
            <div className="w-12 h-12 rounded-xl bg-navy-950 border border-navy-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">3. VERIFY</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Execute pre-flight name matching against telecom subscriber registries and corporate registers to eradicate ghost payees and wrong-number errors.
            </p>
            <Link href="/verify" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Anti-Fraud Intelligence &rarr;
            </Link>
          </Card>

          {/* GROW */}
          <Card className="p-6 bg-navy-900/80 border border-navy-800 hover:border-emerald-500/40 text-white transition-all group hover:shadow-xl hover:shadow-emerald-950/20">
            <div className="w-12 h-12 rounded-xl bg-navy-950 border border-navy-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">4. GROW</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Convert verified payment histories into an authoritative Mobira Trust Score (0-100) to build institutional credibility and unlock trade financing.
            </p>
            <Link href="/analytics" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Trust Score Metrics &rarr;
            </Link>
          </Card>
        </div>

        {/* Live Network Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-800 text-center">
            <span className="text-2xl font-black text-white font-mono">100%</span>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">Pre-Flight Identity Check</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-800 text-center">
            <span className="text-2xl font-black text-white font-mono">Multi-Rail</span>
            <p className="text-[11px] text-sky-400 font-bold mt-1">MoMo & Commercial Banks</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-800 text-center">
            <span className="text-2xl font-black text-white font-mono">Dual Auth</span>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">Maker-Checker Governance</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-800 text-center">
            <span className="text-2xl font-black text-white font-mono">Real-Time</span>
            <p className="text-[11px] text-sky-400 font-bold mt-1">Audit Trail & Compliance</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-850/80 px-6 py-6 text-center text-xs text-slate-400 bg-[#040C18]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500 text-navy-950 font-black text-[10px] flex items-center justify-center">
              M
            </div>
            <span className="font-bold text-slate-200">Mobira Technologies</span>
            <span className="text-slate-600">•</span>
            <span>African Business Payment & Trust Orchestration Platform</span>
          </div>
          <p className="text-slate-500">© 2026 Mobira. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

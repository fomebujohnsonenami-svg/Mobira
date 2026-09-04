import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Layers,
  Send,
  QrCode,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between selection:bg-yellow-500 selection:text-navy-950">
      {/* Top Bar */}
      <header className="border-b border-navy-850 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-500 text-navy-950 font-black flex items-center justify-center text-lg">
              M
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight">MOBIRA</span>
              <span className="text-[10px] text-yellow-400 font-bold block uppercase tracking-widest">
                AFRICAN TRUST PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="gap-2 font-bold text-xs">
                Launch Enterprise Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>FINTECH COMPETITION PROTOTYPE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            The Trust & Identity Layer for African Business Payments
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Mobira orchestrates business disbursements and collections over existing telecom and bank rails with pre-flight anti-fraud subscriber verification.
          </p>

          {/* Proposition Tag */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-extrabold text-white">
              PAY
            </span>
            <span className="text-yellow-400 font-bold">•</span>
            <span className="px-3 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-extrabold text-white">
              RECEIVE
            </span>
            <span className="text-yellow-400 font-bold">•</span>
            <span className="px-3 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-extrabold text-white">
              VERIFY
            </span>
            <span className="text-yellow-400 font-bold">•</span>
            <span className="px-3 py-1 rounded-lg bg-navy-900 border border-navy-800 text-xs font-extrabold text-white">
              GROW
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 font-black">
                Explore Demo Platform <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-navy-800 bg-navy-900 hover:bg-navy-850">
                Test Anti-Fraud Check
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* PAY */}
          <Card className="p-6 bg-navy-900 border border-navy-800 text-white">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 text-yellow-400 flex items-center justify-center mb-4">
              <Send className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">1. PAY</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Disburse supplier settlements and bulk employee payroll across MTN Mobile Money, Orange Money, and Bank EFT with maker-checker governance.
            </p>
            <Link href="/payments" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:underline">
              View Payout Rails &rarr;
            </Link>
          </Card>

          {/* RECEIVE */}
          <Card className="p-6 bg-navy-900 border border-navy-800 text-white">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 text-yellow-400 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">2. RECEIVE</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generate branded payment links and dynamic QR codes displaying verified legal identity that prompt customers via native USSD STK pushes.
            </p>
            <Link href="/receive" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:underline">
              Create QR Links &rarr;
            </Link>
          </Card>

          {/* VERIFY */}
          <Card className="p-6 bg-navy-900 border border-navy-800 text-white">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 text-yellow-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">3. VERIFY</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Run real-time pre-flight name matching against telecommunications subscriber registries to eliminate ghost vendors and wrong-number fraud.
            </p>
            <Link href="/verify" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:underline">
              Test Pre-Flight &rarr;
            </Link>
          </Card>

          {/* GROW */}
          <Card className="p-6 bg-navy-900 border border-navy-800 text-white">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-800 text-yellow-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">4. GROW</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Turn clean payment transparency and verified compliance into an authoritative Mobira Trust Score (0-100) that unlocks trade credit.
            </p>
            <Link href="/analytics" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:underline">
              Trust Score Breakdown &rarr;
            </Link>
          </Card>
        </div>

        {/* Competition Positioning Box */}
        <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">
            Important Competition Disclaimer
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mobira is <strong>NOT a bank, NOT a wallet, and NOT a replacement for MoMo or banks</strong>. Mobira operates as an orchestration and trust layer on top of existing financial infrastructure.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-850 px-6 py-6 text-center text-xs text-slate-500">
        <p>Mobira Technologies • African Fintech Prototype • Built with PostgreSQL & Next.js</p>
      </footer>
    </div>
  );
}

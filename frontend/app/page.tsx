'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Play,
  Lock,
  Send,
  QrCode,
  Zap,
  Star,
  Check,
  TrendingUp,
  Award,
  X,
  Sparkles,
  Unlock,
  KeyRound,
  Mail,
  LogOut,
  ChevronRight,
  Shield,
  Layers,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { RecipientBusinessVerificationDemo } from '@/components/verification/RecipientBusinessVerificationDemo';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, login, demoLogin, logout, isLoading } = useAuth();

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [modalTargetFeature, setModalTargetFeature] = useState<string>('Enterprise Suite');

  // Sign-In Form State
  const [email, setEmail] = useState('mobira@gmail.com');
  const [password, setPassword] = useState('mobira123');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Auto-scroll to hash if present after login
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, [isAuthenticated]);

  const handleProtectedAction = (destinationUrl: string, featureLabel?: string) => {
    if (isAuthenticated) {
      if (destinationUrl.startsWith('#')) {
        const el = document.getElementById(destinationUrl.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (destinationUrl.startsWith('/#')) {
        const el = document.getElementById(destinationUrl.replace('/#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(destinationUrl);
      }
    } else {
      // Scroll to sign in box or open modal
      setModalTargetFeature(featureLabel || 'Enterprise Feature');
      setIsUnlockModalOpen(true);
    }
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    try {
      await login(email, password);
      setIsUnlockModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid credentials. Use mobira@gmail.com and password mobira123');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setAuthError('');
    setIsAuthenticating(true);
    try {
      await demoLogin('mobira@gmail.com');
      setIsUnlockModalOpen(false);
    } catch (err: any) {
      setAuthError('Authentication error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131B24] text-slate-100 font-sans selection:bg-[#A3E635] selection:text-[#0F172A] overflow-x-hidden">
      {/* ========================================================================= */}
      {/* A. NAVIGATION HEADER                                                      */}
      {/* ========================================================================= */}
      <header className="border-b border-[#1E293B]/80 bg-[#131B24]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Tag */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#A3E635] text-[#0F172A] font-black flex items-center justify-center text-lg shadow-lg shadow-[#A3E635]/25 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-white tracking-tight">MOBIRA</span>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40 tracking-wider">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[9px] text-[#A3E635] font-bold block uppercase tracking-widest leading-none">
                TRUST & PAYMENT ORCHESTRATION
              </span>
            </div>
          </Link>

          {/* Navigation Menu Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <Link href="/" className="text-[#A3E635] hover:text-[#A3E635] transition-colors">
              Home
            </Link>
            <button
              type="button"
              onClick={() => handleProtectedAction('/#about', 'About Mobira')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>About</span>
              {!isAuthenticated && <Lock className="w-3 h-3 text-amber-400/80" />}
            </button>
            <button
              type="button"
              onClick={() => handleProtectedAction('/#features', 'Features Suite')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Features</span>
              {!isAuthenticated && <Lock className="w-3 h-3 text-amber-400/80" />}
            </button>
            <button
              type="button"
              onClick={() => handleProtectedAction('/verify', 'Pre-Flight Verification')}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Verification</span>
              {isAuthenticated ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
              ) : (
                <Lock className="w-3 h-3 text-amber-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleProtectedAction('/#workbench', 'Interactive Demo')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Live Demo</span>
              {!isAuthenticated && <Lock className="w-3 h-3 text-amber-400/80" />}
            </button>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1E293B] border border-slate-700 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#A3E635]" />
                  <span className="font-mono text-slate-300 truncate max-w-[140px]">{user?.email}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-md shadow-[#A3E635]/25 transition-all duration-150 active:scale-95"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl bg-[#1E293B] border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstantDemoLogin}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-[#A3E635] px-2.5 py-1.5 rounded-lg hover:bg-[#1E293B] transition-colors"
                >
                  <span>Quick Demo Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalTargetFeature('Enterprise Portal');
                    setIsUnlockModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-md shadow-[#A3E635]/25 transition-all duration-150 active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In Required</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* B. HERO SECTION WITH EMBEDDED SIGN-IN GATE                               */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#A3E635]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & Status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] text-xs font-black tracking-wide shadow-sm">
              {isAuthenticated ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                  <span>ENTERPRISE SESSION ACTIVE • ALL FEATURES UNLOCKED</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">SIGN IN REQUIRED TO USE PLATFORM</span>
                </>
              )}
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              The Trust & Identity Layer for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] via-emerald-400 to-teal-300">
                African Business Payments
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Mobira orchestrates corporate disbursements and receivables across mobile money networks
              and commercial banks with pre-flight identity matching and automated maker-checker governance.
            </p>

            {/* Feature Taglines */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {['PAY', 'RECEIVE', 'VERIFY', 'GROW'].map((item, idx) => (
                <React.Fragment key={item}>
                  <button
                    type="button"
                    onClick={() =>
                      handleProtectedAction(
                        item === 'PAY'
                          ? '/payments'
                          : item === 'RECEIVE'
                          ? '/receive'
                          : item === 'VERIFY'
                          ? '/verify'
                          : '/analytics',
                        item
                      )
                    }
                    className="px-3.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700/80 text-xs font-black text-white shadow-sm hover:border-[#A3E635]/50 flex items-center gap-1.5 transition-colors"
                  >
                    <span>{item}</span>
                    {!isAuthenticated && <Lock className="w-3 h-3 text-slate-500" />}
                  </button>
                  {idx < 3 && <span className="text-[#A3E635] font-bold">•</span>}
                </React.Fragment>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                type="button"
                onClick={() => handleProtectedAction('/dashboard', 'Executive Dashboard')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] shadow-xl shadow-[#A3E635]/20 transition-all duration-150 active:scale-95"
              >
                {isAuthenticated ? (
                  <>
                    <span>Open Business Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In & Open Dashboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    setIsVideoModalOpen(true);
                  } else {
                    setModalTargetFeature('Pre-Flight Simulation');
                    setIsUnlockModalOpen(true);
                  }
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#1E293B] text-white border border-slate-700 hover:border-[#A3E635]/60 hover:bg-[#283548] transition-all duration-150 shadow-md active:scale-95 group"
              >
                <div className="w-6 h-6 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isAuthenticated ? (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  ) : (
                    <Lock className="w-3 h-3 text-amber-400" />
                  )}
                </div>
                <span>{isAuthenticated ? 'Test Pre-Flight Verification' : 'Unlock Verification Engine'}</span>
              </button>
            </div>

            {/* Ratings & Social Proof */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-[#1E293B]">
              <div className="flex items-center -space-x-2.5">
                {[
                  { name: 'Kwame', bg: 'bg-emerald-600', text: 'KA' },
                  { name: 'Ama', bg: 'bg-amber-600', text: 'AM' },
                  { name: 'Efua', bg: 'bg-blue-600', text: 'ED' },
                  { name: 'Kofi', bg: 'bg-purple-600', text: 'KB' },
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full ${avatar.bg} border-2 border-[#131B24] text-white font-black text-xs flex items-center justify-center shadow-md`}
                    title={avatar.name}
                  >
                    {avatar.text}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#A3E635] text-[#A3E635]" />
                  ))}
                  <span className="text-xs font-black text-white ml-1.5">4.9/5</span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Trusted by 1,200+ Verified African Enterprises & FinTechs
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: ANIMATED CORPORATE BUSINESS SHOWCASE */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg rounded-3xl bg-[#18222D] border-2 border-[#A3E635]/60 shadow-2xl p-4 sm:p-5 relative overflow-hidden group"
              >
                {/* Main Animated Corporate Business Image Container */}
                <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0F172A]">
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/images/corporate_boardroom.jpg')` }}
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

                  {/* Animated Data Rail Lines Pulse */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A]/90 border border-[#A3E635]/50 backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                    <span className="text-[10px] font-black text-[#A3E635] tracking-wider font-mono">
                      LIVE RAILS CONNECTED
                    </span>
                  </div>

                  {/* Top Left Verified Corporate Badge */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-[#0F172A]/90 border border-slate-700 backdrop-blur-md shadow-xl flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white leading-tight">Verified Business</p>
                      <p className="text-[8px] text-slate-300 font-mono">ID: 700235 • Ghana Reg</p>
                    </div>
                  </motion.div>

                  {/* Bottom Overlay: Sign In Required Banner */}
                  <div className="absolute bottom-3 inset-x-3 z-10 p-3 rounded-2xl bg-[#0F172A]/95 border border-[#A3E635]/40 backdrop-blur-md space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-black text-white">Sign In Required</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#A3E635] bg-[#A3E635]/15 px-2 py-0.5 rounded border border-[#A3E635]/30">
                        mobira@gmail.com
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleInstantDemoLogin}
                        disabled={isAuthenticating}
                        className="py-2 px-3 rounded-xl bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#A3E635]/25 active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ 1-Click Sign In</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setModalTargetFeature('Enterprise Suite');
                          setIsUnlockModalOpen(true);
                        }}
                        className="py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#283548] border border-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span>Enter Password</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Credentials Note */}
                <div className="flex items-center justify-between pt-3 px-1 text-[11px] text-slate-400 font-mono">
                  <span>Demo: <strong className="text-white">mobira@gmail.com</strong></span>
                  <span>Pass: <strong className="text-[#A3E635]">mobira123</strong></span>
                </div>
              </motion.div>
            ) : (
              /* Live Visual Showcase when Authenticated */
              <div className="relative w-full max-w-[380px] h-[500px] flex items-center justify-center">
                {/* Foreground Active Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: [0, -10, 0] }}
                  transition={{ y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }, opacity: { duration: 0.8 } }}
                  className="relative z-10 w-[280px] h-[480px] rounded-[40px] bg-[#0F172A] border-[7px] border-slate-700 shadow-2xl p-4 overflow-hidden flex flex-col justify-between"
                >
                  <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-[#A3E635] text-[#0F172A] font-black flex items-center justify-center text-[9px]">
                          M
                        </div>
                        <span className="font-bold text-white">ABC Tech Ltd</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-[#A3E635]/20 text-[#A3E635] font-black text-[8px]">
                        VERIFIED
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-slate-700 text-left space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Net Available Liquidity
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black text-white font-mono tracking-tight">
                          $1,543.00
                        </span>
                        <span className="text-[10px] font-bold text-[#A3E635] flex items-center">
                          <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400">MTN MoMo • GCB Bank Treasury</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <Link
                        href="/payments"
                        className="p-1.5 rounded-xl bg-[#1E293B] border border-slate-800 text-[9px] font-bold text-slate-200 hover:border-[#A3E635]/40"
                      >
                        <Send className="w-3.5 h-3.5 text-[#A3E635] mx-auto mb-0.5" />
                        PAY
                      </Link>
                      <Link
                        href="/receive"
                        className="p-1.5 rounded-xl bg-[#1E293B] border border-slate-800 text-[9px] font-bold text-slate-200 hover:border-[#A3E635]/40"
                      >
                        <QrCode className="w-3.5 h-3.5 text-sky-400 mx-auto mb-0.5" />
                        RECEIVE
                      </Link>
                      <Link
                        href="/verify"
                        className="p-1.5 rounded-xl bg-[#1E293B] border border-slate-800 text-[9px] font-bold text-slate-200 hover:border-[#A3E635]/40"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635] mx-auto mb-0.5" />
                        VERIFY
                      </Link>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                        Recent Activity
                      </span>
                      <div className="p-2 rounded-xl bg-[#1E293B]/60 border border-slate-800/80 flex items-center justify-between text-left">
                        <div>
                          <p className="text-[10px] font-bold text-white">Kwame Mensah</p>
                          <p className="text-[8px] text-slate-400">MTN MoMo • Payroll</p>
                        </div>
                        <span className="text-[10px] font-black text-white font-mono">-GH₵3,000</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#1E293B]/60 border border-slate-800/80 flex items-center justify-between text-left">
                        <div>
                          <p className="text-[10px] font-bold text-white">Volta IT Systems</p>
                          <p className="text-[8px] text-slate-400">GCB EFT • Vendor</p>
                        </div>
                        <span className="text-[10px] font-black text-white font-mono">-GH₵1,750</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
                </motion.div>

                {/* Floating Status Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -bottom-4 -left-2 z-20 p-3 rounded-2xl bg-[#1E293B]/95 border-2 border-[#A3E635]/60 shadow-2xl backdrop-blur-md flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-xs font-black text-white block">Enterprise Active</span>
                    <span className="text-[10px] text-[#A3E635] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
                      100% Unlocked
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* C. FLOATING CARDS & HOW IT WORKS ROW (#about)                             */}
      {/* ========================================================================= */}
      <section id="about" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Media Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => handleProtectedAction('/verify', 'Pre-Flight Verification')}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[360px] group cursor-pointer border border-[#1E293B] shadow-xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url('/images/corporate_business.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-left">
              <div className="flex items-center justify-between">
                <div className="self-start px-3 py-1 rounded-full bg-[#A3E635] text-[#0F172A] text-xs font-black uppercase tracking-wider shadow-md">
                  Live Overview
                </div>
                {!isAuthenticated && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm">
                    <Lock className="w-3 h-3" /> SIGN IN TO ACCESS
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center shadow-lg shadow-[#A3E635]/30 group-hover:scale-110 transition-transform">
                  {isAuthenticated ? (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  ) : (
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    How Pre-Flight Verification Works
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {isAuthenticated
                      ? 'Watch how Mobira queries live carrier registries to eliminate ghost payroll payees.'
                      : 'Sign in required to unlock live subscriber match simulation.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Card: Dark Slate Container with 3 Mini-Feature Columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#A3E635] tracking-widest block">
                    ENTERPRISE ARCHITECTURE
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Engineered for High-Volume Corporate Rails
                  </h3>
                </div>
                <Award className="w-6 h-6 text-[#A3E635]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                {/* 1. Disbursement Engine */}
                <div
                  onClick={() => handleProtectedAction('/payments', 'Disbursement Engine')}
                  className="p-4 rounded-2xl bg-[#131B24]/90 border border-slate-800 space-y-2.5 hover:border-[#A3E635]/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <Send className="w-4 h-4" />
                    </div>
                    {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <h4 className="font-extrabold text-sm text-white">Disbursement Engine</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated bulk salary and supplier payouts across MTN MoMo and Bank EFT with dual-auth.
                  </p>
                </div>

                {/* 2. Anti-Fraud Intelligence */}
                <div
                  onClick={() => handleProtectedAction('/verify', 'Anti-Fraud Intelligence')}
                  className="p-4 rounded-2xl bg-[#131B24]/90 border border-slate-800 space-y-2.5 hover:border-[#A3E635]/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <h4 className="font-extrabold text-sm text-white">Anti-Fraud Intelligence</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real-time subscriber name enquiries eradicate wrong-number losses before funds leave.
                  </p>
                </div>

                {/* 3. Trust Score Metrics */}
                <div
                  onClick={() => handleProtectedAction('/analytics', 'Trust Score Metrics')}
                  className="p-4 rounded-2xl bg-[#131B24]/90 border border-slate-800 space-y-2.5 hover:border-[#A3E635]/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <h4 className="font-extrabold text-sm text-white">Trust Score Metrics</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Convert verified transaction histories into an authoritative score (0-100) for trade financing.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-700/80 mt-6">
              <span className="text-xs text-slate-300 font-medium">
                Compliant with Bank of Ghana & CEMAC FinTech frameworks.
              </span>
              <button
                type="button"
                onClick={() => handleProtectedAction('/verify', 'Verification Workbench')}
                className="text-xs font-bold text-[#A3E635] hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Live Verification Workbench</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* D. CORE PILLARS SECTION (#features)                                       */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 bg-[#F8FAFC] text-[#0F172A] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-[#84CC16]/20 text-[#4D7C0F] text-xs font-black uppercase tracking-wider">
              Complete Payment & Trust Suite
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F172A]">
              Financial Services To Grow And Secure Your Wealth
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Everything you need to orchestrate business payments across mobile money and commercial banks.
            </p>
          </div>

          {/* 4 Feature Cards (PAY, RECEIVE, VERIFY, GROW) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1: PAY */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleProtectedAction('/payments', 'Disbursement Engine (PAY)')}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between group relative cursor-pointer"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0a67e55722c6?auto=format&fit=crop&q=80&w=600')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  {isAuthenticated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-white font-black text-base">1. PAY</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Disburse bulk salaries and vendor settlements across MTN Mobile Money, Vodafone Cash, and
                  Bank EFT with dual-approval maker-checker governance.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#65A30D] hover:text-[#4D7C0F] pt-2 text-left">
                  {isAuthenticated ? (
                    <>
                      <span>Open Disbursement Engine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Access Engine</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 2: RECEIVE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => handleProtectedAction('/receive', 'Payment Links & QR (RECEIVE)')}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between group relative cursor-pointer"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=600')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  {isAuthenticated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span className="text-white font-black text-base">2. RECEIVE</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate branded payment links and dynamic QR codes that display verified corporate identity
                  and trigger seamless customer USSD mobile push prompts.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#65A30D] hover:text-[#4D7C0F] pt-2 text-left">
                  {isAuthenticated ? (
                    <>
                      <span>Open Payment Links & QR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Access Links</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 3: VERIFY */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => handleProtectedAction('/verify', 'Anti-Fraud Workbench (VERIFY)')}
              className="rounded-3xl bg-white border-2 border-[#84CC16]/60 shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between group relative cursor-pointer"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  {isAuthenticated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-white font-black text-base">3. VERIFY</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-lime-50/40">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Execute pre-flight name matching against telecom subscriber registries and corporate registers
                  to eradicate ghost payees and wrong-number errors.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#4D7C0F] hover:underline pt-2 text-left">
                  {isAuthenticated ? (
                    <>
                      <span>Open Anti-Fraud Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Access Verify</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 4: GROW */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              onClick={() => handleProtectedAction('/analytics', 'Trust Score Metrics (GROW)')}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between group relative cursor-pointer"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  {isAuthenticated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      ✓ UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 backdrop-blur-sm">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-black">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-white font-black text-base">4. GROW</span>
                </div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Convert verified payment histories into an authoritative Mobira Trust Score (0-100) to build
                  institutional credibility and unlock trade financing.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#65A30D] hover:text-[#4D7C0F] pt-2 text-left">
                  {isAuthenticated ? (
                    <>
                      <span>Open Trust Score Analytics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Access Analytics</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* E. LIVE INTERACTIVE RECIPIENT & BUSINESS VERIFICATION WORKBENCH            */}
      {/* ========================================================================= */}
      <section id="workbench" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE VERIFICATION WORKBENCH</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Test Recipient & Verified Business Identity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Try looking up Business ID <code className="text-[#A3E635] bg-[#1E293B] px-1.5 py-0.5 rounded font-mono">700235</code> or testing recipient mobile numbers.
          </p>
        </div>

        {/* Interactive Demo with Direct Sign In Gate */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#18222D]/90 p-4 sm:p-6 shadow-2xl">
          {!isAuthenticated && (
            <div className="absolute inset-0 z-30 bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
              <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#18222D] border-2 border-[#A3E635]/40 shadow-2xl space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] flex items-center justify-center mx-auto shadow-lg shadow-[#A3E635]/20">
                  <Lock className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-white">Interactive Workbench Locked</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sign in required to test carrier subscriber lookups and business identity matching.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131B24] border border-slate-800 text-left space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Enterprise Credentials:
                  </span>
                  <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                    <span>Email:</span>
                    <strong className="text-white">mobira@gmail.com</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                    <span>Password:</span>
                    <strong className="text-[#A3E635]">mobira123</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-800">
                    <span>Business ID:</span>
                    <strong className="text-sky-400">700235</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInstantDemoLogin}
                  className="w-full py-3 rounded-xl bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/25 active:scale-95"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Instant Sign In & Unlock Workbench</span>
                </button>
              </div>
            </div>
          )}

          <RecipientBusinessVerificationDemo />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* F. TRUST METRICS & STATISTICS BAR                                         */}
      {/* ========================================================================= */}
      <section className="py-14 bg-[#18222D] border-y border-[#1E293B] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-1"
          >
            <span className="text-3xl sm:text-4xl font-black text-[#A3E635] font-mono">100%</span>
            <p className="text-xs text-slate-300 font-bold">Pre-Flight Identity Check</p>
            <p className="text-[10px] text-slate-500">Zero Wrong-Number Losses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-1"
          >
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">Multi-Rail</span>
            <p className="text-xs text-[#A3E635] font-bold">MoMo & Commercial Banks</p>
            <p className="text-[10px] text-slate-500">MTN, Telecel, GCB & Ecobank</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-1"
          >
            <span className="text-3xl sm:text-4xl font-black text-[#A3E635] font-mono">Dual-Auth</span>
            <p className="text-xs text-slate-300 font-bold">Maker-Checker Governance</p>
            <p className="text-[10px] text-slate-500">Threshold Approval Engine</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-1"
          >
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">Real-Time</span>
            <p className="text-xs text-[#A3E635] font-bold">Audit Trail & Compliance</p>
            <p className="text-[10px] text-slate-500">Sub-second Carrier Verification</p>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* G. SIGN-IN REQUIRED POPUP MODAL (When Clicking any locked feature)          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isUnlockModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#18222D] border-2 border-[#A3E635]/50 p-6 sm:p-7 text-white space-y-5 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/40 text-[#A3E635] flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Sign In Required</h3>
                  <p className="text-xs text-slate-400">Unlock {modalTargetFeature}</p>
                </div>
              </div>

              {/* Demo Credentials Box */}
              <div className="p-3.5 rounded-2xl bg-[#131B24] border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold text-[10px] uppercase tracking-wider">Enterprise Credentials</span>
                  <span className="text-[10px] text-[#A3E635] font-mono font-bold">Preset Ready</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                  <span>Email:</span>
                  <strong className="text-white">mobira@gmail.com</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                  <span>Password:</span>
                  <strong className="text-[#A3E635]">mobira123</strong>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleInlineLogin} className="space-y-3.5">
                {authError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {authError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Enterprise Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mobira@gmail.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#131B24] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#A3E635] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="mobira123"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#131B24] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#A3E635]"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 rounded-xl bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/25 active:scale-95 disabled:opacity-50"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isAuthenticating ? 'Authenticating...' : 'Sign In & Unlock Feature'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantDemoLogin}
                    disabled={isAuthenticating}
                    className="w-full py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span>⚡ 1-Click Sign In (mobira@gmail.com)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* H. PRE-FLIGHT VERIFICATION SIMULATION MODAL (When Authenticated)           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl bg-[#1E293B] border-2 border-[#A3E635]/50 p-6 text-white space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#0F172A] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Pre-Flight Telecom Switch Simulation</h4>
                    <p className="text-[10px] text-slate-400">Live Carrier Name Matching</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Flow Diagram */}
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-[#A3E635] font-bold">
                    <span className="w-5 h-5 rounded-full bg-[#A3E635]/20 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>Finance Officer Initiates Batch Disbursement</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-7">
                    Payroll list with 48 employees is imported into Mobira. Total batch: GH₵142,000.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#131B24] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <span className="w-5 h-5 rounded-full bg-sky-400/20 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>Pre-Flight Telecom Switch Enquiry</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-7">
                    Mobira queries MTN MoMo & Telecel subscriber registries in parallel to verify registered names.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#131B24] border border-[#A3E635]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#A3E635] font-bold">
                    <span className="w-5 h-5 rounded-full bg-[#A3E635] text-[#0F172A] flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>100% Identity Match Confirmed → Rail Dispatch</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-7">
                    Ghost payees and wrong digits are flagged before execution, ensuring 0% loss.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold transition-all text-slate-300"
                >
                  Close
                </button>
                <Link
                  href="/verify"
                  className="w-1/2 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-[#0F172A] bg-[#A3E635] hover:bg-[#84CC16] shadow-lg shadow-[#A3E635]/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Open Full Verification Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* I. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer id="contact" className="border-t border-[#1E293B] bg-[#0F172A] px-4 sm:px-6 lg:px-8 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#A3E635] text-[#0F172A] font-black text-sm flex items-center justify-center">
                  M
                </div>
                <span className="font-black text-base text-white">Mobira Technologies</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md">
                African Business Payment & Trust Orchestration Platform. Enabling verified B2B transactions across mobile money and commercial banking networks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-300">
              <button
                type="button"
                onClick={() => handleProtectedAction('/dashboard', 'Executive Dashboard')}
                className="hover:text-[#A3E635] transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleProtectedAction('/payments', 'Disbursements')}
                className="hover:text-[#A3E635] transition-colors"
              >
                Disbursements (PAY)
              </button>
              <button
                type="button"
                onClick={() => handleProtectedAction('/receive', 'Payment Links')}
                className="hover:text-[#A3E635] transition-colors"
              >
                Receive & Links
              </button>
              <button
                type="button"
                onClick={() => handleProtectedAction('/verify', 'Pre-Flight Verify')}
                className="hover:text-[#A3E635] transition-colors"
              >
                Pre-Flight Verify
              </button>
              <button
                type="button"
                onClick={() => handleProtectedAction('/analytics', 'Trust Scores')}
                className="hover:text-[#A3E635] transition-colors"
              >
                Trust Scores
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 Mobira. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Security & Encryption Standard: TLS 1.3 + AES-256</span>
              <span>•</span>
              <span className="text-[#A3E635] font-bold">100% Pre-Flight Identity Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

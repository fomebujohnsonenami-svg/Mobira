'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/services/api';

const CATEGORIES = [
  'Technology & Software',
  'Agribusiness & Export',
  'Logistics & Freight',
  'Retail & Wholesale',
  'Financial Services & Fintech',
  'Manufacturing & Industrial',
  'Healthcare & Pharmaceuticals',
  'Education & Training',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [businessName, setBusinessName] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1-Click Competition Judge Preset
  const handleLoadExample = () => {
    setBusinessName('ABC Technologies Ltd');
    setBusinessId('PP-ABC-001');
    setRegistrationNumber('CS123452021');
    setCategory('Technology & Software');
    setPhone('+233 24 123 4567');
    setEmail('info@abctechnologies.com');
    setLocation('Accra, Ghana');
    setAddress('14 Independence Avenue, Ridge, Accra');
    setLogoUrl('/logo.svg');
    setDescription(
      'Leading provider of enterprise financial orchestration, cloud infrastructure, and verified B2B identity rails across West and Central Africa.'
    );

    toast({
      type: 'info',
      title: 'Example Data Loaded',
      message: 'Populated with ABC Technologies Ltd (PP-ABC-001) competition profile.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !businessId || !registrationNumber) {
      toast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide Business name, Business ID, and Registration number.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.onboardBusiness({
        name: businessName,
        trade_name: businessName,
        business_id: businessId,
        registration_number: registrationNumber,
        category,
        sector: category,
        phone,
        email,
        location,
        address,
        logo_url: logoUrl || '/logo.svg',
        description,
        country: location.split(',')[1]?.trim() || 'Ghana',
        city: location.split(',')[0]?.trim() || 'Accra',
      });

      toast({
        type: 'success',
        title: 'Business Onboarding Complete',
        message: `${businessName} has been verified and registered on Mobira network.`,
      });

      // Route directly to public-facing business profile
      router.push(`/business/${businessId}`);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Onboarding Error',
        message: err.message || 'Could not complete onboarding.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 selection:bg-yellow-500 selection:text-navy-950">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-navy-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs uppercase font-bold text-yellow-600 dark:text-yellow-400 tracking-wider">
                Enterprise Onboarding & Trade Profile
              </span>
            </div>
            <h1 className="text-2xl font-black text-navy-950 dark:text-white tracking-tight mt-1">
              Register & Verify Your Business
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Establish institutional trust, verify company identity, and enable multi-rail settlements.
            </p>
          </div>

          {/* Quick Demo Pre-fill Action */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadExample}
            className="gap-2 shrink-0 border-yellow-500/50 bg-yellow-50 dark:bg-navy-900 text-navy-950 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-navy-850 font-bold text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Load Example: ABC Technologies Ltd</span>
          </Button>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Legal Entity & Registration */}
          <Card className="p-6 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-navy-900 text-yellow-400 font-black text-xs flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-navy-950 dark:text-slate-100">
                    Legal Entity & Identification
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Official registry identifiers for national KYB verification
                  </p>
                </div>
              </div>
              <Badge variant="blue">National Registry</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Name *"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. ABC Technologies Ltd"
                required
              />

              <Input
                label="Business ID *"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                placeholder="e.g. PP-ABC-001"
                helperText="Assigned public enterprise handle"
                required
              />

              <Input
                label="Registration Number *"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. CS123452021 or RC/DLA/2021/B/8921"
                required
              />

              <Select
                label="Business Category *"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </div>
          </Card>

          {/* Section 2: Contact & Location */}
          <Card className="p-6 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-navy-900 text-yellow-400 font-black text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-navy-950 dark:text-slate-100">
                    Operating Location & Corporate Contact
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Physical domicile and direct operational contact
                  </p>
                </div>
              </div>
              <Badge variant="slate">Verified Domicile</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location (City, Country) *"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Accra, Ghana"
                required
              />

              <Input
                label="Official Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. info@abctechnologies.com"
                required
              />

              <Input
                label="Corporate Phone Number *"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +233 24 123 4567"
                required
              />

              <Input
                label="Physical Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Independence Avenue, Ridge, Accra"
                required
              />
            </div>
          </Card>

          {/* Section 3: Brand & Public Profile Overview */}
          <Card className="p-6 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-navy-900 text-yellow-400 font-black text-xs flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-navy-950 dark:text-slate-100">
                    Company Description & Brand Logo
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Displayed on your public profile and customer checkout links
                  </p>
                </div>
              </div>
              <Badge variant="gold">Public Identity</Badge>
            </div>

            <div className="space-y-4">
              <Input
                label="Company Logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="e.g. https://abctechnologies.com/logo.svg"
                helperText="Link to company logo or mark"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of commercial activities, services, and trade focus..."
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-xs text-navy-950 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors shadow-subtle"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="gap-2 font-black px-6 py-2.5 text-xs shadow-elevated"
              >
                <span>Save & View Public Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

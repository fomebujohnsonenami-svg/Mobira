'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business } from '@/types';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { VerificationSuccessModal } from '@/components/verification/VerificationSuccessModal';

export type VerificationState = 'UNVERIFIED' | 'IN_PROGRESS' | 'VERIFIED';

interface BusinessContextType {
  currentBusiness: Business;
  availableBusinesses: Business[];
  switchBusiness: (business: Business) => void;
  resetDemo: () => void;
  isDemoMode: boolean;
  verificationStatus: VerificationState;
  setVerificationStatus: (status: VerificationState) => void;
  startVerification: () => Promise<void>;
  closeSuccessModal: () => void;
  resetVerification: () => void;
  isSuccessModalOpen: boolean;
}

const DEFAULT_BUSINESS: Business = {
  id: '87b3221e-12cd-4f51-93e1-7e87ab09c450',
  name: 'ABC Technologies Ltd',
  trade_name: 'ABC Technologies',
  business_id: 'PP-ABC-001',
  legal_form: 'LTD',
  registration_number: 'CS123452021',
  tax_number: 'M092114829104A',
  category: 'Technology & Software',
  sector: 'Technology & Software',
  country: 'Ghana',
  city: 'Accra',
  location: 'Accra, Ghana',
  address: '14 Independence Avenue, Ridge, Accra',
  phone: '+233 24 123 4567',
  email: 'info@abctechnologies.com',
  website: 'https://abctechnologies.com',
  logo_url: '/logo.svg',
  description:
    'Leading provider of enterprise financial orchestration, cloud infrastructure, and verified B2B identity rails across West and Central Africa.',
  verification_tier: 'GOLD_VERIFIED',
  trust_score: 96,
  is_active: true,
  daily_payment_limit: 15000000,
  daily_limit_xaf: 15000000,
  primary_momo_number: '+233241234567',
  primary_bank_account: 'GH2110005000010012345678901',
  created_at: '2021-04-12T08:00:00Z',
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentBusiness, setCurrentBusiness] = useState<Business>(DEFAULT_BUSINESS);
  const [availableBusinesses, setAvailableBusinesses] = useState<Business[]>([DEFAULT_BUSINESS]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Verification Lifecycle: UNVERIFIED -> IN_PROGRESS -> VERIFIED
  const [verificationStatus, setVerificationStatus] = useState<VerificationState>('VERIFIED');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  useEffect(() => {
    api.getBusinesses().then((bizList) => {
      if (bizList && bizList.length > 0) {
        setAvailableBusinesses(bizList);
        const abc = bizList.find((b) => b.name.includes('ABC Technologies')) || bizList[0];
        setCurrentBusiness(abc);
      }
    });
  }, []);

  const switchBusiness = (business: Business) => {
    setCurrentBusiness(business);
    toast({
      type: 'info',
      title: 'Active Entity Switched',
      message: `Now operating as ${business.name}`,
    });
  };

  const startVerification = async () => {
    setVerificationStatus('IN_PROGRESS');
    toast({
      type: 'info',
      title: 'Verification in Progress',
      message: `Verifying ${currentBusiness.name} against National Registrar & Telecom KYC...`,
    });

    // Simulate verification check
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Verification succeeds -> Display the Polished Success Modal!
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setVerificationStatus('VERIFIED');
    toast({
      type: 'success',
      title: 'Verification Complete',
      message: `${currentBusiness.name} is now a Verified Business. Blue verified badge active.`,
    });
  };

  const resetVerification = () => {
    setVerificationStatus('UNVERIFIED');
    toast({
      type: 'info',
      title: 'Verification State Reset',
      message: 'Status set to: Verification Required (Ready for live demonstration).',
    });
  };

  const resetDemo = async () => {
    try {
      await api.resetDemo();
    } catch (err) {
      console.warn('Backend reset call fallback:', err);
    }
    setCurrentBusiness(DEFAULT_BUSINESS);
    setVerificationStatus('VERIFIED');
    toast({
      type: 'success',
      title: 'Demo Environment Reset',
      message: 'All businesses, verification states, payment lists, beneficiaries, transactions, balances, and payment links reset to seed data.',
    });
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <BusinessContext.Provider
      value={{
        currentBusiness,
        availableBusinesses,
        switchBusiness,
        resetDemo,
        isDemoMode,
        verificationStatus,
        setVerificationStatus,
        startVerification,
        closeSuccessModal,
        resetVerification,
        isSuccessModalOpen,
      }}
    >
      {children}
      {/* Global Verification Success Modal */}
      <VerificationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        businessName={currentBusiness.name}
      />
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

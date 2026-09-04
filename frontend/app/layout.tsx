import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/components/auth/AuthContext';
import { BusinessProvider } from '@/components/layout/BusinessContext';
import { TrustBanner } from '@/components/layout/TrustBanner';

import { NotificationProvider } from '@/components/notifications/NotificationContext';

export const metadata: Metadata = {
  title: 'Mobira — Trusted Business Payment & Identity Platform',
  description: 'PAY • RECEIVE • VERIFY • GROW. Built on existing payment rails. NOT a bank, NOT a wallet.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <BusinessProvider>
              <NotificationProvider>
                <TrustBanner />
                {children}
              </NotificationProvider>
            </BusinessProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

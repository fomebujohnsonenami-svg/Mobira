import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/components/auth/AuthContext';
import { BusinessProvider } from '@/components/layout/BusinessContext';
import { NotificationProvider } from '@/components/notifications/NotificationContext';

export const metadata: Metadata = {
  title: 'Mobira — African Business Payment & Trust Orchestration Platform',
  description: 'Enterprise multi-rail disbursements, collections, and verified pre-flight identity for African businesses.',
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
                {children}
              </NotificationProvider>
            </BusinessProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

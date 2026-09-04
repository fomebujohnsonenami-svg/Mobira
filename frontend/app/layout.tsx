import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/components/auth/AuthContext';
import { BusinessProvider } from '@/components/layout/BusinessContext';
import { NotificationProvider } from '@/components/notifications/NotificationContext';
import { PrivacyProvider } from '@/components/privacy/PrivacyContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('mobira-theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <BusinessProvider>
                <NotificationProvider>
                  <PrivacyProvider>
                    {children}
                  </PrivacyProvider>
                </NotificationProvider>
              </BusinessProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

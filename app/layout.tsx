
import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ExtendedThemeProvider } from '@/contexts/extended-theme-context';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/auth-context';
import { NotificationProvider } from '@/contexts/notification-context';
import ClientNotificationWrapper from '@/components/client-notification-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduFlow - Learn Without Limits',
  description: 'Join thousands of learners in our comprehensive online learning platform. Master new skills with expert instructors and interactive courses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="eduflow-theme"
        >
          <ExtendedThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <ClientNotificationWrapper>
                  {children}
                </ClientNotificationWrapper>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </NotificationProvider>
            </AuthProvider>
          </ExtendedThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

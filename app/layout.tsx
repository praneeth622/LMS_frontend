
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/auth-context';
import { NotificationProvider } from '@/contexts/notification-context';
import dynamic from 'next/dynamic';

// Dynamically import the client-only component
const NotificationWrapper = dynamic(() => import('@/contexts/NotificationWrapper'), {
  ssr: false,
})

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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
              <NotificationWrapper>
                {children}
              </NotificationWrapper>
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
        </ThemeProvider>
      </body>
    </html>
  );
}

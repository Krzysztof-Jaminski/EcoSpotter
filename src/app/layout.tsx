import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth-provider';
import { cn } from '@/lib/utils';
import { Figtree, Lexend } from 'next/font/google';

const fontBody = Figtree({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const fontHeadline = Lexend({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'EcoSpotter - Map The Future',
  description: 'Spot and save the venerable trees of our world in solarpunk style.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased min-h-screen bg-background',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <AuthProvider>
           <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

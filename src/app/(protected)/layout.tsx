'use client';

import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { AiChatWidget } from '@/components/chat/ai-chat-widget';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to the homepage.
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="flex h-16 items-center border-b border-white/10 px-4 md:px-6">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Skeleton className="w-full h-full rounded-lg" />
        </main>
      </div>
    );
  }

  // While redirecting, or if there's no user, don't render children.
  if (!user) {
      return null;
  }

  // If user is authenticated, render the layout.
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <AiChatWidget />
    </div>
  );
}

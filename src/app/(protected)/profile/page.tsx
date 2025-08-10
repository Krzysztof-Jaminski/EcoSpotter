'use client';

import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page now acts as a redirect to the user's specific profile page.
export default function ProfileRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/profile/${user.uid}`);
    }
     if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // Render nothing, or a loading skeleton, while redirecting
  return null; 
}

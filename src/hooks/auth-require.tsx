'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/services/auth-store';

export const useAuthRedirect = ({
  redirectIfFound = false,
  redirectTo = '/dashboard',
}: {
  redirectIfFound?: boolean;
  redirectTo?: string;
}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (redirectIfFound && user) {
      router.push(redirectTo);
    }

    if (!redirectIfFound && !user) {
      router.push('/auth');
    }
  }, [user, hasHydrated, router, redirectIfFound, redirectTo]);

  return { user, hasHydrated };
};
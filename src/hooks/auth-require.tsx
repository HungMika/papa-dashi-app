'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/services/auth-store';

export function useAuthRedirect({ redirectIfFound, redirectTo }: { redirectIfFound: boolean; redirectTo: string }) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let isMounted = true; // để tránh update state sau unmount

    async function checkSession() {
      try {
        let session = null;

        if (typeof window !== 'undefined') {
          try {
            if (window.electronAPI?.getSession) {
              session = await window.electronAPI.getSession();
            }
          } catch (err) {
            console.error('Error accessing window.electronAPI:', err);
          }
        }

        if (!session) {
          try {
            const res = await fetch('/api/session');
            if (res.ok) {
              session = await res.json();
            }
          } catch (err) {
            console.error('Failed to fetch session from API', err);
          }
        }

        if (isMounted) {
          if (session && session.id && session.username && session.email) {
            setUser(session);
            if (redirectIfFound) {
              router.push(redirectTo);
            }
          } else {
            setUser(null);
            if (!redirectIfFound) {
              router.push(redirectTo);
            }
          }
        }
      } finally {
        if (isMounted) {
          setHasChecked(true);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false; // cleanup để tránh memory leak
    };
  }, [redirectIfFound, redirectTo, router, setUser]);

  return { user, hasChecked };
}

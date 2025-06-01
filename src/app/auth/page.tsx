'use client';
import React from 'react';
import { useAuthRedirect } from '@/hooks/auth-require';
import { AuthScreen } from '@/components/auth/auth-screen';

const AuthPage = () => {
  const { user, hasChecked } = useAuthRedirect({
    redirectIfFound: true,
    redirectTo: '/dashboard',
  });

  if (!hasChecked) {
    return null;
  }

  return <AuthScreen />;
};
export default AuthPage;

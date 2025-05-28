'use client';

import React, { useState } from 'react';

import { SignInflow } from '@/services/auth-types';

import { SignInCard } from './sign-in-card';
import { SignUpCard } from './sign-up-card';

export const AuthScreen = () => {
  const [state, setState] = useState<SignInflow>('SignIn');

  return (
    <div className="h-full flex items-center justify-center bg-[#3f99e9]">
      <div className="md:h-auto md:w-[420px]">
        {state === 'SignIn' && <SignInCard setstate={setState} />}
        {state === 'SignUp' && <SignUpCard setstate={setState} />}
      </div>
    </div>
  );
};
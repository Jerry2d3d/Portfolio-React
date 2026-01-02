'use client';

import { Suspense } from 'react';
import { AuthLayout } from '@/layouts';
import LoginForm from '@/components/LoginForm/LoginForm';

function LoginFormWrapper() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthLayout><div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div></AuthLayout>}>
      <LoginFormWrapper />
    </Suspense>
  );
}

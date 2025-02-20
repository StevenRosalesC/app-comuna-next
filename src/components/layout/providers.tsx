'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from '../providers/session-Provider';
import { AuthResponse } from 'types/response';

export default function Providers({
  session,
  children
}: {
  session: AuthResponse | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <SessionProvider initialSession={session}>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
}

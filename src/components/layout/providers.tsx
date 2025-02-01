'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from '../providers/session-Provider';
import { Session } from 'types';

export default function Providers({
  session,
  children
}: {
  session: Session | null;
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

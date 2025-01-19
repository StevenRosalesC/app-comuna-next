'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from '../providers/session-Provider';
import { CustomSession } from 'types';

export default function Providers({
  session,
  children
}: {
  session: CustomSession | null;
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

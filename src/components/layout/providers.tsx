'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from '../providers/session-Provider';
import { AuthResponse } from 'types/response';
import { NeighborhoodsStoreProvider } from '@/hooks/store/useNeighborhoodsStore';
import { PersonsStoreProvider } from '@/hooks/store/usePersonsStore';

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
        <NeighborhoodsStoreProvider>
          <PersonsStoreProvider>
            <SessionProvider initialSession={session}>{children}</SessionProvider>
          </PersonsStoreProvider>
        </NeighborhoodsStoreProvider>
      </ThemeProvider>
    </>
  );
}

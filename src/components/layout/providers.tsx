'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { SessionProvider } from '../providers/session-Provider';
import { AuthResponse } from 'types/response';
import { NeighborhoodsStoreProvider } from '@/hooks/store/useNeighborhoodsStore';
import { PersonsStoreProvider } from '@/hooks/store/usePersonsStore';
import { MembersStoreProvider } from '@/hooks/store/useMembersStore';
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
            <MembersStoreProvider>
              <SessionProvider initialSession={session}>{children}</SessionProvider>
            </MembersStoreProvider>
          </PersonsStoreProvider>
        </NeighborhoodsStoreProvider>
      </ThemeProvider>
    </>
  );
}

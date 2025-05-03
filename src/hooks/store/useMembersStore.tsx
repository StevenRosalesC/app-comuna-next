'use client';

import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createMembersStore, MembersState } from '@/store/membersStore';

export type MembersStoreApi = ReturnType<typeof createMembersStore>;

const MembersStoreContext = createContext<MembersStoreApi | undefined>(undefined);

interface MembersStoreProviderProps {
  children: React.ReactNode;
}

export const MembersStoreProvider = ({ children }: MembersStoreProviderProps) => {
  const storeRef = useRef<MembersStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createMembersStore();
  }
  return (
    <MembersStoreContext.Provider value={storeRef.current}>
      {children}
    </MembersStoreContext.Provider>
  );
};

export function useMembersStore<T>(selector: (state: MembersState) => T): T {
  const context = useContext(MembersStoreContext);
  if (!context) throw new Error('useMembersStore must be used within MembersStoreProvider');
  return useStore(context, selector);
} 
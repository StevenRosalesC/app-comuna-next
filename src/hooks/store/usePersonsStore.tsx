'use client';

import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createPersonsStore, PersonsState } from '@/store/personsStore';

export type PersonsStoreApi = ReturnType<typeof createPersonsStore>;

const PersonsStoreContext = createContext<PersonsStoreApi | undefined>(
  undefined
);

interface PersonsStoreProviderProps {
  children: React.ReactNode;
}

export const PersonsStoreProvider = ({
  children
}: PersonsStoreProviderProps) => {
  const storeRef = useRef<PersonsStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createPersonsStore();
  }
  return (
    <PersonsStoreContext.Provider value={storeRef.current}>
      {children}
    </PersonsStoreContext.Provider>
  );
};

export function usePersonsStore<T>(selector: (state: PersonsState) => T): T {
  const context = useContext(PersonsStoreContext);
  if (!context)
    throw new Error('usePersonsStore must be used within PersonsStoreProvider');
  return useStore(context, selector);
}

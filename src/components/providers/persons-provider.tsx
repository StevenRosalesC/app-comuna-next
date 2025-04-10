'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type PersonsState, createPersonsStore } from '@/store/personsStore'

export type PersonsStoreApi = ReturnType<typeof createPersonsStore>

export const PersonsStoreContext = createContext<PersonsStoreApi | undefined>(
  undefined,
)

export interface PersonsStoreProviderProps {
  children: ReactNode
}

export const PersonsStoreProvider = ({
  children,
}: PersonsStoreProviderProps) => {
  const storeRef = useRef<PersonsStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createPersonsStore()
  }

  return (
    <PersonsStoreContext.Provider value={storeRef.current}>
      {children}
    </PersonsStoreContext.Provider>
  )
}

export const usePersonsStore = <T,>(
  selector: (store: PersonsState) => T,
): T => {
  const personsStoreContext = useContext(PersonsStoreContext)

  if (!personsStoreContext) {
    throw new Error(`usePersonsStore must be used within PersonsStoreProvider`)
  }

  return useStore(personsStoreContext, selector)
}

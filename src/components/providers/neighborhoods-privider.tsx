// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type NeighborhoodsState, createNeighborhoodsStore } from '@/store/neighborhoodsStore'

export type NeighborhoodsStoreApi = ReturnType<typeof createNeighborhoodsStore>

export const NeighborhoodsStoreContext = createContext<NeighborhoodsStoreApi | undefined>(
  undefined,
)

export interface NeighborhoodsStoreProviderProps {
  children: ReactNode
}

export const NeighborhoodsStoreProvider = ({
  children,
}: NeighborhoodsStoreProviderProps) => {
  const storeRef = useRef<NeighborhoodsStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createNeighborhoodsStore()
  }

  return (
    <NeighborhoodsStoreContext.Provider value={storeRef.current}>
      {children}
    </NeighborhoodsStoreContext.Provider>
  )
}

export const useNeighborhoodsStore = <T,>(
  selector: (store: NeighborhoodsState) => T,
): T => {
  const neighborhoodsStoreContext = useContext(NeighborhoodsStoreContext)

  if (!neighborhoodsStoreContext) {
    throw new Error(`useNeighborhoodsStore must be used within NeighborhoodsStoreProvider`)
  }

  return useStore(neighborhoodsStoreContext, selector)
}

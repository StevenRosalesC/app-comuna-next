'use client'

import React, { createContext, useContext, useRef, useEffect } from 'react';
import { useStore } from 'zustand';
import { createNeighborhoodsStore, NeighborhoodsState, Neighborhood } from '@/store/neighborhoodsStore';

export type NeighborhoodsStoreApi = ReturnType<typeof createNeighborhoodsStore>;

const NeighborhoodsStoreContext = createContext<NeighborhoodsStoreApi | undefined>(undefined);

interface NeighborhoodsStoreProviderProps {
  children: React.ReactNode;
}

export const NeighborhoodsStoreProvider = ({ children }: NeighborhoodsStoreProviderProps) => {
  const storeRef = useRef<NeighborhoodsStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createNeighborhoodsStore();
  }
  return (
    <NeighborhoodsStoreContext.Provider value={storeRef.current}>
      {children}
    </NeighborhoodsStoreContext.Provider>
  );
};

// Hook para acceder a cualquier parte del store
export function useNeighborhoodsStore<T>(selector: (state: NeighborhoodsState) => T): T {
  const context = useContext(NeighborhoodsStoreContext);
  if (!context) throw new Error('useNeighborhoodsStore must be used within NeighborhoodsStoreProvider');
  return useStore(context, selector);
}

// Hook para obtener barrios y hacer fetch si no hay
export function useNeighborhoodsList() {
  const neighborhoods = useNeighborhoodsStore((state) => state.neighborhoods);
  const fetchNeighborhoods = useNeighborhoodsStore((state) => state.fetchNeighborhoods);
  const isLoading = useNeighborhoodsStore((state) => state.isLoading);

  useEffect(() => {
    if (neighborhoods.length === 0 && !isLoading) {
      fetchNeighborhoods();
    }
  }, [neighborhoods.length, isLoading, fetchNeighborhoods]);

  return { neighborhoods, isLoading };
}

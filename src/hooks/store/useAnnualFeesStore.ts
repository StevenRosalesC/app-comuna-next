import { create } from 'zustand';

export interface AnnualFee {
  id: number;
  year: number;
  description: string;
  amount: number;
  mandatory: boolean;
}

interface AnnualFeesState {
  annualFees: AnnualFee[];
  addAnnualFee: (fee: Omit<AnnualFee, 'id'>) => void;
  editAnnualFee: (id: number, fee: Omit<AnnualFee, 'id'>) => void;
  deleteAnnualFee: (id: number) => void;
}

export const useAnnualFeesStore = create<AnnualFeesState>((set) => ({
  annualFees: [
    { id: 1, year: 2023, description: 'Cuota ordinaria', amount: 100, mandatory: true },
    { id: 2, year: 2023, description: 'Cuota extraordinaria', amount: 50, mandatory: false },
    { id: 3, year: 2024, description: 'Cuota ordinaria', amount: 120, mandatory: true },
  ],
  addAnnualFee: (fee) => set((state) => ({
    annualFees: [...state.annualFees, { ...fee, id: Date.now() }],
  })),
  editAnnualFee: (id, fee) => set((state) => ({
    annualFees: state.annualFees.map(f => f.id === id ? { ...f, ...fee } : f),
  })),
  deleteAnnualFee: (id) => set((state) => ({
    annualFees: state.annualFees.filter(f => f.id !== id),
  })),
})); 
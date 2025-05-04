import { create } from 'zustand';

export interface Requirement {
  id: number;
  description: string;
  mandatory: boolean;
}

interface RequirementsState {
  requirements: Requirement[];
  addRequirement: (req: Omit<Requirement, 'id'>) => void;
  editRequirement: (id: number, req: Omit<Requirement, 'id'>) => void;
  deleteRequirement: (id: number) => void;
}

export const useRequirementsStore = create<RequirementsState>((set) => ({
  requirements: [
    { id: 1, description: 'Ser mayor de edad', mandatory: true },
    { id: 2, description: 'Residir en la comunidad', mandatory: true },
    { id: 3, description: 'Presentar DNI vigente', mandatory: false },
  ],
  addRequirement: (req) => set((state) => ({
    requirements: [...state.requirements, { ...req, id: Date.now() }],
  })),
  editRequirement: (id, req) => set((state) => ({
    requirements: state.requirements.map(r => r.id === id ? { ...r, ...req } : r),
  })),
  deleteRequirement: (id) => set((state) => ({
    requirements: state.requirements.filter(r => r.id !== id),
  })),
})); 
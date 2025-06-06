import { create } from 'zustand';
import { requirementsService } from '@/services/requirements';
import { Requirement } from '@/interfaces/requirements';



interface RequirementsState {
  requirements: Requirement[];
  loading: boolean;
  error: string | null;
  fetchRequirements: () => Promise<void>;
  addRequirement: (req: Omit<Requirement, 'requirementId'>) => Promise<void>;
  editRequirement: (id: string, req: Omit<Requirement, 'requirementId'>) => Promise<void>;
  deleteRequirement: (id: string) => Promise<void>;
}

export const useRequirementsStore = create<RequirementsState>((set, get) => ({
  requirements: [],
  loading: false,
  error: null,
  fetchRequirements: async () => {
    set({ loading: true, error: null });
    if (get().requirements.length > 0) {
      set({ loading: false });
      return;
    }
    try {
      const data = await requirementsService.list();
      set({ requirements: data, loading: false });
    } catch (e) {
      set({ error: 'Error al cargar requisitos', loading: false });
    }
  },
  addRequirement: async (req: Omit<Requirement, 'requirementId'>) => {
    try {
      const newReq = await requirementsService.create(req);
      set((state) => ({ requirements: [...state.requirements, newReq], loading: false }));
    } catch (e) {
      set({ error: 'Error al añadir requisito', loading: false });
    }
  },
  editRequirement: async (id: string, req: Omit<Requirement, 'requirementId'>) => {
    try {
      const updated = await requirementsService.update(id, req);
      if (updated) {
        set((state) => ({
          requirements: state.requirements.map(r => r.requirementId === id ? updated : r),
          loading: false
        }));
      } else {
        set({ error: 'No se encontró el requisito', loading: false });
      }
    } catch (e) {
      set({ error: 'Error al editar requisito', loading: false });
    }
  },
  deleteRequirement: async (id: string) => {
    try {
      const ok = await requirementsService.remove(id);
      if (ok) {
        set((state) => ({ requirements: state.requirements.filter(r => r.requirementId !== id), loading: false }));
      } else {
        set({ error: 'No se pudo eliminar', loading: false });
      }
    } catch (e) {
      set({ error: 'Error al eliminar requisito', loading: false });
    }
  },
})); 
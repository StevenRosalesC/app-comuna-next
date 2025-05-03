import { createStore } from 'zustand/vanilla';
import { getMembers, createMember, updateMember } from '@/services/members';
import { Member } from '@/interfaces/members';

export interface MembersState {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  count: number;
  fetchMembers: () => Promise<void>;
  addMember: (data: any) => Promise<void>;
  updateMember: (id: string, data: any) => Promise<void>;
}

export const defaultMembersState = (): MembersState => ({
  members: [],
  isLoading: true,
  error: null,
  count: 0,
  fetchMembers: async () => {},
  addMember: async () => {},
  updateMember: async () => {},
});

export const createMembersStore = (initState?: Partial<MembersState>) =>
  createStore<MembersState>((set, get) => ({
    ...defaultMembersState(),
    fetchMembers: async () => {
      try {
        set({ isLoading: true, error: null });
        const data = await getMembers();
        set({ members: data, isLoading: false, count: data.length });
      } catch (error) {
        set({ error: 'Error al cargar los miembros', isLoading: false });
      }
    },
    addMember: async (data: any) => {
      try {
        set({ isLoading: true });
        await createMember(data);
        await get().fetchMembers();
      } catch (error) {
        set({ error: 'Error al crear el miembro', isLoading: false });
      }
    },
    updateMember: async (id: string, data: any) => {
      try {
        set({ isLoading: true });
        await updateMember(id, data);
        await get().fetchMembers();
      } catch (error) {
        set({ error: 'Error al actualizar el miembro', isLoading: false });
      }
    },
    ...initState,
  })); 
import { Requirement } from '@/interfaces/requirements';
import apiCommunity from '@/utils/communityApi';
// Simulación de base de datos local
let requirementsDB: Requirement[] = [
  { requirementId: '1', requirement: 'Ser mayor de edad', observation: '', status: true },
  { requirementId: '2', requirement: 'Residir en la comunidad', observation: '', status: true },
  { requirementId: '3', requirement: 'Presentar DNI vigente', observation: '', status: false },
];

export const requirementsService = {
  async list(): Promise<Requirement[]> {
    const {data:requirements} = await apiCommunity.get<Requirement[]>('/requirements');
    return requirements;
  },
  async create(data: Omit<Requirement, 'requirementId'>): Promise<Requirement> {
    try {
      const {data:newReq} = await apiCommunity.post('/requirements', data);
      return newReq;
    } catch (error) {
      throw new Error('Error al añadir el requisito');
    }
  },
  async update(id: string, data: Omit<Requirement, 'requirementId'>): Promise<Requirement | null> {
    try {
      const {data:updatedReq} = await apiCommunity.patch(`/requirements/${id}`, data);
      return updatedReq;
    } catch (error) {
      throw new Error('Error al actualizar el requisito');
    }
  },
  async remove(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const before = requirementsDB.length;
        requirementsDB = requirementsDB.filter(r => r.requirementId !== id);
        resolve(requirementsDB.length < before);
      }, 300);
    });
  },
}; 
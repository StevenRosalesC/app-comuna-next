import { IPerson, IPersonsRequestResponse, Person } from '@/interfaces/persons';
import apiCommunity from '@/utils/communityApi';
import { ServiceResponse } from '../interfaces/common';

export const personsService = {
  async getPersons(
    limit: number,
    offset: number,
    orderBy?: string,
    order?: string,
    search?: string,
    status?: boolean
  ): Promise<ServiceResponse<IPersonsRequestResponse | null>> {
    try {
      const { data: persons } = await apiCommunity.get<IPersonsRequestResponse>(
        '/persons',
        {
          params: {
            limit,
            offset,
            orderBy,
            order,
            search,
            status
          }
        }
      );
      return {
        data: persons,
        message: 'Personas obtenidas correctamente',
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  async getPersonsPaginated({
    pageParam = 1,
    search = '',
    pageSize = 10
  }): Promise<{ data: Person[]; nextPage?: number }> {
    const offset = (pageParam - 1) * pageSize;
    const { data } = await apiCommunity.get<IPersonsRequestResponse>(
      '/persons',
      {
        params: {
          limit: pageSize,
          offset,
          search
        }
      }
    );
    const total = data?.count || 0;
    const nextPage = offset + pageSize < total ? pageParam + 1 : undefined;
    return {
      data: data?.data || [],
      nextPage
    };
  },

  async createPerson(
    person: IPerson
  ): Promise<ServiceResponse<IPerson | null>> {
    try {
      const { data } = await apiCommunity.post('/persons', person);
      return {
        data: data,
        message: 'Persona creada correctamente',
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  async updatePerson(
    personId: string,
    person: Omit<Person, 'personId'>
  ): Promise<ServiceResponse<Person | null>> {
    try {
      const { data } = await apiCommunity.patch(`/persons/${personId}`, person);
      return {
        data: data,
        message: 'Persona actualizada correctamente',
        status: true
      };
    } catch (error) {
      throw error;
    }
  },

  async getAllWithAllRequirementsApproved({
    limit = 10,
    offset = 0,
    search = ''
  }: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ data: Person[]; count: number }> {
    const { data } = await apiCommunity.get<IPersonsRequestResponse>(
      '/persons/with-all-requirements-approved',
      {
        params: {
          limit,
          offset,
          search
        }
      }
    );
    return {
      data: data.data,
      count: data.count
    };
  }
};

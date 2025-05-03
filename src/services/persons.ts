import { IPerson, IPersonsRequestResponse, Person } from "@/interfaces/persons"
import apiCommunity from "@/utils/communityApi"
import { ServiceResponse } from "../interfaces/common"

export const personsService = {
  async getPersons(limit: number, offset: number,orderBy ?: string, order ?: string, search ?: string) : Promise<ServiceResponse<IPersonsRequestResponse | null>> {
    try {
      const {data:persons} =await apiCommunity.get<IPersonsRequestResponse>("/persons", {
        params: {
          limit,
          offset,
          orderBy,
          order,
          search
        }
      })
      return {
        data: persons,
        message: 'Personas obtenidas correctamente',
        status: true
      }
    } catch (error) {
      return {
        data: null,
        message: 'Error al obtener las personas',
        status: false
      }
    }
  },

  async createPerson(person: IPerson): Promise<ServiceResponse<IPerson | null>> {
    try {
      const { data } = await apiCommunity.post('/persons', person);
      return {
        data: data,
        message: 'Persona creada correctamente',
        status: true
      };
    } catch (error) {
      return {
        data: null,
        message: 'Error al crear la persona',
        status: false
      }
    }
  },

  async updatePerson(personId: string, person: Omit<Person, 'personId'>): Promise<ServiceResponse<Person | null>> {
    try {
      const { data } = await apiCommunity.patch(`/persons/${personId}`, person);
      return {
        data: data,
        message: 'Persona actualizada correctamente',
        status: true
      }
    } catch (error) {
      return {
        data: null,
        message: 'Error al actualizar la persona',
        status: false
      }
    }
  }
}


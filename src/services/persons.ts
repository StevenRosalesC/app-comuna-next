import { IPerson, IPersonsRequestResponse } from "@/interfaces/persons"
import apiCommunity from "@/utils/communityApi"
import { ServiceResponse } from "./common"

export const personsService = {
  async getPersons(limit: number, offset: number,orderBy ?: string, order ?: string, search ?: string) : Promise<IPersonsRequestResponse | null> {
    try {
      const {data} =await apiCommunity.get<IPersonsRequestResponse>("/persons", {
        params: {
          limit,
          offset,
          orderBy,
          order,
          search
        }
      })
      console.log({data})
      return data
    } catch (error) {
      console.log({error})
      return null
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
      console.error('Error al crear la persona:', error); 
      return {
        data: null,
        message: 'Error al crear la persona',
        status: false
      }
    }
  }
}
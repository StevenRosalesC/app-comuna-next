import { IPersonsRequestResponse } from "@/interfaces/persons"
import apiCommunity from "@/utils/communityApi"

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
  }
}
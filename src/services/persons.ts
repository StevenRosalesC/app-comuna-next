import { IPersonsRequestResponse } from "@/interfaces/persons"
import apiCommunity from "@/utils/communityApi"

export const personsService = {
  async getPersons() : Promise<IPersonsRequestResponse | null> {
    try {
      const {data} =await apiCommunity.get<IPersonsRequestResponse>("/persons")
      console.log({data})
      return data
    } catch (error) {
      console.log({error})
      return null
    }
  }
}
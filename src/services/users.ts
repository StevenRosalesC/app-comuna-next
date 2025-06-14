import { IUsersRequestResponse, User } from "@/interfaces/users";
import apiCommunity from "@/utils/communityApi";
import { ServiceResponse } from "../interfaces/common";

export const usersService = {
  async getUsers(limit: number, offset: number, orderBy?: string, order?: string, search?: string, status?: boolean): Promise<ServiceResponse<IUsersRequestResponse | null>> {
    try {
      const { data: users } = await apiCommunity.get<IUsersRequestResponse>("/users", {
        params: {
          limit,
          offset,
          orderBy,
          order,
          search,
          status,
        },
      });
      return {
        data: users,
        message: "Usuarios obtenidos correctamente",
        status: true,
      };
    } catch (error) {
      return {
        data: null,
        message: "Error al obtener los usuarios",
        status: false,
      };
    }
  },

  async createUser(user:{
    password: string;
    roleId: string;
    username: string;
    personId: string;
}): Promise<ServiceResponse<User | null>> {
    try {
      const { data } = await apiCommunity.post("/users", user);
      return {
        data: data,
        message: "Usuario creado correctamente",
        status: true,
      };
    } catch (error) {
      return {
        data: null,
        message: "Error al crear el usuario",
        status: false,
      };
    }
  },

  async updateUser(userId: string, user: Omit<User, 'userId'>): Promise<ServiceResponse<User | null>> {
    try {
      const { data } = await apiCommunity.patch(`/users/${userId}`, user);
      return {
        data: data,
        message: "Usuario actualizado correctamente",
        status: true,
      };
    } catch (error) {
      return {
        data: null,
        message: "Error al actualizar el usuario",
        status: false,
      };
    }
  },
}; 
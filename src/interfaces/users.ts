export interface IUsersRequestResponse {
  data: User[];
  count: number;
}

export interface User {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  status: boolean;
  password: string;
  token: string;
  roleId: string;
  personId: string;
  person: Persons;
  role: UserRoles;
}

export interface Persons {
  personId: string;
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  phoneNumber: string;
  birthDate: Date;
  status: boolean;
  email: string;
  neighborhoodId: string;
}

export interface UserRoles {
  roleId: string;
  status: boolean;
  name: string;
  permissions: Permissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permissions {
  admin: string[];
  users: string[];
  members: string[];
  notices: string[];
  persons: string[];
  dashboard: string[];
  requirements: string[];
}

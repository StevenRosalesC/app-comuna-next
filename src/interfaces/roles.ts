import { ValidActions, ValidModules } from '@/constants/permissions';
export interface IUserRolesResponse {
  roleId: string;
  status: boolean;
  name: string;
  permissions: Permissions;
  createdAt: Date;
  updatedAt: Date;
}

export type Permissions = {
  [key in ValidModules]: ValidActions[];
};

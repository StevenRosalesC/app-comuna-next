export interface AuthResponse {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  username: string;
  status: boolean;
  role: string;
  roleId: string;
  token: string;
  permissions: Record<string, string[]>;
}

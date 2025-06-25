export const modulesPermissions = [
  {
    module: 'persons',
    route: 'persons',
    actions: ['read', 'write', 'edit', 'delete', 'approve_requirements'],
    label: 'Personas'
  },
  {
    module: 'admin',
    route: 'admin',
    actions: ['read', 'write', 'edit'],
    label: 'Administrador'
  },
  {
    module: 'dashboard',
    route: 'overview',
    actions: ['read'],
    label: 'Dashboard'
  },
  {
    module: 'members',
    route: 'members',
    actions: ['read', 'write', 'edit', 'delete'],
    label: 'Comuneros'
  },
  {
    module: 'notices',
    route: 'notices',
    actions: ['read', 'write', 'edit', 'delete'],
    label: 'Noticias'
  },
  {
    module: 'users',
    route: 'users',
    actions: ['read', 'write', 'edit', 'delete'],
    label: 'Usuarios'
  },
  {
    module: 'roles',
    route: 'roles',
    actions: ['read', 'write', 'edit', 'delete'],
    label: 'Roles'
  },
  {
    module: 'cash-management',
    route: 'cash-management',
    actions: ['read', 'write', 'edit', 'delete'],
    label: 'Caja'
  },
  // Add more modules here
]; 

export enum ValidModules {
  PERSONS = 'persons',
  ADMIN = 'admin',
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  NOTICES = 'notices',
  USERS = 'users',
  ROLES = 'roles',
  REQUIREMENTS = 'requirements',
  CASH_MANAGEMENT = 'cash-management',
  DOCUMENT_TYPES = 'document-types'
}

export enum ValidActions {    
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE_REQUIREMENTS = 'approve_requirements'
}

export const validPermissions = [
  ValidModules.PERSONS,
  ValidModules.USERS,
  ValidModules.ROLES,
  ValidModules.REQUIREMENTS,
  ValidModules.DOCUMENT_TYPES
];
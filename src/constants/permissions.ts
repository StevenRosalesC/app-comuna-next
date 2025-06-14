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
  // Add more modules here
]; 

export enum ValidModules {
  PERSONS = 'persons',
  ADMIN = 'admin',
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  NOTICES = 'notices',
  USERS = 'users',
  ROLES = 'roles'
}

export enum ValidActions {    
  READ = 'read',
  WRITE = 'write',
  EDIT = 'edit',
  DELETE = 'delete',
  APPROVE_REQUIREMENTS = 'approve_requirements'
}

export const validPermissions = [
  ValidModules.PERSONS,
  ValidModules.USERS,
  ValidModules.ROLES
]
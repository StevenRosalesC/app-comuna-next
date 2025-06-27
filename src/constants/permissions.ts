export const modulesPermissions = [
  {
    module: 'persons',
    route: 'persons',
    actions: ['read', 'write', 'edit', 'delete', 'approve_requirements','list_all'],
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
    actions: ['read', 'write', 'edit', 'delete','open_cash_register','close_cash_register','view_history'],
    label: 'Caja'
  },
  {
    module: 'reports',
    route: 'reports',
    actions: ['read', 'generate', 'export', 'schedule'],
    label: 'Reportes'
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
  APPROVE_REQUIREMENTS = 'approve_requirements',
  GENERATE = 'generate',
  EXPORT = 'export',
  SCHEDULE = 'schedule',
  OPEN_CASH_REGISTER = 'open_cash_register',
  CLOSE_CASH_REGISTER = 'close_cash_register',
  VIEW_HISTORY = 'view_history',
  LIST_ALL = 'list_all'
}

export const validPermissions = [
  ValidModules.PERSONS,
  ValidModules.USERS,
  ValidModules.ROLES,
  ValidModules.REQUIREMENTS,
  ValidModules.DOCUMENT_TYPES
];

// Utility function to get available actions for a specific module
export const getModuleActions = (module: string): string[] => {
  const moduleConfig = modulesPermissions.find(m => m.module === module);
  return moduleConfig?.actions || [];
};

// Utility function to get all available actions for all modules
export const getAllModuleActions = (): Record<string, string[]> => {
  return Object.fromEntries(
    modulesPermissions.map(m => [m.module, m.actions])
  );
};
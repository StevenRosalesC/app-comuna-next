export const modulesPermissions = [
  {
    module: 'persons',
    route: 'persons',
    actions: [
      'read',
      'write',
      'edit',
      'delete',
      'approve_requirements',
      'list_all'
    ],
    label: 'Personas'
  },
  {
    module: 'admin',
    route: 'admin',
    actions: [
      'read',
      'write',
      'edit',
      'create_requirements',
      'update_requirements',
      'delete_requirements',
      'create_annual_fee',
      'update_annual_fee',
      'delete_annual_fee',
      'create_document_type',
      'update_document_type',
      'delete_document_type',
      'read_requirements',
      'read_annual_fee',
      'read_document_type'
    ],
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
    actions: [
      'read',
      'write',
      'edit',
      'delete',
      'upload_documents',
      'read_documents',
      'read_history_payments',
      'create_payment'
    ],
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
    actions: [
      'read',
      'write',
      'edit',
      'delete',
      'open_cash_register',
      'close_cash_register',
      'view_history',
      'delete_payment',
      'create_income',
      'create_expense',
      'read_income',
      'read_expense',
      'delete_income',
      'delete_expense'
    ],
    label: 'Caja'
  },
  {
    module: 'reports',
    route: 'reports',
    actions: ['read', 'generate', 'export', 'schedule'],
    label: 'Reportes'
  }
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
  LIST_ALL = 'list_all',
  CREATE_REQUIREMENTS = 'create_requirements',
  UPDATE_REQUIREMENTS = 'update_requirements',
  DELETE_REQUIREMENTS = 'delete_requirements',
  CREATE_ANNUAL_FEE = 'create_annual_fee',
  UPDATE_ANNUAL_FEE = 'update_annual_fee',
  DELETE_ANNUAL_FEE = 'delete_annual_fee',
  CREATE_DOCUMENT_TYPE = 'create_document_type',
  UPDATE_DOCUMENT_TYPE = 'update_document_type',
  DELETE_DOCUMENT_TYPE = 'delete_document_type',
  UPLOAD_DOCUMENTS = 'upload_documents',
  READ_DOCUMENTS = 'read_documents',
  READ_HISTORY_PAYMENTS = 'read_history_payments',
  CREATE_PAYMENT = 'create_payment',
  DELETE_PAYMENT = 'delete_payment',
  CREATE_INCOME = 'create_income',
  CREATE_EXPENSE = 'create_expense',
  READ_INCOME = 'read_income',
  READ_EXPENSE = 'read_expense',
  DELETE_INCOME = 'delete_income',
  DELETE_EXPENSE = 'delete_expense'
}

export const validPermissions = [
  ValidModules.PERSONS,
  ValidModules.ADMIN,
  ValidModules.USERS,
  ValidModules.ROLES,
  ValidModules.REQUIREMENTS,
  ValidModules.DOCUMENT_TYPES,
  ValidModules.CASH_MANAGEMENT
];

// Utility function to get available actions for a specific module
export const getModuleActions = (module: string): string[] => {
  const moduleConfig = modulesPermissions.find((m) => m.module === module);
  return moduleConfig?.actions || [];
};

// Utility function to get all available actions for all modules
export const getAllModuleActions = (): Record<string, string[]> => {
  return Object.fromEntries(
    modulesPermissions.map((m) => [m.module, m.actions])
  );
};

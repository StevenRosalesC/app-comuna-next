
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
  DOCUMENT_TYPES = 'document-types',
  ANALYTICS = 'analytics',
  REPORTS = 'reports',
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
  CREATE_NEIGHBORHOOD = 'create_neighborhood',
  UPDATE_NEIGHBORHOOD = 'update_neighborhood',
  DELETE_NEIGHBORHOOD = 'delete_neighborhood',
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
  DELETE_EXPENSE = 'delete_expense',
  CANCEL_INVOICE = 'cancel_invoice',
  FILTER = 'filter',
  VIEW_SUMMARY = 'view_summary',
  VIEW_DETAILS = 'view_details',
  GENERATE_REPORTS = 'generate_reports',
  EXPORT_REPORTS = 'export_reports',
  READ_REQUIREMENTS = 'read_requirements',
  READ_ANNUAL_FEE = 'read_annual_fee',
  READ_DOCUMENT_TYPE = 'read_document_type',
  READ_NEIGHBORHOOD = 'read_neighborhood',
  
}

export const modulesPermissions: ModulePermissionConfig[] = [
  {
    module: ValidModules.PERSONS,
    route: '/dashboard/persons',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.DELETE,
      ValidActions.APPROVE_REQUIREMENTS,
      ValidActions.CREATE,
    ],
    label: 'Personas'
  },
  {
    module: ValidModules.ADMIN,
    route: '/dashboard/admin',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.CREATE_REQUIREMENTS,
      ValidActions.UPDATE_REQUIREMENTS,
      ValidActions.DELETE_REQUIREMENTS,
      ValidActions.CREATE_ANNUAL_FEE,
      ValidActions.CREATE_DOCUMENT_TYPE,
      ValidActions.UPDATE_DOCUMENT_TYPE,
      ValidActions.DELETE_DOCUMENT_TYPE,
      ValidActions.CREATE_NEIGHBORHOOD,
      ValidActions.UPDATE_NEIGHBORHOOD,
      ValidActions.DELETE_NEIGHBORHOOD,
      ValidActions.READ_REQUIREMENTS,
      ValidActions.READ_ANNUAL_FEE,
      ValidActions.READ_DOCUMENT_TYPE,
      ValidActions.READ_NEIGHBORHOOD
    ],
    label: 'Administrador'
  },
  {
    module: ValidModules.DASHBOARD,
    route: '/dashboard/overview',
    actions: [ValidActions.READ],
    label: 'Dashboard'
  },
  {
    module: ValidModules.MEMBERS,
    route: '/dashboard/members',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.DELETE,
      ValidActions.CREATE,
      ValidActions.APPROVE_REQUIREMENTS,
      ValidActions.LIST_ALL,
      ValidActions.UPLOAD_DOCUMENTS,
      ValidActions.READ_DOCUMENTS,
      ValidActions.READ_HISTORY_PAYMENTS,
      ValidActions.CREATE_PAYMENT,
    ],
    label: 'Comuneros'
  },
  {
    module: ValidModules.NOTICES,
    route: '/dashboard/notices',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.DELETE
    ],
    label: 'Noticias'
  },
  {
    module: ValidModules.USERS,
    route: '/dashboard/users',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.DELETE,
    ],
    label: 'Usuarios'
  },
  {
    module: ValidModules.ROLES,
    route: '/dashboard/roles',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.DELETE,
    ],
    label: 'Roles'
  },
  {
    module: ValidModules.CASH_MANAGEMENT,
    route: '/dashboard/cash-management',
    actions: [
      ValidActions.READ,
      ValidActions.UPDATE,
      ValidActions.CLOSE_CASH_REGISTER,
      ValidActions.VIEW_HISTORY,
      ValidActions.DELETE_PAYMENT,
      ValidActions.CREATE_INCOME,
      ValidActions.CREATE_EXPENSE,
      ValidActions.READ_INCOME,
      ValidActions.READ_EXPENSE,
      ValidActions.DELETE_INCOME,
      ValidActions.DELETE_EXPENSE,
      ValidActions.CANCEL_INVOICE,
    ],
    label: 'Caja'
  },
  {
    module: ValidModules.REPORTS,
    route: '/dashboard/reports',
    actions: [
      ValidActions.READ,
      ValidActions.GENERATE_REPORTS,
      ValidActions.EXPORT_REPORTS,
    ],
    label: 'Reportes'
  },
  {
    module: ValidModules.ANALYTICS,
    route: '/dashboard/analytics',
    actions: [
      ValidActions.READ,
      ValidActions.EXPORT,
      ValidActions.FILTER,
      ValidActions.VIEW_SUMMARY,
      ValidActions.VIEW_DETAILS,
      ValidActions.GENERATE_REPORTS,
    ],
    label: 'Analytics'
  }
  // Add more modules here
];


export interface ModulePermission {
  module: ValidModules;
  actions: ValidActions[];
}

export interface ModulePermissionConfig {
  module: ValidModules;
  route: string;
  actions: ValidActions[];
  label: string;
}


export const validPermissions = [
  ValidModules.PERSONS,
  ValidModules.ADMIN,
  ValidModules.USERS,
  ValidModules.ROLES,
  ValidModules.REQUIREMENTS,
  ValidModules.DOCUMENT_TYPES,
  ValidModules.CASH_MANAGEMENT,
  ValidModules.ANALYTICS
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

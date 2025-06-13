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
  // Add more modules here
]; 
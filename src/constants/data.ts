import { NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Comuneros',
    url: '/dashboard/members',
    icon: 'users',
    isActive: false,
    shortcut: ['m', 'm'],
    items: []
  },
  {
    title: 'Personas',
    url: '/dashboard/persons',
    icon: 'contact',
    isActive: false,
    shortcut: ['u', 'u']
  },
  {
    title: 'Noticias',
    url: '/dashboard/notices',
    icon: 'bookOpenText',
    isActive: false,
    shortcut: ['u', 'u']
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Administrador',
    url: '/dashboard/admin',
    icon: 'shieldCheck',
    isActive: false,
    shortcut: ['r', 'r']
  },
  {
    title: 'Usuarios',
    url: '/dashboard/users',
    icon: 'userSearch',
    isActive: false,
    shortcut: ['u', 'u']
  },
  {
    title: 'Roles',
    url: '/dashboard/roles',
    icon: 'shieldQuestion',
    isActive: false,
    shortcut: ['r', 'r']
  },
  {
    title: 'Caja',
    url: '/dashboard/cash-management',
    icon: 'dollar',
    isActive: false,
    shortcut: ['c', 'c']
  }
];

export const pageNavItems: NavItem[] = [
  {
    title: 'Inicio',
    url: '/'
  },
  {
    title: 'Aceca de',
    url: '/about'
  },
  {
    title: 'Noticias',
    url: '/notices'
  },
  {
    title: 'Contacto',
    url: '/contact'
  },
  {
    title: 'Iniciar Sesión',
    url: '/auth/login'
  },
];

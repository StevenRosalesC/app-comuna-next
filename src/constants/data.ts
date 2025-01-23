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
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'users',
    isActive: false,
    shortcut: ['u', 'u']
  }
];

export const pageNavItems: NavItem[] = [
  {
    title: 'Inicio',
    url: '/',
    isActive: false,
  },
  {
    title: 'Acerca de',
    url: '/about',
    isActive: false,
  },
  {
    title: 'Contacto',
    url: '/contact',
    isActive: false,
  }
];
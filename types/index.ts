import { Icons } from '@/components/icons';
// user: {
//       id: '3386900e-9636-4f60-99c1-ff61462ec122',
//       last_name: 'Rosales',
//       first_name: 'Steven',
//       email: 'stevenrosales31@gmail.com',
//       username: 'stevenrc',
//       status: 1,
//       role: 'Admin'
//     },
//     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMzg2OTAwZS05NjM2LTRmNjAtOTljMS1mZjYxNDYyZWMxMjIiLCJpYXQiOjE3MzczMDQxMTQsImV4cCI6MTczNzMwNzcxNH0.I3ke2fatSd1FoJBMgDs64a4_JfkHc81NMKdzjSXeV6Y',
//     refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMzg2OTAwZS05NjM2LTRmNjAtOTljMS1mZjYxNDYyZWMxMjIiLCJpYXQiOjE3MzczMDQxMTQsImV4cCI6MTczNzkwODkxNH0.7Dqx4WD6HzXVFNlbVmw1lE1anUet7u5rIX6eX7UUWrc'
//   }
interface User {
  id: string;
  last_name: string;
  first_name: string;
  email: string;
  username: string;
  status: number;
  role: string;
}
export interface Session {
  user: User;
  token: string;
  refreshToken: string;
}


export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

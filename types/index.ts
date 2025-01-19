import { Icons } from '@/components/icons';
import { Database } from './supabase';
import { Session } from '@supabase/supabase-js';
export interface CustomSession extends Partial<Session> {
  username: string;
  roles: Database['public']['Tables']['roles']['Row'];
  user_projects: Database['public']['Tables']['user_projects']['Row'][];
}
export type UserProjectsRow =
  Database['public']['Tables']['user_projects']['Row'];
export type ProjectsRow = Database['public']['Tables']['projects']['Row'];
export type UserProjectsWithProjects = UserProjectsRow & {
  projects: ProjectsRow;
};

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

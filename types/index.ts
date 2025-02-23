import { Icons } from '@/components/icons';
import { AuthResponse } from './response';
export interface Session {
  user: AuthResponse;
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

export interface PageData {
  totalPersons:        number;
  totalMembers:        number;
  totalNeighborhoods:  number;
  totalAssociations:   number;
  neighborhoodsImages: NeighborhoodsImage[];
  news:             News[];
}

export interface NeighborhoodsImage {
  neighborhoodName: string;
  neighborhoodId:   string;
  images:           Image[];
}

export interface Image {
  imageId: string;
  url:     string;
}

export interface News {
  newsId:        string;
  coverImageUrl: string;
  title:         string;
  description:   string;
  type:          string;
  createdAt:     string;
  createdBy:     string;
}

'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
  // useSidebar
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  LogOut,
  User
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';
import { NavItem } from 'types';
import { useEffect, useState } from 'react';
import { useSessionContext } from '../providers/session-Provider';
import { logout } from '@/app/actions/auth-actions';
import Image from 'next/image';
import Link from 'next/link';
import { modulesPermissions } from '@/constants/permissions';
import { usePermissionsStore } from '@/store/permissionsStore';

export const company = {
  name: 'Comuna Bambil Collao',
  logo: GalleryVerticalEnd
};

function SidebarMenuItemWithPermission({
  item,
  pathname,
  userPermissions
}: {
  item: NavItem;
  pathname: string;
  userPermissions: Record<string, string[]>;
}) {
  const getModuleFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts.length > 2 ? parts[2] : '';
  };
  const rawMod = getModuleFromUrl(item.url);
  const moduleConfig = modulesPermissions.find((m) => m.route === rawMod);
  const mod = moduleConfig?.module || rawMod;

  // Local permission check
  function hasPermission(module: string, actions: string[]) {
    if (!userPermissions[module]) return false;
    return actions.some((action) => userPermissions[module].includes(action));
  }

  const canAccess = hasPermission(mod, ['read']);
  if (!canAccess) return null;
  const Icon = item.icon ? Icons[item.icon] : Icons.logo;
  return item?.items && item?.items?.length > 0 ? (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={item.isActive}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={pathname === item.url}
          >
            {item.icon && <Icon />}
            <span>{item.title}</span>
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === subItem.url}
                >
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  ) : (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={pathname === item.url}
      >
        <Link href={item.url}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const { session, setSession } = useSessionContext();
  const userPermissions = session?.permissions || {};
  const clearPermissions = usePermissionsStore((state) => state.clearPermissions);
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>(pathname);
  const [userAccess] = useState<NavItem[]>(navItems);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex gap-2 py-2 text-sidebar-accent-foreground '>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <Image
              src='https://ik.imagekit.io/stevenrosales/app-comuna/icon.png?updatedAt=1736217178070'
              width={32}
              height={32}
              className='rounded-lg bg-sidebar object-cover'
              alt='Team logo'
            />
          </div>
          <div className='grid h-full flex-1 items-center text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{company.name}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarMenu>
            {userAccess.map((item) => (
              <SidebarMenuItemWithPermission
                key={item.title}
                item={item}
                pathname={currentPath}
                userPermissions={userPermissions}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    {/* <AvatarImage
                      src={session?.user?.id || ''}
                      alt={session?.lastName || ''}
                    /> */}
                    <AvatarFallback className='rounded-lg'>
                      {session?.lastName?.slice(0, 2)?.toUpperCase() || 'CB'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {session?.lastName || ''}
                    </span>
                    <span className='truncate text-xs'>
                      {session?.email || ''}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarFallback className='rounded-lg'>
                        {session?.lastName?.slice(0, 2)?.toUpperCase() || 'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {session?.lastName || ''}
                      </span>
                      <span className='truncate text-xs'>
                        {' '}
                        {session?.role || ''}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href='/dashboard/profile'>
                      <User className='mr-2 h-4 w-4' />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BadgeCheck className='mr-2 h-4 w-4' />
                    Cuenta
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className='mr-2 h-4 w-4' />
                    Facturación
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className='mr-2 h-4 w-4' />
                    Notificaciones
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSession(null);
                    clearPermissions();
                    logout();
                  }}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

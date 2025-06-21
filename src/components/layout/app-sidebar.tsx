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
  LogOut
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';
import { NavItem } from 'types';
import { useEffect, useState } from 'react';
import { useSessionContext } from '../providers/session-Provider';
import { logout } from '@/app/actions/auth-actions';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { usePermission } from '@/hooks/usePermission';
import { modulesPermissions } from '@/constants/permissions';
import { usePermissionsStore } from '@/store/permissionsStore';

export const company = {
  name: 'Comuna Bambil Collao',
  logo: GalleryVerticalEnd
};

function SidebarMenuItemWithPermission({
  item,
  pathname
}: {
  item: NavItem;
  pathname: string;
}) {
  const getModuleFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts.length > 2 ? parts[2] : '';
  };
  const rawMod = getModuleFromUrl(item.url);
  const moduleConfig = modulesPermissions.find((m) => m.route === rawMod);
  const mod = moduleConfig?.module || rawMod;
  const canAccess = usePermission(mod, ['read']);
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
    <SidebarMenuItem
      key={item.title}
      className={`${
        pathname === item.url
          ? 'rounded-lg bg-green-100 font-bold text-green-900 dark:bg-green-900 dark:text-green-100'
          : ''
      } transition-all duration-300 ease-in-out hover:rounded-lg hover:bg-green-100 hover:text-green-900 dark:hover:bg-green-900 dark:hover:text-green-100`}
    >
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={pathname === item.url}
      >
        <Link href={item.url}>
          <Icon />
          <span
            className={`${
              pathname === item.url ? 'font-bold text-green-900' : ''
            }`}
          >
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const { session, setSession } = useSessionContext();
  const { clearPermissions } = usePermissionsStore();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>(pathname);
  // const { data: session } = useSession();
  const [userAccess] = useState<NavItem[]>(navItems);
  // const { state, isMobile } = useSidebar();

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
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
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
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
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
                  <LogOut />
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

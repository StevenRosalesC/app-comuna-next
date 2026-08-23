'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse } from 'types/response';
import { usePermissionsStore } from '@/store/permissionsStore';
import { useRouter, usePathname } from 'next/navigation';
import { modulesPermissions } from '@/constants/permissions';
import { usePermission } from '@/hooks/usePermission';

import { setClientToken } from '@/utils/communityApi';

interface SessionContextProps {
  session: AuthResponse | null;
  loading: boolean;
  setSession: (session: AuthResponse | null) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider = ({
  children,
  initialSession
}: {
  children: React.ReactNode;
  initialSession?: AuthResponse | null;
}) => {
  const [session, setSession] = useState<AuthResponse | null>(
    initialSession || null
  );

  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
      if (initialSession.token) {
        setClientToken(initialSession.token);
      }
      if (initialSession.permissions) {
        usePermissionsStore.getState().setPermissions(initialSession.permissions);
      }
    }
  }, [initialSession]);

  const { isLoading, permissions, error, fetchPermissions } = usePermissionsStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/dashboard') && !permissions && !isLoading) {
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, permissions, isLoading]);

  // Helper to extract module from pathname
  const getModuleFromPath = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] !== 'dashboard') return 'dashboard';
    if (parts.length < 2) return 'dashboard';
    const baseRoute = `/${parts[0]}/${parts[1]}`;
    const moduleConfig = modulesPermissions.find((m) => m.route === baseRoute);
    return moduleConfig?.module || parts[1];
  };

  // Public dashboard routes that do not require permissions validation
  const publicDashboardRoutes = ['/dashboard/profile', '/dashboard/unauthorized'];
  const isPublicRoute = publicDashboardRoutes.includes(pathname);

  const mod = getModuleFromPath(pathname);
  const hasPermission = usePermission(mod, ['read']);

  // Redirect to /unauthorized if the user does not have permission
  useEffect(() => {
    if (
      pathname.startsWith('/dashboard') &&
      !isPublicRoute &&
      !isLoading &&
      permissions &&
      !hasPermission &&
      pathname !== '/unauthorized'
    ) {
      router.replace('/unauthorized');
    }
  }, [pathname, isLoading, permissions, hasPermission, router, isPublicRoute]);

  return (
    <SessionContext.Provider
      value={{
        session,
        loading: isLoading || !session,
        setSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe ser usado dentro de un SessionProvider');
  }
  return context;
};

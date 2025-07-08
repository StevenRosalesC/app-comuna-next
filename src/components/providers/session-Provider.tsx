'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse } from 'types/response';
import { usePermissionsStore } from '@/store/permissionsStore';
import { useRouter, usePathname } from 'next/navigation';
import { modulesPermissions } from '@/constants/permissions';
import { usePermission } from '@/hooks/usePermission';

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
  const [loading] = useState(!initialSession);

  const { isLoading, permissions, error, fetchPermissions } = usePermissionsStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/dashboard')) {
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Helper para extraer el módulo de la ruta
  const getModuleFromPath = (pathname: string) => {
    const parts = pathname.split('/');
    if (parts.length > 2) {
      const route = parts[2];
      const moduleConfig = modulesPermissions.find((m) => m.route === route);
      return moduleConfig?.module || route;
    }
    return 'dashboard'; // Por defecto para /dashboard
  };

  // Rutas que no requieren validación de permisos
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

  // If there's an error loading permissions, allow access (fallback for mobile)
  if (
    pathname.startsWith('/dashboard') &&
    !isPublicRoute &&
    !isLoading &&
    error &&
    error !== 'unauthorized'
  ) {
    console.warn('Permissions failed to load due to network error, allowing access as fallback');
    return (
      <SessionContext.Provider value={{ session, loading: false, setSession }}>
        {children}
      </SessionContext.Provider>
    );
  }

  // While loading permissions, show loading state
  if (
    pathname.startsWith('/dashboard') &&
    !isPublicRoute &&
    isLoading
  ) {
    return (
      <SessionContext.Provider value={{ session, loading: true, setSession }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando permisos...</p>
            {error && (
              <p className="text-xs text-red-500 mt-2">Error: {error}</p>
            )}
          </div>
        </div>
      </SessionContext.Provider>
    );
  }

  // If permissions failed to load, allow access to dashboard (fallback)
  if (
    pathname.startsWith('/dashboard') &&
    !isPublicRoute &&
    !isLoading &&
    permissions === null &&
    !error
  ) {
    console.warn('Permissions failed to load, allowing access as fallback');
  }

  // If the user does not have permission, redirect instead of returning null
  if (
    pathname.startsWith('/dashboard') &&
    !isPublicRoute &&
    !isLoading &&
    permissions &&
    !hasPermission
  ) {
    // The redirect will be handled by the useEffect above
    return (
      <SessionContext.Provider value={{ session, loading: false, setSession }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Redirigiendo...</p>
          </div>
        </div>
      </SessionContext.Provider>
    );
  }

  return (
    <SessionContext.Provider value={{ session, loading, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext || undefined);
  if (!context) {
    throw new Error('useSession debe ser usado dentro de un SessionProvider');
  }
  return context;
};

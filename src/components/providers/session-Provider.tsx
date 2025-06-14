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
  const [loading, setLoading] = useState(!initialSession);

  const { isLoading, permissions, fetchPermissions } = usePermissionsStore();
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

  const mod = getModuleFromPath(pathname);
  const hasPermission = usePermission(mod, ['read']);

  // Redirige a /unauthorized si no tiene permiso (después de cargar)
  useEffect(() => {
    if (
      pathname.startsWith('/dashboard') &&
      !isLoading &&
      permissions &&
      !hasPermission &&
      pathname !== '/unauthorized'
    ) {
      router.replace('/unauthorized');
    }
  }, [pathname, isLoading, permissions, hasPermission, router]);

  // Mientras carga permisos, no renderiza nada
  if (
    pathname.startsWith('/dashboard') &&
    (isLoading || permissions === null)
  ) {
    return null;
  }

  // Si no tiene permiso, no renderiza nada
  if (
    pathname.startsWith('/dashboard') &&
    !isLoading &&
    permissions &&
    !hasPermission
  ) {
    return null;
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

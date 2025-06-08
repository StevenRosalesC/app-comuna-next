'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse } from 'types/response';
import { usePermissionsStore } from '@/store/permissionsStore';
import { useRouter, usePathname } from 'next/navigation';

interface SessionContextProps {
  session: AuthResponse | null;
  loading: boolean;
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

  useEffect(() => {
    // Solo redirige si ya terminó de cargar y no hay permisos
    if (
      pathname.startsWith('/dashboard') &&
      !isLoading &&
      permissions === undefined &&
      pathname !== '/auth/login'
    ) {
      router.replace('/auth/login');
    }
  }, [pathname, isLoading, permissions, router]);

  // Mientras carga permisos, no renderiza nada (ni redirige)
  if (pathname.startsWith('/dashboard') && (isLoading || permissions === null)) {
    return null; // O un loader si prefieres
  }

  return (
    <SessionContext.Provider value={{ session, loading }}>
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

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
    // Only fetch permissions on protected routes and if not already loaded
    if (pathname.startsWith('/dashboard') && !permissions) {
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Do not render anything while loading permissions on protected routes
  if (pathname.startsWith('/dashboard') && isLoading) return null;

  // If permissions are not available on protected routes, redirect to login
  if (pathname.startsWith('/dashboard') && !permissions) {
    router.replace('/auth/login');
    return null;
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

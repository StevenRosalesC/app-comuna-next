'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import supabaseServer from '@/utils/db-server';
import { CustomSession } from 'types';

interface SessionContextProps {
  supabase: SupabaseClient;
  session: CustomSession | null;
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
  initialSession?: CustomSession | null;
}) => {
  const [supabase] = useState(() => supabaseServer);
  const [session, setSession] = useState<CustomSession | null>(
    initialSession || null
  );
  const [loading, setLoading] = useState(!initialSession);

  useEffect(() => {
    setSession(initialSession || null);
  }, [supabase, initialSession]);

  return (
    <SessionContext.Provider value={{ supabase, session, loading }}>
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

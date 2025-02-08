'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from 'types';

interface SessionContextProps {
  session: Session | null;
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
  initialSession?: Session | null;
}) => {
  const [session, setSession] = useState<Session | null>(
    initialSession || null
  );
  const [loading, setLoading] = useState(!initialSession);


  useEffect(() => {
    setSession(initialSession || null);
  }, [initialSession]);

  return (
    <SessionContext.Provider value={{ session, loading }}>
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

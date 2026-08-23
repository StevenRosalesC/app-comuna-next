'use client';

import { useEffect } from 'react';
import { useSessionContext } from './session-Provider';
import { AuthResponse } from 'types/response';

export function SessionSync({ session }: { session: AuthResponse | null }) {
  const { setSession } = useSessionContext();

  useEffect(() => {
    if (session) {
      setSession(session);
    }
  }, [session, setSession]);

  return null;
}

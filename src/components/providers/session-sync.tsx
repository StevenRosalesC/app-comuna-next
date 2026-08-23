'use client';

import { useEffect } from 'react';
import { useSessionContext } from './session-Provider';
import { AuthResponse } from 'types/response';
import { setClientToken } from '@/utils/communityApi';
import { usePermissionsStore } from '@/store/permissionsStore';

export function SessionSync({ session }: { session: AuthResponse | null }) {
  const { setSession } = useSessionContext();

  useEffect(() => {
    if (session) {
      setSession(session);
      if (session.token) {
        setClientToken(session.token);
      }
      if (session.permissions) {
        usePermissionsStore.getState().setPermissions(session.permissions);
      }
    }
  }, [session, setSession]);

  return null;
}

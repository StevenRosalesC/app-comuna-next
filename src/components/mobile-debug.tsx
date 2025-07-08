'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useSessionContext } from '@/components/providers/session-Provider';
import { usePermissionsStore } from '@/store/permissionsStore';

export function MobileDebug() {
  const isMobile = useIsMobile();
  const { session, loading } = useSessionContext();
  const { permissions, isLoading: permissionsLoading } = usePermissionsStore();

  if (!isMobile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-xs z-50">
      <div className="flex justify-between items-center">
        <span>Mobile Debug:</span>
        <span>Session: {session ? 'Yes' : 'No'}</span>
        <span>Loading: {loading ? 'Yes' : 'No'}</span>
        <span>Perms: {permissions ? 'Yes' : 'No'}</span>
        <span>PermsLoading: {permissionsLoading ? 'Yes' : 'No'}</span>
        <span>Width: {typeof window !== 'undefined' ? window.innerWidth : 'SSR'}</span>
      </div>
    </div>
  );
} 
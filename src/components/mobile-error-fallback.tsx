'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useSessionContext } from '@/components/providers/session-Provider';
import { usePermissionsStore } from '@/store/permissionsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MobileErrorFallbackProps {
  children: React.ReactNode;
}

export function MobileErrorFallback({ children }: MobileErrorFallbackProps) {
  const isMobile = useIsMobile();
  const { session, loading } = useSessionContext();
  const { permissions, isLoading: permissionsLoading } = usePermissionsStore();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (isMobile) {
      // Only show fallback if there's an error after a reasonable time
      const timer = setTimeout(() => {
        if (loading || permissionsLoading) {
          setShowFallback(true);
        }
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, [isMobile, loading, permissionsLoading]);

  // Don't show fallback if not mobile or if everything is working
  if (!isMobile || (!showFallback && !loading && !permissionsLoading)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Error en Móvil</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Se detectó un problema al cargar el dashboard en móvil.
              Intenta refrescar la página o contacta al administrador.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Estado de sesión: {session ? 'Activa' : 'Inactiva'}</p>
              <p>Cargando: {loading ? 'Sí' : 'No'}</p>
              <p>Permisos: {permissions ? 'Cargados' : 'No cargados'}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refrescar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
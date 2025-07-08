'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    alert(error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-md mx-auto pt-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Error en el Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ha ocurrido un error inesperado. Por favor, intenta refrescar la página.
                </p>
                {this.state.error && (
                  <details className="text-left">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      Ver detalles del error
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
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

    return this.props.children;
  }
} 
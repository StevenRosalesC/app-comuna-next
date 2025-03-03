'use client';
import { SessionProvider } from './session-Provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider initialSession={null}>
      {children}
    </SessionProvider>
  );
} 
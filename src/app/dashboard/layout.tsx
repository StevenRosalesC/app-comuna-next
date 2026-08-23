import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { MobileErrorFallback } from '@/components/mobile-error-fallback';
import { ErrorBoundary } from '@/components/error-boundary';
import { SessionSync } from '@/components/providers/session-sync';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';
  const { data: session } = await auth();

  return (
    <>
      <SessionSync session={session} />
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {/* page main content */}
            <div className='container mx-auto max-w-350 px-2 sm:px-4'>
              <ErrorBoundary>
                <MobileErrorFallback>
                  {children}
                </MobileErrorFallback>
              </ErrorBoundary>
            </div>
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </>
  );
}

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import Providers from '@/components/layout/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { MobileDebug } from '@/components/mobile-debug';
import { MobileErrorFallback } from '@/components/mobile-error-fallback';
import { ErrorBoundary } from '@/components/error-boundary';

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
    <Providers session={session}>
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <MobileDebug />
            {/* page main content */}
            <div className='container mx-auto max-w-[1400px]  px-2 sm:px-4'>
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
    </Providers>
  );
}

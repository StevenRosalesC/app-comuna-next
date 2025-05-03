import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import Providers from '@/components/layout/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

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
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  const { data: session } = await auth();
  return (
    <Providers session={session}>
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {/* page main content */}
            <section className=' mx-auto w-full px-2 sm:px-4 py-4 space-y-6'>{children}</section>
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </Providers>
  );
}

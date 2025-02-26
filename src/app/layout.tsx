import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions'
// import { auth } from '@/lib/auth';
// import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Providers } from '@/components/providers/providers';

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | App',
  description: 'App de la Comuna Bambil Collao',
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  return (
    <ViewTransitions>
      <html
        lang='es'
        className={`${lato.className}`}
        suppressHydrationWarning={true}
      >
        <body>
          <NextTopLoader showSpinner={false} />
          <Providers>
            <NuqsAdapter>
              {/* <Providers session={session}> */}
              <Toaster />
              {children}
              {/* </Providers> */}
            </NuqsAdapter>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}

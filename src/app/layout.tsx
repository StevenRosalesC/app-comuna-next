// import { auth } from '@/lib/auth';
// import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  return (
    <html
      lang='en'
      className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
      <body>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          {/* <Providers session={session}> */}
          <Toaster />
          {children}
          {/* </Providers> */}
        </NuqsAdapter>
      </body>
    </html>
  );
}

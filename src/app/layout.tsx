import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';
// import { auth } from '@/lib/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | App',
  description: 'App de la Comuna Bambil Collao'
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
  // Si necesitas pasar la sesión real, reemplaza null por la sesión obtenida
  const session = null;
  return (
    <ViewTransitions>
      <html
        lang='es'
        className={`${lato.className}`}
        suppressHydrationWarning={true}
      >
        <body>
          <NextTopLoader showSpinner={false} />
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}

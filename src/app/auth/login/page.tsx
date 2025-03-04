import LoginViewPage from '@/features/auth/components/login-view';
import { NEXT_PUBLIC_APP_URL } from '@/lib/env.config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bambil Collao APP | Iniciar sesión',
  description: 'Iniciar sesión en la aplicación de la Comuna Bambil Collao.',
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/auth/login`
  },
  openGraph: {
    title: 'Bambil Collao APP | Iniciar sesión',
    description: 'Iniciar sesión en la aplicación de la Comuna Bambil Collao.',
    url: `${NEXT_PUBLIC_APP_URL}/auth/login`
  }
};

export default function Page() {
  return <LoginViewPage />;
}

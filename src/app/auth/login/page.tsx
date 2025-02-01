import LoginViewPage from '@/features/auth/components/login-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Iniciar sesión',
  description: 'Inicia sesión para acceder a tu cuenta.'
};

export default function Page() {
  return <LoginViewPage />;
}

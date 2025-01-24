import ForgotPasswordView from '@/components/views/forgot-password.view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Olvidé mi contraseña',
  description: 'Inicia sesión para acceder a tu cuenta.'
};

export default function Page() {
  return <ForgotPasswordView />;
}

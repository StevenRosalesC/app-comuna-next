import CreateNoticeView from '@/components/views/dashboard/notices/create-notice-view';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Bambil Collao APP | Crear noticia',
  description: 'Aplicación de la comuna Bambil Collao.'
};
export default function Page() {
  return (
    <>
      <CreateNoticeView />
    </>
  );
}

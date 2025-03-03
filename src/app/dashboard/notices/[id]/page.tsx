import { EditNoticeView } from '@/components/views/dashboard/notices/edit-notice-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bambil Collao APP | Editar noticia',
  description: 'Aplicación de la comuna Bambil Collao.'
};
interface Props {
  params: { id: string };
}

export default function EditNoticePage({ params }: Props) {
  const { id } = params;
  return (
    <>
      <EditNoticeView id={id} />
    </>
  );
}

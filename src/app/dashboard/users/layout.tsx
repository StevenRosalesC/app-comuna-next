import PageContainer from '@/components/layout/page-container';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

export default function usersLayout({ children }: Props) {
  return (
    <PageContainer>
      <div className='space-y-4'>{children}</div>
    </PageContainer>
  );
}

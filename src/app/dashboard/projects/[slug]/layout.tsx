import PageContainer from '@/components/layout/page-container';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

export default function ProjectsLayout({ children }: Props) {
  return (
    <PageContainer>
      <div className='space-y-4'>{children}</div>
    </PageContainer>
  );
}

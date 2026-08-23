'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import MemberEditForm from '@/components/dashboard/members/member-edit-form';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MemberEditPage() {
  const params = useParams<{ id: string }>();

  if (!params?.id) {
    return (
      <PageContainer scrollable>
        <div className='flex flex-col items-center justify-center min-h-[300px] gap-4 text-center'>
          <p className='text-muted-foreground'>ID de comunero no válido.</p>
          <Button asChild variant='outline' size='sm'>
            <Link href='/dashboard/members'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Volver a comuneros
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className='space-y-6 pb-8'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            size='sm'
            asChild
            className='w-fit -ml-2 text-muted-foreground hover:text-foreground'
          >
            <Link href={`/dashboard/members/${params.id}`}>
              <ArrowLeft className='mr-2 h-4 w-4' /> Volver al comunero
            </Link>
          </Button>
        </div>

        <MemberEditForm memberId={params.id} />
      </div>
    </PageContainer>
  );
}

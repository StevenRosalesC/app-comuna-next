import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)] w-full max-w-full min-w-0'>
          <div className='h-full p-3 sm:p-4 md:px-6 w-full max-w-full min-w-0 overflow-x-hidden'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='h-full p-3 sm:p-4 md:px-6 w-full max-w-full min-w-0 overflow-x-hidden'>{children}</div>
      )}
    </>
  );
}

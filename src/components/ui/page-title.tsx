import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
}

export function PageTitle({ title, className, ...props }: PageTitleProps) {
  return (
    <h1
      className={cn('text-2xl font-bold tracking-tight', className)}
      {...props}
    >
      {title}
    </h1>
  );
}

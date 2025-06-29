'use client';

import { useEffect, useState } from 'react';
import { useSessionContext } from '../providers/session-Provider';

interface HeadingProps {
  title: string;
  description: string;
  project?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  project
}) => {
  const [titleContent] = useState<string>(title);
  const { session } = useSessionContext();
  useEffect(() => { }, [session, project, title]);

  return (
    <div>
      <h2 className='text-3xl font-bold tracking-tight'>{titleContent}</h2>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  );
};

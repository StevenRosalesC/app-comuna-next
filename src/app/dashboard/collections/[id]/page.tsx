'use client';

import { useParams } from 'next/navigation';
import { LiveCollectionPanel } from '@/components/dashboard/collections/live-panel';

export default function CollectionLivePage() {
  const params = useParams<{ id: string }>();
  const collectionId = params.id as string;
  console.log({collectionId})

  return <LiveCollectionPanel collectionId={collectionId} />;
}

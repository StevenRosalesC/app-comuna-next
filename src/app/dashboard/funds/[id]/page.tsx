'use client';

import { useParams } from 'next/navigation';
import { FundDetailView } from '@/components/dashboard/funds/fund-detail-view';

export default function FundDetailPage() {
  const params = useParams<{ id: string }>();
  const fundId = params.id as string;
  console.log("FOund page loaded")

  return <FundDetailView fundId={fundId} />;
}

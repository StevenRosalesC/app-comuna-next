import AnnualFeeList from '@/components/dashboard/annual-fee/annual-fee-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cuotas Anuales',
  description: 'Gestión de cuotas anuales'
};

export default function AnnualFeePage() {
  // Main page for annual fee management
  return <AnnualFeeList />;
}

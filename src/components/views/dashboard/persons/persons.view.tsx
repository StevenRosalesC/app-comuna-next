'use client';
import InsertPersonForm from '@/components/dashboard/persons/insertPersonForm';
import PersonsDataTable from '@/components/dashboard/persons/persons-datatable';
import PersonsActionsSection from '@/components/dashboard/persons/personsActionsSection';
import { usePermissionsStore } from '@/store/permissionsStore';
import { useNeighborhoodsStore } from '@/hooks/store/useNeighborhoodsStore';
import { useEffect } from 'react';

export default function PersonsDashboardView() {
  const { permissions } = usePermissionsStore();
  const canCreatePerson = permissions?.['persons']?.includes('create');
  const { neighborhoods, isLoading, fetchNeighborhoods } =
    useNeighborhoodsStore((state) => ({
      neighborhoods: state.neighborhoods,
      isLoading: state.isLoading,
      fetchNeighborhoods: state.fetchNeighborhoods
    }));

  useEffect(() => {
    fetchNeighborhoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container mx-auto max-w-[1400px] space-y-6 px-2 py-4 sm:px-4'>
      <div className='grid grid-cols-1 gap-6'>
        <div className='w-full'>
          {canCreatePerson && (
            <InsertPersonForm
              neighborhoods={neighborhoods}
              isLoading={isLoading}
            />
          )}
        </div>
        <PersonsActionsSection />
        <div className='w-full overflow-hidden'>
          <PersonsDataTable />
        </div>
      </div>
    </div>
  );
}

// Main view for the users module
// Comments in English as requested

import { CreateUserForm } from '@/components/dashboard/users/create-user-form';
import UsersDataTable from '@/components/dashboard/users/users-datatable';

// Example summary data
const summary = {
  totalActive: 2,
  totalInactive: 1,
  totalPaid: 1,
  totalPending: 2,
  totalDocuments: 6
};

export default function UsersView() {
  return (
    <div>
      <div className='container mx-auto max-w-[1400px] space-y-6 px-2 py-4 sm:px-4'>
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='grid flex-1 grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='rounded-lg bg-white p-4 text-center shadow'>
              <div className='mb-1 text-xs text-gray-500'>Activos</div>
              <div className='text-2xl font-bold text-green-600'>
                {summary.totalActive}
              </div>
            </div>
          </div>
        </div>
        <div className='w-full overflow-hidden'>
          <CreateUserForm />
        </div>
        <UsersDataTable />
      </div>
    </div>
  );
}

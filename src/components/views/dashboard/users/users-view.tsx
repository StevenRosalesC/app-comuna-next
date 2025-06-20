// Main view for the users module
'use client';
import { CreateUserForm } from '@/components/dashboard/users/create-user-form';
import UsersDataTable from '@/components/dashboard/users/users-datatable';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';

export default function UsersView() {
  const { permissions } = usePermissionsStore();
  const canCreateUser = permissions?.[ValidModules.USERS]?.includes(
    ValidActions.CREATE
  );
  return (
    <div>
      <div className='container mx-auto max-w-[1400px] space-y-6 px-2 py-4 sm:px-4'>
        <div className='w-full overflow-hidden'>
          {canCreateUser && <CreateUserForm />}
        </div>
        <UsersDataTable />
      </div>
    </div>
  );
}

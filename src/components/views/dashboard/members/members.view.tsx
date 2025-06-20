'use client';
import MembersDataTable from '@/components/dashboard/members/members-datatable';
import MembersActionsSection from '@/components/dashboard/members/membersActionsSection';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { usePermissionsStore } from '@/store/permissionsStore';
import React from 'react';

export default function MembersDashboardView() {
  const { permissions } = usePermissionsStore();
  const canCreateMember = permissions?.[ValidModules.MEMBERS]?.includes(
    ValidActions.CREATE
  );

  return (
    <div className='container mx-auto max-w-[1400px] space-y-6 px-2 py-4 sm:px-4'>
      <div className='grid grid-cols-1 gap-6'>
        <div className='w-full'>
          {canCreateMember && <MembersActionsSection />}
        </div>
        <div className='w-full overflow-hidden'>
          <MembersDataTable />
        </div>
      </div>
    </div>
  );
}

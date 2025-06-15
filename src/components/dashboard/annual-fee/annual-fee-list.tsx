'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import AnnualFeeForm from './annual-fee-form';
import { Person } from '@/interfaces/persons';
// import MembersDataTable from './members-datatable';

// Dummy data for summary cards
const summary = {
  totalCollected: 1200,
  totalPending: 800,
  totalPeople: 10
};

export default function AnnualFeeList() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className='space-y-6'>
      {/* Summary cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 text-lg font-semibold'>Total Collected</h2>
          <p className='text-2xl font-bold text-green-600'>
            ${summary.totalCollected}
          </p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 text-lg font-semibold'>Total Pending</h2>
          <p className='text-2xl font-bold text-yellow-600'>
            ${summary.totalPending}
          </p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 text-lg font-semibold'>Total People</h2>
          <p className='text-2xl font-bold text-blue-600'>
            {summary.totalPeople}
          </p>
        </div>
      </div>
      {/* Members datatable */}
      {/* <MembersDataTable /> */}
      {/* People list */} {/* Dialog for charging fee */}
      <Dialog
        open={!!selectedPerson}
        onOpenChange={() => setSelectedPerson(null)}
      >
        <DialogContent>
          <DialogTitle>Cobrar cuota anual</DialogTitle>
          <p className='mb-4'>
            Persona: {selectedPerson?.firstName} {selectedPerson?.lastName}
          </p>
          <AnnualFeeForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

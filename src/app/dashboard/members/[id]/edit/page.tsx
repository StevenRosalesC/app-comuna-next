import MemberEditForm from '@/components/dashboard/members/member-edit-form';

export default function MemberEditPage({ params }: { params: { id: string } }) {
  return (
    <div className='p-4 pt-6 md:p-8'>
      <MemberEditForm memberId={params.id} />
    </div>
  );
}

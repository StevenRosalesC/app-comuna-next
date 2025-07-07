import PageContainer from '@/components/layout/page-container';
import UserProfileForm from './user-profile-form';

export default function ProfileViewPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <UserProfileForm />
      </div>
    </PageContainer>
  );
}

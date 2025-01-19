import { Heading } from '@/components/ui/heading';
import { CreateUserForm } from '../../../components/users/create-user-form';
export const metadata = {
  title: 'Dashboard : Users'
};

export default function usersPage() {
  return (
    <>
      <Heading title={'Users'} description='Manage users' />
      <CreateUserForm />
    </>
  );
}

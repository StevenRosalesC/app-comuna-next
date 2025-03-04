import EditForm from '@/components/notices/edit-notice-form';

interface Props {
  id?: string;
}
export const EditNoticeView = async ({ id }: Props) => {
  return (
    <div>
      <EditForm id={id} />
    </div>
  );
};

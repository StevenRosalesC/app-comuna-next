import { IssueList } from '@/components/projects/issue-list';

export const metadata = {
  title: 'Dashboard : Projects'
};
interface Props {
  params: { slug: string };
}
export default function page({ params }: Props) {
  return (
    <>
      <IssueList project={params.slug} />
    </>
  );
}

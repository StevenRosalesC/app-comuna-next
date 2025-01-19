import { UserRound } from 'lucide-react';
import Image from 'next/image';
import { Issue } from 'types/jira';

interface Props {
  issue: Issue;
  onIssueSelect: (issue: Issue) => void;
}

export const IssueCard = ({ issue, onIssueSelect }: Props) => {
  const handleBgColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-red-700';
      case 'In Progress':
        return 'bg-yellow-700';
      case 'Done':
        return 'bg-green-700';
      default:
        return 'bg-gray-700';
    }
  };
  return (
    <article
      onClick={() => onIssueSelect(issue)}
      className='cursor-pointer rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:text-white'
    >
      <div className='flex w-full flex-row justify-between'>
        <div className='flex basis-3/4 flex-col gap-2'>
          <h3 className='text-lg font-semibold'>{issue.key}</h3>
          <p>{issue.fields.summary}</p>
        </div>
        <div className='flex h-full w-full basis-1/4 flex-col  items-center gap-2'>
          <div className='flex w-full justify-end'>
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold text-white md:text-sm  ${handleBgColor(
                issue.fields.status.name
              )}`}
            >
              {issue.fields.status.name}
            </span>
          </div>

          {issue.fields.assignee ? (
            <div className='flex w-full flex-col items-center justify-end gap-2  md:flex-row'>
              <Image
                className='rounded-full bg-gray-300'
                src={issue.fields?.assignee?.avatarUrls['48x48']}
                alt={issue.fields.assignee?.displayName + issue.key}
                width={24}
                height={24}
              />
              <span className='text-center text-xs md:text-sm'>
                {issue.fields.assignee.displayName}
              </span>
            </div>
          ) : (
            <div className='flex w-full flex-col items-center justify-end gap-2 md:flex-row'>
              <UserRound className='rounded-full bg-gray-300' />
              <span className='text-center text-xs md:text-sm'>Unassigned</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

'use client';
import { useEffect, useState } from 'react';
import {
  CommentCreationResponse,
  Issue,
  IssueResponse,
  JiraIssueResponse
} from 'types/jira';
import { IssueCard } from './issue-card';
import { IssueDetails } from './issue-details';
import NewTaskDialog from '@/features/kanban/components/new-task-dialog';
import { Heading } from '../ui/heading';

interface Props {
  project: string;
}

export const IssueList = ({ project }: Props) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [issueStatues, setIssueStatues] = useState<string[]>([]);
  const [issuesToDisplay, setIssuesToDisplay] = useState<Issue[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(
    null
  );

  const onIssueStatusChange = (status: string) => {
    // update issues to display
    const newIssues = issues.filter(
      (issue) => issue.fields.status.name === status
    );
    setIssuesToDisplay(newIssues);
  };

  const onIssueSelect = async (issue: Issue) => {
    const response = await fetch(`/api/jira/issues/${issue.key}`);
    const data = await response.json();
    setSelectedIssue(data);
  };
  const handleIssueUpdate = async (comment: CommentCreationResponse) => {
    selectedIssue &&
      setSelectedIssue({
        ...selectedIssue,
        fields: {
          ...selectedIssue.fields,
          comment: {
            ...selectedIssue.fields.comment,
            comments: [...selectedIssue.fields.comment.comments, comment]
          }
        }
      });
  };
  const handleTaskAdd = async () => {
    const response = await fetch(`/api/jira/issues?project=${project}`);
    const jiraResponse: JiraIssueResponse = await response.json();
    setIssues(jiraResponse.issues);
    setIssuesToDisplay(jiraResponse.issues);
  };

  const handleCloseComments = () => {
    setSelectedIssue(null);
  };

  const handleDeleteComment = async (id: string) => {
    setSelectedIssue((prev) => {
      if (!prev) return null;
      const comments = prev.fields.comment.comments.filter(
        (comment) => comment.id !== id
      );
      return {
        ...prev,
        fields: {
          ...prev.fields,
          comment: {
            ...prev.fields.comment,
            comments
          }
        }
      };
    });
  };

  // add issue status to issueStatues array
  useEffect(() => {
    const statuses = Array.from(
      new Set(issues.map((issue) => issue.fields.status.name))
    );
    setIssueStatues(statuses);
  }, [issues]);

  useEffect(() => {
    const getIssues = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/jira/issues?project=${project}`);
        const jiraResponse: JiraIssueResponse = await response.json();
        // find the project id
        const projectId = jiraResponse.issues[0].fields.project.id;
        setProjectId(projectId);
        setIssues(jiraResponse.issues);
        setIssuesToDisplay(jiraResponse.issues);
      } catch (error) {
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    getIssues();
  }, [project]);
  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={``}
          description='Manage tasks by dnd'
          project={project}
        />
        <NewTaskDialog onTaskAdd={handleTaskAdd} project={projectId} />
      </div>

      <section className='flex h-[80dvh] w-full  gap-4'>
        <div
          className={`flex w-full flex-col gap-4 
          transition-all duration-300 ease-in-out
          ${selectedIssue ? 'basis-1/2' : 'lg:basis-full'}`}
        >
          {issueStatues.length > 0 && (
            <div className=' space-y-2'>
              <h3 className='text-sm font-semibold'>Issue Status</h3>
              <div className='flex w-full justify-between space-x-2 lg:w-1/2 '>
                {issueStatues.map((status, index) => (
                  <span
                    key={index}
                    className='cursor-pointer 
                    text-sm
                    text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-200'
                    onClick={() => onIssueStatusChange(status)}
                  >
                    {status}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className='space-y-4 overflow-y-auto '>
            {issuesToDisplay.length ? (
              issuesToDisplay.map((issue) => (
                <IssueCard
                  onIssueSelect={onIssueSelect}
                  key={issue.id}
                  issue={issue}
                />
              ))
            ) : (
              <div className='text-sm text-gray-500'>
                {loading ? 'Loading...' : 'No issues found'}
              </div>
            )}
          </div>
        </div>
        <div
          className={`absolute right-0 top-0  z-10 flex h-full
           w-full transform flex-col rounded-lg bg-white p-4 shadow-2xl transition-all duration-300 ease-in-out dark:bg-gray-800 lg:relative ${
             selectedIssue
               ? 'lg:visible lg:basis-1/2'
               : 'hidden basis-0 lg:translate-x-full'
           }`}
        >
          {/* section for show a Issue */}

          {selectedIssue ? (
            <IssueDetails
              onClose={handleCloseComments}
              onIssueUpdate={handleIssueUpdate}
              onDeleteComment={handleDeleteComment}
              issue={selectedIssue}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-center text-sm text-gray-500'>
              No issue selected
            </div>
          )}
        </div>
      </section>
    </>
  );
};

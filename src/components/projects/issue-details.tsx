import { CommentCreationResponse, IssueResponse } from 'types/jira';
import { FieldsComment } from '../../../types/jira';
import { AddComment } from './add-comment';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface Props {
  issue: IssueResponse;
  onIssueUpdate: (issue: CommentCreationResponse) => void;
  onClose: () => void;
  onDeleteComment: (id: string) => void;
}

export const IssueDetails = ({
  issue,
  onIssueUpdate,
  onClose,
  onDeleteComment
}: Props) => {
  const handleAddComment = async (comment: string) => {
    if (!comment) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/jira/issues/${issue.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data: CommentCreationResponse = await response.json();
      if (response.ok) {
        // add comment to issue
        onIssueUpdate(data);

        toast.success('Comment added');
      } else {
        toast.error('Error adding comment');
      }
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await fetch(`/api/jira/issues/${issue.key}/comments/${id}`, {
        method: 'DELETE'
      });
      toast.success('Comment deleted');
      onDeleteComment(id);
    } catch (error) {
      toast.error('Error deleting comment');
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex w-full flex-col gap-2'>
        <div className='flex flex-row items-center'>
          <h3 className='text-xs font-light'>{issue.key}</h3>
          <Button
            variant='secondary'
            size='sm'
            className='ml-auto'
            onClick={onClose}
          >
            X
          </Button>
        </div>
        <p className='text-xl font-semibold'>{issue.fields.summary}</p>

        <span className='mb-4 flex flex-col gap-2'>
          {issue?.fields?.description?.content?.map((content) =>
            content.content.map((content, index) => (
              <p key={index} className='text-sm font-light'>
                {content.text}
              </p>
            ))
          )}
        </span>
      </div>
      <AddComment onSubmit={handleAddComment} />
      <CommentContent
        onDelete={handleDeleteComment}
        content={issue.fields.comment}
      />
    </div>
  );
};

const CommentContent = ({
  content,
  onDelete
}: {
  content: FieldsComment;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className='mb-6 flex h-[58dvh] flex-col gap-2 overflow-y-auto'>
      <h3 className='text-sm font-extralight'>{content.total} Comments</h3>
      {content.comments.map((comment, index) => (
        <div
          key={index}
          className='flex flex-col gap-2 border-l-2 border-gray-300 pl-2 shadow'
        >
          <div className='flex flex-row justify-between'>
            <h3 className='text-sm font-semibold'>
              {comment.author.displayName}
            </h3>
            <span className='text-xs font-light'>
              {new Date(comment.created).toLocaleDateString()}
            </span>
          </div>
          {comment.body.content.map((body) =>
            body.content.map((content, index) => (
              <p key={index} className='text-xs font-light '>
                {content.text}
              </p>
            ))
          )}
          {/* button delete */}
          <button
            onClick={() => onDelete(comment.id)}
            className='text-xs text-red-500'
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

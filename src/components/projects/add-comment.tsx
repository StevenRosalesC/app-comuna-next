'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AddNewCommentProps {
  onSubmit: (comment: string) => void;
}

export const AddComment = ({ onSubmit }: AddNewCommentProps) => {
  const [comment, setComment] = useState('');
  const handleClick = () => {
    onSubmit(comment);
    setComment('');
  };
  return (
    <div>
      <Input
        type='text'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Add a comment'
        className='w-full rounded-lg border-2 border-gray-300 p-2'
      />
      <Button onClick={() => handleClick()} className='mt-2'>
        Submit
      </Button>
    </div>
  );
};

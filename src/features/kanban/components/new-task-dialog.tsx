'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useEffect, useState } from 'react';
import { IssueTypeResponse } from 'types/jira';
import { toast } from 'sonner';

interface Props {
  project: string;
  onTaskAdd: () => void;
}

interface IssueType {
  id: string;
  name: string;
}

export default function NewTaskDialog({ project, onTaskAdd }: Props) {
  const [taskType, setTaskType] = useState<string>('');
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const issueType = formData.get('issueType') as string;

    if (!title || !description || !issueType) {
      toast.error('All fields are required');
      return;
    }

    const data = {
      title,
      description,
      issueType
    };
    try {
      const response = await fetch(`/api/jira/issues?project=${project}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        form.reset();
      }
      toast.success('Todo added');
      onTaskAdd();
    } catch (error) {
      toast.error('Error adding todo');
    }
  };

  useEffect(() => {
    if (!project) return;
    const getIssueTypes = async () => {
      const response = await fetch(`/api/jira/issuetype?project=${project}`);
      const data: IssueTypeResponse[] = await response.json();
      data.forEach((issueType) => {
        setIssueTypes((prev) => [
          ...prev,
          {
            id: issueType.id,
            name: issueType.name
          }
        ]);
      });
    };
    getIssueTypes();
  }, [project]);

  useEffect(() => {
    const defaultIssueType = issueTypes.find(
      (issueType) => issueType.name.toLowerCase().trim() === 'task'
    );
    if (defaultIssueType) {
      setTaskType(defaultIssueType.id);
    }
  }, [issueTypes]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm'>
          ＋ Add New Todo
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
          <DialogDescription>Add a new todo to the project</DialogDescription>
        </DialogHeader>
        <form
          id='todo-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='title'
              name='title'
              placeholder='Todo title...'
              className='col-span-4'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Textarea
              id='description'
              name='description'
              placeholder='Description...'
              className='col-span-4'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <select
              name='issueType'
              id='issueType'
              value={taskType}
              className='col-span-4 rounded-md border p-2'
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option value=''>Select Issue Type</option>
              {issueTypes.map((issueType) => (
                <option key={issueType.id} value={issueType.id}>
                  {issueType.name}
                </option>
              ))}
            </select>
          </div>
        </form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type='submit' size='sm' form='todo-form'>
              Add Todo
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

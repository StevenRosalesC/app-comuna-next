import { create } from 'zustand';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';
import { JiraIssueResponse } from 'types/jira';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

const getIssues = async () => {
  const response = await fetch('/api/jira/issues');
  return response.json();
};

getIssues().then((data: JiraIssueResponse) => {
  data.issues.forEach((issue) => {
    useTaskStore
      .getState()
      .addTask(
        issue.key,
        issue.fields.summary,
        issue.fields.description ?? undefined,
        handleStatusIssue(issue.fields.status.name)
      );
  });
});

const handleStatusIssue = (status: string): Status => {
  switch (status) {
    case 'To Do':
      return 'TODO';
    case 'In Progress':
      return 'IN_PROGRESS';
    case 'Done':
      return 'DONE';
    default:
      return 'TODO';
  }
};

const defaultCols = [
  {
    id: 'TODO' as const,
    title: 'Todo'
  },
  {
    id: 'IN_PROGRESS' as const,
    title: 'In Progress'
  },
  {
    id: 'DONE' as const,
    title: 'Done'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
};

const initialTasks: Task[] = [];

export type Actions = {
  addTask: (
    id: string,
    title: string,
    description?: string,
    status?: string
  ) => void;
  addCol: (title: string) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
};

export const useTaskStore = create<State & Actions>()((set) => ({
  tasks: initialTasks,
  columns: defaultCols,
  draggedTask: null,
  addTask: (id: string, title: string, description?: string, status?: string) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id, title, description, status: status as Status }
      ]
    })),
  updateCol: (id: UniqueIdentifier, newName: string) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === id ? { ...col, title: newName } : col
      )
    })),
  addCol: (title: string, id?: UniqueIdentifier, status?: Status) =>
    set((state) => ({
      columns: [
        ...state.columns,
        // { title, id: state.columns.length ? title.toUpperCase() : 'TODO' }
        { title, id: id ? id : (title.toUpperCase() as ColumnId) }
      ]
    })),
  dragTask: (id: string | null) => set({ draggedTask: id }),
  removeTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    })),
  removeCol: (id: UniqueIdentifier) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id)
    })),
  setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
  setCols: (newCols: Column[]) => set({ columns: newCols })
}));

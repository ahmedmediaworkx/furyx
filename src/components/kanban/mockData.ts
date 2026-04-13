export type Priority = 'low' | 'medium' | 'high';

export interface Tag {
  id: string;
  label: string;
  color: string; // Tailwind color class or hex
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  priority: Priority;
  tags: Tag[];
  assignee?: {
    name: string;
    avatar?: string;
  };
}

export interface Column {
  id: string;
  title: string;
}

export const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const initialTasks: Task[] = [
  {
    id: 't1',
    columnId: 'todo',
    title: 'Design high-energy drag and drop interactions',
    priority: 'high',
    tags: [
      { id: 'tg1', label: 'UX', color: 'bg-pink-500' },
      { id: 'tg2', label: 'Motion', color: 'bg-violet-500' }
    ],
    assignee: { name: 'Alice' }
  },
  {
    id: 't2',
    columnId: 'todo',
    title: 'Setup OKLCH theme variables',
    priority: 'medium',
    tags: [
      { id: 'tg3', label: 'Design System', color: 'bg-blue-500' }
    ]
  },
  {
    id: 't3',
    columnId: 'in-progress',
    title: 'Build task card component with rich density',
    priority: 'high',
    tags: [
      { id: 'tg4', label: 'Frontend', color: 'bg-orange-500' }
    ],
    assignee: { name: 'Bob' }
  },
  {
    id: 't4',
    columnId: 'review',
    title: 'Write impeccable design brief',
    priority: 'low',
    tags: [
      { id: 'tg5', label: 'Planning', color: 'bg-emerald-500' }
    ],
    assignee: { name: 'Charlie' }
  }
];

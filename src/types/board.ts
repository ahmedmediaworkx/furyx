export type BoardRole = "owner" | "member" | "viewer";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type BoardTask = {
  _id: string;
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  order: number;
  priority: TaskPriority;
  labels: string[];
  assigneeId?: string | null;
  dueDate?: string | null;
};

export type BoardColumn = {
  _id: string;
  boardId: string;
  name: string;
  order: number;
};

export type BoardSummary = {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt?: string;
};

export type BoardWithData = BoardSummary & {
  columns: BoardColumn[];
  tasks: BoardTask[];
};

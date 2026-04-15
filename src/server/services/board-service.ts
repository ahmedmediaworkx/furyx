import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { canCreateWorkspace, canManageWorkspace } from "@/lib/permissions";
import type { UserRole } from "@/lib/roles";
import { Board } from "@/models/Board";
import { Column } from "@/models/Column";
import { Task } from "@/models/Task";
import { formatDate } from "@/lib/date";
import { boardSchema } from "@/lib/validators";
import type { TaskPriority } from "@/types/board";

type IdValue = Types.ObjectId | string;

type BoardRecord = {
  _id: IdValue;
  name: string;
  description?: string;
  ownerId: IdValue;
  memberIds?: IdValue[];
  createdAt?: Date | string;
};

type ColumnRecord = {
  _id: IdValue;
  boardId: IdValue;
  name: string;
  order: number;
};

type TaskRecord = {
  _id: IdValue;
  boardId: IdValue;
  columnId: IdValue;
  title: string;
  description?: string;
  order: number;
  priority?: TaskPriority;
  labels?: string[];
  assigneeId?: IdValue | null;
  dueDate?: Date | string | null;
};

function toId(value: IdValue) {
  return value.toString();
}

function serializeBoard(board: BoardRecord) {
  return {
    _id: toId(board._id),
    name: board.name,
    description: board.description,
    ownerId: toId(board.ownerId),
    createdAt: formatDate(board.createdAt) ?? undefined
  };
}

function serializeColumn(column: ColumnRecord) {
  return {
    _id: toId(column._id),
    boardId: toId(column.boardId),
    name: column.name,
    order: column.order
  };
}

function serializeTask(task: TaskRecord) {
  return {
    _id: toId(task._id),
    boardId: toId(task.boardId),
    columnId: toId(task.columnId),
    title: task.title,
    description: task.description,
    order: task.order,
    priority: (task.priority ?? "medium") as TaskPriority,
    labels: task.labels ?? [],
    assigneeId: task.assigneeId ? toId(task.assigneeId) : null,
    dueDate: formatDate(task.dueDate)
  };
}

export async function assertBoardAccess(boardId: string, userId: string) {
  const board = await Board.findById(boardId);
  if (!board) {
    throw new Error("Board not found");
  }

  const isOwner = toId(board.ownerId) === userId;
  const isMember = (board.memberIds ?? []).some((member: IdValue) => toId(member) === userId);

  if (!isOwner && !isMember) {
    throw new Error("You do not have access to this board");
  }

  return board;
}

function assertCanCreateWorkspace(userRole: UserRole) {
  if (!canCreateWorkspace(userRole)) {
    throw new Error("Viewer accounts cannot create boards");
  }
}

function assertCanManageWorkspace(userRole: UserRole) {
  if (!canManageWorkspace(userRole)) {
    throw new Error("You do not have permission to manage boards");
  }
}

export async function listBoardsForUser(userId: string) {
  await connectDB();
  const boards = await Board.find({ $or: [{ ownerId: userId }, { memberIds: userId }] }).sort({ createdAt: -1 });
  return boards.map(serializeBoard);
}

export async function createBoard(userId: string, userRole: UserRole, input: { name: string; description?: string }) {
  await connectDB();
  assertCanCreateWorkspace(userRole);
  const parsed = boardSchema.parse(input);
  const board = await Board.create({
    name: parsed.name,
    description: parsed.description,
    ownerId: userId,
    memberIds: [userId]
  });

  await Column.create([
    { boardId: board._id, name: "Backlog", order: 0 },
    { boardId: board._id, name: "In Progress", order: 1 },
    { boardId: board._id, name: "Done", order: 2 }
  ]);

  return serializeBoard(board);
}

export async function getBoardWithData(boardId: string, userId: string) {
  await connectDB();
  await assertBoardAccess(boardId, userId);

  const [board, columns, tasks] = await Promise.all([
    Board.findById(boardId),
    Column.find({ boardId }).sort({ order: 1 }),
    Task.find({ boardId }).sort({ order: 1, createdAt: 1 })
  ]);

  if (!board) {
    throw new Error("Board not found");
  }

  return {
    ...serializeBoard(board),
    columns: columns.map(serializeColumn),
    tasks: tasks.map(serializeTask)
  };
}

export async function updateBoard(boardId: string, userId: string, userRole: UserRole, input: { name?: string; description?: string }) {
  await connectDB();
  await assertBoardAccess(boardId, userId);
  assertCanManageWorkspace(userRole);

  const board = await Board.findByIdAndUpdate(boardId, input, { new: true });
  if (!board) {
    throw new Error("Board not found");
  }

  return serializeBoard(board);
}

export async function deleteBoard(boardId: string, userId: string, userRole: UserRole) {
  await connectDB();
  const board = await assertBoardAccess(boardId, userId);
  assertCanManageWorkspace(userRole);
  await Promise.all([Board.deleteOne({ _id: board._id }), Column.deleteMany({ boardId }), Task.deleteMany({ boardId })]);
  return { success: true };
}

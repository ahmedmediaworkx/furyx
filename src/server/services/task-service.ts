import { connectDB } from "@/lib/db";
import { canEditWorkspace } from "@/lib/permissions";
import type { UserRole } from "@/lib/roles";
import { assertBoardAccess } from "@/server/services/board-service";
import { Column } from "@/models/Column";
import { Task } from "@/models/Task";
import { formatDate } from "@/lib/date";
import { taskMoveSchema, taskSchema } from "@/lib/validators";
import type { TaskPriority } from "@/types/board";
import { Types } from "mongoose";

type IdValue = Types.ObjectId | string;

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

function assertCanEditBoard(userRole: UserRole) {
  if (!canEditWorkspace(userRole)) {
    throw new Error("Viewer accounts cannot edit tasks");
  }
}

export async function createTask(userId: string, userRole: UserRole, input: unknown) {
  await connectDB();
  const parsed = taskSchema.parse(input);
  await assertBoardAccess(parsed.boardId, userId);
  assertCanEditBoard(userRole);

  const task = await Task.create({
    boardId: parsed.boardId,
    columnId: parsed.columnId,
    title: parsed.title,
    description: parsed.description,
    order: parsed.order ?? (await Task.countDocuments({ columnId: parsed.columnId })),
    priority: parsed.priority,
    labels: parsed.labels,
    assigneeId: parsed.assigneeId,
    dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null
  });

  return serializeTask(task);
}

export async function updateTask(userId: string, userRole: UserRole, taskId: string, input: Record<string, unknown>) {
  await connectDB();
  const task = (await Task.findById(taskId)) as TaskRecord | null;
  if (!task) {
    throw new Error("Task not found");
  }

  await assertBoardAccess(toId(task.boardId), userId);
  assertCanEditBoard(userRole);

  const move = taskMoveSchema.safeParse(input);
  const payload: Record<string, unknown> = { ...input };

  if (move.success) {
    const column = await Column.findById(move.data.columnId);
    if (!column) {
      throw new Error("Column not found");
    }
    payload.columnId = move.data.columnId;
    payload.order = move.data.order ?? task.order;
  }

  if (payload.dueDate && typeof payload.dueDate === "string") {
    payload.dueDate = new Date(payload.dueDate);
  }

  const updated = await Task.findByIdAndUpdate(taskId, payload, { new: true });
  if (!updated) {
    throw new Error("Task not found");
  }

  return serializeTask(updated);
}

export async function deleteTask(userId: string, userRole: UserRole, taskId: string) {
  await connectDB();
  const task = (await Task.findById(taskId)) as TaskRecord | null;
  if (!task) {
    throw new Error("Task not found");
  }

  await assertBoardAccess(toId(task.boardId), userId);
  assertCanEditBoard(userRole);
  await Task.deleteOne({ _id: taskId });
  return { success: true, boardId: toId(task.boardId) };
}

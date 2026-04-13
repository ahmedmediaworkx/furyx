import { connectDB } from "@/lib/db";
import { Board } from "@/models/Board";
import { Column } from "@/models/Column";
import { Task } from "@/models/Task";
import { taskMoveSchema, taskSchema } from "@/lib/validators";

function toId(value: any) {
  return value.toString();
}

function serializeTask(task: any) {
  return {
    _id: toId(task._id),
    boardId: toId(task.boardId),
    columnId: toId(task.columnId),
    title: task.title,
    description: task.description,
    order: task.order,
    priority: task.priority,
    labels: task.labels ?? [],
    assigneeId: task.assigneeId ? toId(task.assigneeId) : null,
    dueDate: task.dueDate ? task.dueDate.toISOString?.() ?? task.dueDate : null
  };
}

async function assertAccess(boardId: string, userId: string) {
  const board = await Board.findById(boardId);
  if (!board) {
    throw new Error("Board not found");
  }

  const isOwner = toId(board.ownerId) === userId;
  const isMember = (board.memberIds ?? []).some((member: any) => toId(member) === userId);

  if (!isOwner && !isMember) {
    throw new Error("You do not have access to this board");
  }
}

export async function createTask(userId: string, input: any) {
  await connectDB();
  const parsed = taskSchema.parse(input);
  await assertAccess(parsed.boardId, userId);

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

export async function updateTask(userId: string, taskId: string, input: Record<string, unknown>) {
  await connectDB();
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  await assertAccess(toId(task.boardId), userId);

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

export async function deleteTask(userId: string, taskId: string) {
  await connectDB();
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  await assertAccess(toId(task.boardId), userId);
  await Task.deleteOne({ _id: taskId });
  return { success: true, boardId: toId(task.boardId) };
}

import { connectDB } from "@/lib/db";
import { Column } from "@/models/Column";
import { Board } from "@/models/Board";
import { boardSchema, columnSchema } from "@/lib/validators";

function toId(value: any) {
  return value.toString();
}

function serializeColumn(column: any) {
  return {
    _id: toId(column._id),
    boardId: toId(column.boardId),
    name: column.name,
    order: column.order
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

export async function createColumn(userId: string, input: { boardId: string; name: string; order?: number }) {
  await connectDB();
  const parsed = columnSchema.parse(input);
  await assertAccess(parsed.boardId, userId);

  const column = await Column.create({
    boardId: parsed.boardId,
    name: parsed.name,
    order: parsed.order ?? (await Column.countDocuments({ boardId: parsed.boardId }))
  });

  return serializeColumn(column);
}

export async function updateColumn(userId: string, columnId: string, input: { name?: string; order?: number }) {
  await connectDB();
  const column = await Column.findById(columnId);
  if (!column) {
    throw new Error("Column not found");
  }

  await assertAccess(toId(column.boardId), userId);
  const updated = await Column.findByIdAndUpdate(columnId, input, { new: true });
  if (!updated) {
    throw new Error("Column not found");
  }

  return serializeColumn(updated);
}

export async function deleteColumn(userId: string, columnId: string) {
  await connectDB();
  const column = await Column.findById(columnId);
  if (!column) {
    throw new Error("Column not found");
  }

  await assertAccess(toId(column.boardId), userId);
  await Column.deleteOne({ _id: columnId });
  return { success: true, boardId: toId(column.boardId) };
}

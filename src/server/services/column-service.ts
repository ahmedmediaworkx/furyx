import { connectDB } from "@/lib/db";
import { canEditWorkspace } from "@/lib/permissions";
import type { UserRole } from "@/lib/roles";
import { assertBoardAccess } from "@/server/services/board-service";
import { Column } from "@/models/Column";
import { columnSchema } from "@/lib/validators";
import { Types } from "mongoose";

type IdValue = Types.ObjectId | string;

type ColumnRecord = {
  _id: IdValue;
  boardId: IdValue;
  name: string;
  order: number;
};

function toId(value: IdValue) {
  return value.toString();
}

function serializeColumn(column: ColumnRecord) {
  return {
    _id: toId(column._id),
    boardId: toId(column.boardId),
    name: column.name,
    order: column.order
  };
}

function assertCanEditBoard(userRole: UserRole) {
  if (!canEditWorkspace(userRole)) {
    throw new Error("Viewer accounts cannot edit columns");
  }
}

export async function createColumn(userId: string, userRole: UserRole, input: { boardId: string; name: string; order?: number }) {
  await connectDB();
  const parsed = columnSchema.parse(input);
  await assertBoardAccess(parsed.boardId, userId);
  assertCanEditBoard(userRole);

  const column = await Column.create({
    boardId: parsed.boardId,
    name: parsed.name,
    order: parsed.order ?? (await Column.countDocuments({ boardId: parsed.boardId }))
  });

  return serializeColumn(column);
}

export async function updateColumn(userId: string, userRole: UserRole, columnId: string, input: { name?: string; order?: number }) {
  await connectDB();
  const column = (await Column.findById(columnId)) as ColumnRecord | null;
  if (!column) {
    throw new Error("Column not found");
  }

  await assertBoardAccess(toId(column.boardId), userId);
  assertCanEditBoard(userRole);
  const updated = (await Column.findByIdAndUpdate(columnId, input, { new: true })) as ColumnRecord | null;
  if (!updated) {
    throw new Error("Column not found");
  }

  return serializeColumn(updated);
}

export async function deleteColumn(userId: string, userRole: UserRole, columnId: string) {
  await connectDB();
  const column = await Column.findById(columnId);
  if (!column) {
    throw new Error("Column not found");
  }

  await assertBoardAccess(toId(column.boardId), userId);
  assertCanEditBoard(userRole);
  await Column.deleteOne({ _id: columnId });
  return { success: true, boardId: toId(column.boardId) };
}

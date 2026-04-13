import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { deleteColumn, updateColumn } from "@/server/services/column-service";
import { emitBoardEvent } from "@/lib/socket-state";
import { BOARD_EVENTS } from "@/lib/constants";

type RouteContext = {
  params: Promise<{ columnId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { columnId } = await context.params;
    const payload = await request.json();
    const column = await updateColumn(session.user.id, columnId, payload);
    emitBoardEvent(column.boardId, BOARD_EVENTS.changed, { boardId: column.boardId, action: "column.updated" });
    return NextResponse.json({ column });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update column";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { columnId } = await context.params;
    const result = await deleteColumn(session.user.id, columnId);
    emitBoardEvent(result.boardId, BOARD_EVENTS.changed, { boardId: result.boardId, action: "column.deleted" });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete column";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

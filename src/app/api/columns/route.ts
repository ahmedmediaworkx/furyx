import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createColumn } from "@/server/services/column-service";
import { emitBoardEvent } from "@/lib/socket-state";
import { BOARD_EVENTS } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const column = await createColumn(session.user.id, session.user.role, payload);
    emitBoardEvent(column.boardId, BOARD_EVENTS.changed, { boardId: column.boardId, action: "column.created" });
    return NextResponse.json({ column }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create column";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

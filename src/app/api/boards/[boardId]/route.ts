import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { deleteBoard, getBoardWithData, updateBoard } from "@/server/services/board-service";
import { emitBoardEvent } from "@/lib/socket-state";
import { BOARD_EVENTS } from "@/lib/constants";

type RouteContext = {
  params: Promise<{ boardId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { boardId } = await context.params;
    const board = await getBoardWithData(boardId, session.user.id);
    return NextResponse.json({ board });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load board";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { boardId } = await context.params;
    const payload = await request.json();
    const board = await updateBoard(boardId, session.user.id, payload);
    emitBoardEvent(boardId, BOARD_EVENTS.changed, { boardId, action: "board.updated" });
    return NextResponse.json({ board });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update board";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { boardId } = await context.params;
    await deleteBoard(boardId, session.user.id);
    emitBoardEvent(boardId, BOARD_EVENTS.changed, { boardId, action: "board.deleted" });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete board";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createTask } from "@/server/services/task-service";
import { emitBoardEvent } from "@/lib/socket-state";
import { BOARD_EVENTS } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const task = await createTask(session.user.id, payload);
    emitBoardEvent(task.boardId, BOARD_EVENTS.changed, { boardId: task.boardId, action: "task.created" });
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

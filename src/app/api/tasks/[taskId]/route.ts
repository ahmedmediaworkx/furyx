import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { deleteTask, updateTask } from "@/server/services/task-service";
import { emitBoardEvent } from "@/lib/socket-state";
import { BOARD_EVENTS } from "@/lib/constants";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskId } = await context.params;
    const payload = await request.json();
    const task = await updateTask(session.user.id, taskId, payload);
    emitBoardEvent(task.boardId, BOARD_EVENTS.changed, { boardId: task.boardId, action: "task.updated" });
    return NextResponse.json({ task });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskId } = await context.params;
    const result = await deleteTask(session.user.id, taskId);
    emitBoardEvent(result.boardId, BOARD_EVENTS.changed, { boardId: result.boardId, action: "task.deleted" });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

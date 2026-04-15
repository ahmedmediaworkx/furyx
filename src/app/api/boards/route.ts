import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createBoard, listBoardsForUser } from "@/server/services/board-service";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const boards = await listBoardsForUser(session.user.id);
    return NextResponse.json({ boards });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load boards";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const board = await createBoard(session.user.id, session.user.role, payload);
    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create board";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

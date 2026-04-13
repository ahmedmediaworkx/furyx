import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getBoardWithData } from "@/server/services/board-service";
import { BoardView } from "@/components/board/board-view";

type PageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const { boardId } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const board = await getBoardWithData(boardId, session.user.id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 lg:px-8">
      <BoardView board={board} />
    </main>
  );
}

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { listBoardsForUser } from "@/server/services/board-service";
import { LayoutDashboard, Clock, Star, Plus } from "lucide-react";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const boards = await listBoardsForUser(session.user.id);

  // Playful alternating colors for boards
  const bgColors = ["bg-violet-500", "bg-pink-500", "bg-emerald-500", "bg-orange-500", "bg-blue-500"];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl p-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-slide-up">
          <div className="space-y-1">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">Your Workspaces</h1>
            <p className="text-lg text-muted-foreground">Pick up right where you left off.</p>
          </div>
          <div className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <CreateBoardDialog />
          </div>
        </div>

        {/* Filters Placeholder */}
        <div className="flex gap-2 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <button className="flex items-center gap-2 shrink-0 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors">
            <LayoutDashboard className="w-4 h-4" /> All Boards
          </button>
          <button className="flex items-center gap-2 shrink-0 rounded-full bg-transparent border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted">
            <Clock className="w-4 h-4" /> Recents
          </button>
          <button className="flex items-center gap-2 shrink-0 rounded-full bg-transparent border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted">
            <Star className="w-4 h-4" /> Starred
          </button>
        </div>

        {/* Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board, i) => (
            <Link 
              href={`/boards/${board._id}`} 
              key={board._id}
              className="animate-board-card group relative flex h-48 flex-col justify-between rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/50"
              style={{ animationDelay: `${i * 50 + 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-inner ${bgColors[i % bgColors.length]} text-white font-bold font-heading`}>
                  {board.name.charAt(0).toUpperCase()}
                </div>
                <button className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-foreground">
                  <Star className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold line-clamp-1">{board.name}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1 line-clamp-1">{board.description || "No description"}</p>
              </div>
            </Link>
          ))}

          {/* Fallback Empty State / Create Box */}
          {boards.length === 0 && (
            <div className="animate-board-card group flex h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-transparent p-6 text-center transition-all hover:border-primary/50" style={{ animationDelay: '150ms' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4 transition-transform group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary duration-300">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2">Your workspace is empty.<br/>Create a board to start planning.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

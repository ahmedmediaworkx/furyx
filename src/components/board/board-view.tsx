"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { BoardColumnView } from "@/components/board/board-column";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Share2, Plus } from "lucide-react";
import Link from "next/link";
import type { BoardWithData } from "@/types/board";

function groupTasksByColumn(board: BoardWithData) {
  return board.columns
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((column) => ({
      column,
      tasks: board.tasks.filter((task) => task.columnId === column._id).sort((left, right) => left.order - right.order)
    }));
}

export function BoardView({ board: initialBoard }: { board: BoardWithData }) {
  const router = useRouter();
  const [board, setBoard] = useState(initialBoard);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    setBoard(initialBoard);
  }, [initialBoard]);

  useEffect(() => {
    const client = io();
    client.emit("board:join", board._id);
    client.on("board:changed", () => {
      router.refresh();
    });
    return () => {
      client.emit("board:leave", board._id);
      client.disconnect();
    };
  }, [board._id, router]);

  const groupedColumns = useMemo(() => groupTasksByColumn(board), [board]);

  async function createTask(columnId: string, title: string, description: string) {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId: board._id, columnId, title, description })
    });

    if (response.ok) {
      router.refresh();
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const targetId = String(over.id);
    const targetColumn = board.columns.find((column) => column._id === targetId);
    const targetTask = board.tasks.find((task) => task._id === targetId);
    const nextColumnId = targetColumn?._id ?? targetTask?.columnId;

    if (!nextColumnId) {
      return;
    }

    const nextOrder = targetTask ? targetTask.order : board.tasks.filter((task) => task.columnId === nextColumnId).length;

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId: nextColumnId, order: nextOrder })
    });

    router.refresh();
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <header className="flex h-20 shrink-0 flex-col justify-center px-2 z-10 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors border border-transparent hover:border-border hover:text-foreground">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </Link>
          <div className="h-8 w-[2px] bg-border/50 mx-1 rounded-full" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight">{board.name}</h1>
              <span className="flex h-6 items-center rounded-full bg-primary/10 px-2.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                Workspace
              </span>
            </div>
            {board.description && <p className="text-sm font-medium text-muted-foreground mt-0.5">{board.description}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <CreateTaskDialog columns={board.columns} onCreate={createTask} />
          <button className="btn-ripple flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-bold text-secondary-foreground shadow-sm transition-all hover:scale-105 hover:bg-secondary/80 active:scale-95 duration-200">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="flex flex-1 items-start gap-6 overflow-x-auto kanban-scroll pb-6 pt-2 px-2">
          {groupedColumns.map(({ column, tasks }, idx) => (
            <div key={column._id} className="animate-slide-up" style={{ animationDelay: `${(idx + 1) * 50 + 100}ms` }}>
              <BoardColumnView column={column} tasks={tasks} />
            </div>
          ))}
          
          <button 
            className="animate-slide-up flex w-80 shrink-0 items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-transparent p-4 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary font-bold hover:scale-[1.01]"
            style={{ animationDelay: `${(groupedColumns.length + 1) * 50 + 100}ms` }}
          >
            <Plus className="w-5 h-5" /> Add List
          </button>
        </div>
      </DndContext>
    </div>
  );
}

function CreateTaskDialog({
  columns,
  onCreate
}: {
  columns: BoardWithData["columns"];
  onCreate: (columnId: string, title: string, description: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(columns[0]?._id ?? "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreate(columnId, title, description);
    setOpen(false);
    setTitle("");
    setDescription("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-ripple flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-md active:scale-95 duration-200">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold">New Task</DialogTitle>
          <DialogDescription className="text-base font-medium text-muted-foreground">Add a new item to this board.</DialogDescription>
        </DialogHeader>
        <form className="mt-6 space-y-5" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="task-title" className="font-bold ml-1 text-foreground">Title</Label>
            <Input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Design homepage hero" required className="rounded-xl border-input px-4 py-3 h-12 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description" className="font-bold ml-1 text-foreground">Description (optional)</Label>
            <Textarea id="task-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add links, details, or steps..." className="rounded-xl border-input px-4 py-3 min-h-[100px] focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-column" className="font-bold ml-1 text-foreground">Column</Label>
            <select
              id="task-column"
              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={columnId}
              onChange={(event) => setColumnId(event.target.value)}
            >
              {columns.map((column) => (
                <option key={column._id} value={column._id}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-ripple mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-md active:scale-95 duration-200" type="submit">
            Add Task
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

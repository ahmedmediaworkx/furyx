"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "@/components/board/task-card";
import type { BoardColumn, BoardTask } from "@/types/board";
import { cn } from "@/lib/utils";

type ColumnProps = {
  column: BoardColumn;
  tasks: BoardTask[];
};

export function BoardColumnView({ column, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ 
    id: column._id,
    data: {
      type: "Column",
      column
    }
  });

  return (
    <div 
      className="flex w-80 shrink-0 flex-col rounded-3xl bg-kanban-column p-3"
    >
      <div className="mb-4 flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-base font-bold text-foreground">
            {column.name}
          </h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors">
          <span className="sr-only">Column Options</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
            <path d="M3.625 7.5C3.625 8.12132 3.11764 8.625 2.5 8.625C1.88236 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.88236 6.375 2.5 6.375C3.11764 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.11764 8.625 7.5 8.625C6.88236 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.88236 6.375 7.5 6.375C8.11764 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1176 8.625 12.5 8.625C11.8824 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8824 6.375 12.5 6.375C13.1176 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 rounded-2xl transition-all duration-300 min-h-[150px]",
          isOver ? "bg-primary/5 ring-2 ring-primary/20 ring-inset scale-[1.01]" : "bg-transparent"
        )}
      >
        <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 p-8 text-center transition-all hover:border-border">
            <p className="text-sm font-bold text-foreground">Ready to start?</p>
            <p className="text-sm font-medium text-muted-foreground mt-1">Drag a task here or click 'New Task' to get moving.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

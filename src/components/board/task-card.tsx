"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, AlertCircle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BoardTask } from "@/types/board";

export function TaskCard({ task }: { task: BoardTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task._id,
    data: {
      type: "Task",
      task,
    }
  });

  const style = {
    transition: transition || "transform 250ms var(--ease-out-quart), box-shadow 250ms var(--ease-out-quart)",
    transform: CSS.Transform.toString(transform),
  };

  const priorityIcon = {
    high: <ArrowUpCircle className="w-4 h-4 text-destructive" />,
    medium: <AlertCircle className="w-4 h-4 text-amber-500" />,
    low: <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[120px] w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex w-full flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground shadow-sm ring-1 ring-border cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-all duration-200",
        isDragging && "rotate-2 scale-105 shadow-card-drag ring-primary/30 z-50 cursor-grabbing"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>

      {task.labels && task.labels.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pl-2">
          {task.labels.map((label) => (
            <span 
              key={label} 
              className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}

      <h3 className="font-heading font-semibold text-base leading-snug pl-2">
        {task.title}
      </h3>
      
      {task.description ? (
        <p className="text-sm text-muted-foreground line-clamp-2 pl-2">
          {task.description}
        </p>
      ) : null}

      <div className="flex items-center justify-between mt-1 pl-2">
        <div className="flex items-center gap-2">
          {priorityIcon[task.priority as keyof typeof priorityIcon] || <AlertCircle className="w-4 h-4 text-muted-foreground" />}
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {task.priority || "Normal"}
          </span>
        </div>
        
        {/* Fake assignee avatar for visual richness since it's missing from type */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background text-xs font-bold text-primary">
          {task.title.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

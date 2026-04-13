"use client";

import { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./mockData";
import { GripVertical, AlertCircle, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style: CSSProperties = {
    transition: transition || "transform 250ms var(--ease-out-quart), box-shadow 250ms var(--ease-out-quart)",
    transform: CSS.Transform.toString(transform),
  };

  const priorityIcon = {
    high: <ArrowUpCircle className="w-4 h-4 text-destructive" />,
    medium: <AlertCircle className="w-4 h-4 text-amber-500" />,
    low: <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
  };

  if (isDragging && !isOverlay) {
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
      className={`group relative flex w-full flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground shadow-sm ring-1 ring-border cursor-grab active:cursor-grabbing hover:shadow-card-hover ${
        isOverlay ? "rotate-2 scale-105 shadow-card-drag ring-primary/30 z-50 cursor-grabbing" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle hint - only shows on hover to keep it clean */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex flex-wrap gap-1.5 pl-2">
        {task.tags.map(tag => (
          <span 
            key={tag.id} 
            className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white rounded-full ${tag.color}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <h3 className="font-heading font-semibold text-base leading-snug pl-2">
        {task.title}
      </h3>

      <div className="flex items-center justify-between mt-1 pl-2">
        <div className="flex items-center gap-2">
          {priorityIcon[task.priority]}
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {task.priority}
          </span>
        </div>
        
        {task.assignee ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background text-xs font-bold text-primary" title={task.assignee.name}>
            {task.assignee.name.charAt(0)}
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground/30 text-xs">
            +
          </div>
        )}
      </div>
    </div>
  );
}

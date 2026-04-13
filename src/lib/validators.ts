import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const boardSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(240).optional().default("")
});

export const columnSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().min(2).max(80),
  order: z.number().int().nonnegative().optional()
});

export const taskSchema = z.object({
  boardId: z.string().min(1),
  columnId: z.string().min(1),
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional().default(""),
  order: z.number().int().nonnegative().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  labels: z.array(z.string().min(1).max(24)).optional().default([]),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable()
});

export const taskMoveSchema = z.object({
  columnId: z.string().min(1),
  order: z.number().int().nonnegative().optional()
});

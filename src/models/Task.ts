import { Schema, model, models, Types } from "mongoose";

const TaskSchema = new Schema(
  {
    boardId: { type: Types.ObjectId, ref: "Board", required: true, index: true },
    columnId: { type: Types.ObjectId, ref: "Column", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, required: true, default: 0 },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    labels: [{ type: String }],
    assigneeId: { type: Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

TaskSchema.index({ boardId: 1, columnId: 1, order: 1 });

export const Task = models.Task || model("Task", TaskSchema);

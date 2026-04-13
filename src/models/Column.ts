import { Schema, model, models, Types } from "mongoose";

const ColumnSchema = new Schema(
  {
    boardId: { type: Types.ObjectId, ref: "Board", required: true, index: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true
  }
);

ColumnSchema.index({ boardId: 1, order: 1 });

export const Column = models.Column || model("Column", ColumnSchema);

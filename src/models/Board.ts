import { Schema, model, models, Types } from "mongoose";

const BoardSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    ownerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    memberIds: [{ type: Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

export const Board = models.Board || model("Board", BoardSchema);

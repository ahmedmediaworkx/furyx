import { Schema, model, models, Types } from "mongoose";

const BoardInviteSchema = new Schema(
  {
    boardId: { type: Types.ObjectId, ref: "Board", required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    invitedById: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["pending", "accepted", "declined", "expired"], default: "pending", index: true },
    token: { type: String, required: true, unique: true, index: true },
    acceptedById: { type: Types.ObjectId, ref: "User", default: null },
    expiresAt: { type: Date, required: true, index: true }
  },
  {
    timestamps: true
  }
);

BoardInviteSchema.index({ boardId: 1, email: 1, status: 1 });

export const BoardInvite = models.BoardInvite || model("BoardInvite", BoardInviteSchema);
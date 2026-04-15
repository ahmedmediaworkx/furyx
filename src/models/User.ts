import mongoose, { Schema } from "mongoose";

const EmailSchema = new Schema(
  {
    address: { type: String, required: true, trim: true, lowercase: true },
    verified: { type: Boolean, default: false },
    primary: { type: Boolean, default: true }
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    profile: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, default: "", trim: true },
      displayName: { type: String, required: true, trim: true, alias: "name" },
      avatarUrl: { type: String, default: "" }
    },
    contact: {
      email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true, alias: "email" },
      phone: { type: String, default: "" }
    },
    emails: {
      type: [EmailSchema],
      default: []
    },
    security: {
      hash: { type: String, required: true, select: false, alias: "passwordHash" },
      passwordChangedAt: { type: Date, default: null },
      resetTokenHash: { type: String, default: null, select: false },
      resetTokenExpiresAt: { type: Date, default: null, select: false },
      lastLoginAt: { type: Date, default: null }
    },
    role: { type: String, enum: ["owner", "member", "viewer", "admin"], default: "member" },
    status: { type: String, enum: ["active", "invited", "suspended"], default: "active" },
    preferences: {
      theme: { type: String, enum: ["system", "light", "dark"], default: "system" },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "UTC" },
      notifications: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

UserSchema.virtual("name").get(function getDisplayName(this: any) {
  return this.profile?.displayName || [this.profile?.firstName, this.profile?.lastName].filter(Boolean).join(" ").trim() || this.contact?.email || "";
});

if (mongoose.models.User) {
  mongoose.deleteModel("User");
}

export const User = mongoose.model("User", UserSchema);

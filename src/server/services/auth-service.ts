import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  await connectDB();

  const normalizedEmail = input.email.toLowerCase().trim();
  const existing = await User.findOne({ "contact.email": normalizedEmail });
  if (existing) {
    throw new Error("Email is already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const displayName = input.name.trim();
  const nameParts = displayName.split(/\s+/);
  const firstName = nameParts[0] || displayName;
  const lastName = nameParts.slice(1).join(" ");

  const user = await User.create({
    profile: {
      firstName,
      lastName,
      displayName,
      avatarUrl: ""
    },
    contact: {
      email: normalizedEmail,
      phone: ""
    },
    emails: [
      {
        address: normalizedEmail,
        verified: false,
        primary: true
      }
    ],
    security: {
      hash: passwordHash,
      passwordChangedAt: new Date(),
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      lastLoginAt: null
    },
    role: "owner",
    status: "active"
  });

  return {
    id: user._id.toString(),
    name: user.profile.displayName,
    email: user.contact.email
  };
}

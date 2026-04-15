import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import type { UserRole } from "@/lib/roles";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        await connectDB();
        const user = await User.findOne({ "contact.email": email }).select("+security.hash");

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.security!.hash);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.profile?.displayName ?? user.contact?.email ?? "User",
          email: user.contact?.email ?? email,
          role: user.role as UserRole
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = (token.role as UserRole) ?? "member";
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

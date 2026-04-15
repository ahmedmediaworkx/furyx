import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { getToken } from "next-auth/jwt";
import { connectDB } from "../../lib/db";
import type { UserRole } from "../../lib/roles";
import { User } from "../../models/User";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class NextAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = (token as any)?.id || token?.sub;

    if (!userId) {
      throw new UnauthorizedException("Sign in to access team features");
    }

    await connectDB();
    const user = await User.findById(userId).select("profile contact role status");

    if (!user) {
      throw new UnauthorizedException("Session user not found");
    }

    if (user.status === "suspended") {
      throw new UnauthorizedException("Account is suspended");
    }

    request.user = {
      id: user._id.toString(),
      name: user.profile?.displayName || user.contact?.email || "User",
      email: user.contact?.email || "",
      role: (user.role as UserRole) || "member"
    } satisfies AuthenticatedUser;

    return true;
  }
}
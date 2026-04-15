import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { connectDB } from "../../lib/db";
import type { UserRole } from "../../lib/roles";
import { Board } from "../../models/Board";
import { BoardInvite } from "../../models/BoardInvite";
import { User } from "../../models/User";
import { emitBoardEvent } from "../../lib/socket-state";
import { formatDate } from "../../lib/date";
import type { AuthenticatedUser } from "./next-auth.guard";
import { Types } from "mongoose";

function isWorkspaceManager(role: UserRole) {
  return role === "owner" || role === "admin";
}

type IdValue = Types.ObjectId | string;

type UserRecord = {
  _id: IdValue;
  profile?: {
    displayName?: string;
  };
  contact?: {
    email?: string;
  };
  role?: UserRole;
};

type BoardRecord = {
  _id: IdValue;
  name: string;
  description?: string;
  ownerId: IdValue | UserRecord;
  memberIds?: Array<IdValue | UserRecord>;
  createdAt?: Date | string;
  populate: (path: string, select?: string) => Promise<unknown>;
};

type InviteRecord = {
  _id: IdValue;
  boardId: IdValue;
  email: string;
  message: string;
  status: string;
  token: string;
  invitedById: IdValue;
  acceptedById: IdValue | null;
  expiresAt: Date;
  createdAt?: Date | string;
  save: () => Promise<InviteRecord>;
};

function toId(value: IdValue | UserRecord) {
  return typeof value === "object" ? value._id.toString() : value.toString();
}

function isPopulatedUser(value: IdValue | UserRecord): value is UserRecord {
  return typeof value === "object" && value !== null && "_id" in value;
}

function isBoardParticipant(board: BoardRecord, userId: string) {
  const ownerId = toId(board.ownerId);
  const memberIds = (board.memberIds ?? []).map((member: IdValue | UserRecord) => toId(member));
  return ownerId === userId || memberIds.includes(userId);
}

@Injectable()
export class TeamService {
  private toId(value: IdValue | UserRecord) {
    return toId(value);
  }

  private serializeBoard(board: BoardRecord) {
    const owner = isPopulatedUser(board.ownerId) ? board.ownerId : null;

    return {
      _id: this.toId(board._id),
      name: board.name,
      description: board.description,
      ownerId: owner ? this.toId(owner._id) : this.toId(board.ownerId),
      owner: owner
        ? {
            id: this.toId(owner._id),
            name: owner.profile?.displayName ?? owner.contact?.email ?? "User",
            email: owner.contact?.email ?? "",
            role: owner.role ?? "member"
          }
        : null,
      memberCount: board.memberIds?.length ?? 0,
          createdAt: formatDate(board.createdAt) ?? undefined
    };
  }

  private serializeMember(member: IdValue | UserRecord) {
    return {
      id: this.toId(member),
      name: isPopulatedUser(member) ? member.profile?.displayName ?? member.contact?.email ?? "User" : "User",
      email: isPopulatedUser(member) ? member.contact?.email ?? "" : "",
      role: isPopulatedUser(member) ? member.role ?? "member" : "member"
    };
  }

  private serializeInvite(invite: InviteRecord) {
    return {
      id: this.toId(invite._id),
      boardId: this.toId(invite.boardId),
      email: invite.email,
      message: invite.message,
      status: invite.status,
      token: invite.token,
      invitedById: this.toId(invite.invitedById),
      acceptedById: invite.acceptedById ? this.toId(invite.acceptedById) : null,
      expiresAt: formatDate(invite.expiresAt) ?? undefined,
      createdAt: formatDate(invite.createdAt) ?? undefined
    };
  }

  private ensureBoardManager(user: AuthenticatedUser) {
    if (!isWorkspaceManager(user.role)) {
      throw new ForbiddenException("Only owners and admins can manage team access");
    }
  }

  private async ensureBoardAccess(boardId: string, user: AuthenticatedUser) {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    if (user.role !== "admin" && !isBoardParticipant(board, user.id)) {
      throw new ForbiddenException("You do not have access to this board");
    }

    return board;
  }

  async getOverview(user: AuthenticatedUser) {
    await connectDB();

    const [boards, invites] = await Promise.all([
      Board.find({ $or: [{ ownerId: user.id }, { memberIds: user.id }] })
        .sort({ createdAt: -1 })
        .populate("ownerId", "profile contact role")
        .populate("memberIds", "profile contact role"),
      BoardInvite.find({ email: user.email.toLowerCase(), status: "pending" }).sort({ createdAt: -1 })
    ]);

    return {
      user,
      boards: (boards as BoardRecord[]).map((board) => this.serializeBoard(board)),
      invites: (invites as InviteRecord[]).map((invite) => this.serializeInvite(invite))
    };
  }

  async getBoardTeam(user: AuthenticatedUser, boardId: string) {
    await connectDB();
    const board = (await this.ensureBoardAccess(boardId, user)) as BoardRecord;

    await board.populate("ownerId", "profile contact role");
    await board.populate("memberIds", "profile contact role");

    const invites = (await BoardInvite.find({ boardId }).sort({ createdAt: -1 })) as InviteRecord[];
    const members = [board.ownerId, ...(board.memberIds ?? [])]
      .filter(Boolean)
      .map((member: IdValue | UserRecord) => this.serializeMember(member));

    return {
      board: this.serializeBoard(board),
      members: Array.from(new Map(members.map((member) => [member.id, member])).values()),
      invites: invites.map((invite) => this.serializeInvite(invite))
    };
  }

  async createInvite(user: AuthenticatedUser, input: { boardId?: string; email?: string; message?: string }) {
    await connectDB();
    this.ensureBoardManager(user);

    const boardId = input.boardId?.trim();
    const email = input.email?.trim().toLowerCase();
    const message = input.message?.trim() ?? "";

    if (!boardId) {
      throw new BadRequestException("boardId is required");
    }

    if (!email) {
      throw new BadRequestException("email is required");
    }

    const board = await Board.findById(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    if (board.ownerId?.toString?.() !== user.id && user.role !== "admin") {
      throw new ForbiddenException("Only the board owner or an admin can invite members");
    }

    const existingUser = await User.findOne({ "contact.email": email }).select("profile contact role status");
    if (existingUser && existingUser.status === "suspended") {
      throw new ForbiddenException("This user is suspended");
    }

    const existingInvite = await BoardInvite.findOne({ boardId: board._id, email, status: "pending" });
    if (existingInvite) {
      return {
        reused: true,
        invite: this.serializeInvite(existingInvite)
      };
    }

    const invite = await BoardInvite.create({
      boardId: board._id,
      email,
      invitedById: user.id,
      message,
      token: randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    emitBoardEvent(this.toId(board._id), "team:invite:created", {
      boardId: this.toId(board._id),
      invite: this.serializeInvite(invite)
    });

    return {
      reused: false,
      invite: this.serializeInvite(invite)
    };
  }

  async acceptInvite(user: AuthenticatedUser, token: string) {
    await connectDB();

    const inviteToken = token.trim();
    if (!inviteToken) {
      throw new BadRequestException("Invite token is required");
    }

    const invite = await BoardInvite.findOne({ token: inviteToken });
    if (!invite) {
      throw new NotFoundException("Invite not found");
    }

    if (invite.status !== "pending") {
      throw new BadRequestException("Invite is no longer pending");
    }

    if (invite.email !== user.email.toLowerCase()) {
      throw new ForbiddenException("This invite was sent to a different email address");
    }

    if (invite.expiresAt.getTime() < Date.now()) {
      invite.status = "expired";
      await invite.save();
      throw new BadRequestException("Invite has expired");
    }

    const board = await Board.findById(invite.boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    await Board.updateOne({ _id: board._id }, { $addToSet: { memberIds: user.id } });

    invite.status = "accepted";
    invite.acceptedById = user.id;
    await invite.save();

    emitBoardEvent(this.toId(board._id), "team:invite:accepted", {
      boardId: this.toId(board._id),
      invite: this.serializeInvite(invite),
      userId: user.id
    });

    return {
      success: true,
      invite: this.serializeInvite(invite)
    };
  }

  async removeMember(user: AuthenticatedUser, boardId: string, memberId: string) {
    await connectDB();
    this.ensureBoardManager(user);

    const board = await Board.findById(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    if (board.ownerId?.toString?.() === memberId) {
      throw new BadRequestException("Board owner cannot be removed");
    }

    await Board.updateOne({ _id: board._id }, { $pull: { memberIds: memberId } });

    emitBoardEvent(this.toId(board._id), "team:member:removed", {
      boardId: this.toId(board._id),
      memberId
    });

    return { success: true };
  }
}
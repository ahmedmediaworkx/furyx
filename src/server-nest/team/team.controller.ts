import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { NextAuthGuard, type AuthenticatedUser } from "./next-auth.guard";
import { TeamService } from "./team.service";

type TeamRequest = {
  user: AuthenticatedUser;
};

@Controller("api/team")
@UseGuards(NextAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get("overview")
  getOverview(@Req() request: TeamRequest) {
    return this.teamService.getOverview(request.user);
  }

  @Get("boards/:boardId")
  getBoardTeam(@Req() request: TeamRequest, @Param("boardId") boardId: string) {
    return this.teamService.getBoardTeam(request.user, boardId);
  }

  @Post("invites")
  createInvite(@Req() request: TeamRequest, @Body() body: { boardId?: string; email?: string; message?: string }) {
    return this.teamService.createInvite(request.user, body);
  }

  @Post("invites/:token/accept")
  acceptInvite(@Req() request: TeamRequest, @Param("token") token: string) {
    return this.teamService.acceptInvite(request.user, token);
  }

  @Delete("boards/:boardId/members/:memberId")
  removeMember(@Req() request: TeamRequest, @Param("boardId") boardId: string, @Param("memberId") memberId: string) {
    return this.teamService.removeMember(request.user, boardId, memberId);
  }
}
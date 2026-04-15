import { Module } from "@nestjs/common";
import { NextAuthGuard } from "./next-auth.guard";
import { TeamController } from "./team.controller";
import { TeamGateway } from "./team.gateway";
import { TeamService } from "./team.service";

@Module({
  controllers: [TeamController],
  providers: [TeamService, TeamGateway, NextAuthGuard]
})
export class TeamModule {}
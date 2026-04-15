import { Module } from "@nestjs/common";
import { TeamModule } from "./team/team.module";

@Module({
  imports: [TeamModule]
})
export class AppModule {}
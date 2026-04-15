import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { setSocketServer } from "../../lib/socket-state";

@WebSocketGateway({
  cors: {
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    credentials: true
  }
})
export class TeamGateway implements OnGatewayInit {
  private readonly logger = new Logger(TeamGateway.name);

  @WebSocketServer()
  server!: Server;

  afterInit(server: Server) {
    setSocketServer(server);
    this.logger.log("Socket gateway ready");
  }

  @SubscribeMessage("board:join")
  handleBoardJoin(@ConnectedSocket() socket: Socket, @MessageBody() boardId: string) {
    socket.join(`board:${boardId}`);
    return { ok: true };
  }

  @SubscribeMessage("board:leave")
  handleBoardLeave(@ConnectedSocket() socket: Socket, @MessageBody() boardId: string) {
    socket.leave(`board:${boardId}`);
    return { ok: true };
  }

  @SubscribeMessage("team:join")
  handleTeamJoin(@ConnectedSocket() socket: Socket, @MessageBody() boardId: string) {
    socket.join(`board:${boardId}`);
    return { ok: true };
  }

  @SubscribeMessage("team:leave")
  handleTeamLeave(@ConnectedSocket() socket: Socket, @MessageBody() boardId: string) {
    socket.leave(`board:${boardId}`);
    return { ok: true };
  }
}
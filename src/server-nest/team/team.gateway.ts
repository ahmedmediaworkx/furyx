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
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
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
    if (process.env.REDIS_URL) {
      const pubClient = new Redis(process.env.REDIS_URL);
      const subClient = pubClient.duplicate();
      server.adapter(createAdapter(pubClient, subClient));
      this.logger.log("Socket.IO using Redis adapter");
    } else {
      this.logger.warn("REDIS_URL not set — using in-memory adapter (single instance only)");
    }
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
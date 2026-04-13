const http = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { setSocketServer } = require("./src/lib/socket-state");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      credentials: true
    }
  });

  setSocketServer(io);

  io.on("connection", (socket) => {
    socket.on("board:join", (boardId) => {
      socket.join(`board:${boardId}`);
    });

    socket.on("board:leave", (boardId) => {
      socket.leave(`board:${boardId}`);
    });
  });

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`FuryX running on http://localhost:${port}`);
  });
});

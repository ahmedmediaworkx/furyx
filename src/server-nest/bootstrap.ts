import "reflect-metadata";
import express, { type NextFunction, type Request, type Response } from "express";
import next from "next";
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { connectDB } from "../lib/db";
import { AppModule } from "./app.module";

export async function bootstrap() {
  const dev = process.env.NODE_ENV !== "production";
  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();
  const server = express();

  await nextApp.prepare();
  await connectDB();

  server.use("/api/team", express.json({ limit: "1mb" }));
  server.use("/api/team", express.urlencoded({ extended: true }));
  server.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api/team")) {
      return next();
    }

    return handle(req, res).catch(next);
  });

  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    bodyParser: false
  });

  nestApp.enableCors({
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    credentials: true
  });

  await nestApp.init();

  const port = Number(process.env.PORT || 3000);
  await nestApp.listen(port);
  console.log(`FuryX running on http://localhost:${port}`);
}
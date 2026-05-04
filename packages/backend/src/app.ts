import express, { Application } from "express";
import cors from "cors";
import authRouter from "@/modules/auth/routes";
import usersRouter from "@/modules/user/user.routes";
import chatRouter from "@/modules/chat/routes";
import { errorHandler } from "@/middleware/errorHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api", chatRouter);

app.get("/", (_req, res) => {
  res.json({ message: "AI Chat Backend" });
});

app.use(errorHandler);

export default app;

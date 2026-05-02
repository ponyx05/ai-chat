import express, { Application } from "express";
import cors from "cors";
import { authRouter, usersRouter, chatRouter } from "./routes/index.js";
import helloRouter from "./routes/hello.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api", chatRouter);
app.use("/api", helloRouter);

app.get("/", (_req, res) => {
  res.json({ message: "AI Chat Backend" });
});

app.use(errorHandler);

export default app;

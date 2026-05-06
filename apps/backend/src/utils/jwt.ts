import jwt from "jsonwebtoken";
import { JwtPayload } from "@/utils/types/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

export function generateToken(payload: { userId: number }): {
  token: string;
  expiresAt: Date;
} {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, expiresAt };
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

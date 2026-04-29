export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

export interface UserData {
  userId: number;
  username: string;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface RegisterResponse {
  userId: number;
  username: string;
}

export interface RegisterBody {
  username: string;
  password: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  userId: number;
  tokenId: number;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

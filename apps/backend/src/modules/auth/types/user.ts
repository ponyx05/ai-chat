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

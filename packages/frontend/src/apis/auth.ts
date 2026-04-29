import request, { type ApiResponse } from './request'

export interface LoginReq {
  username: string
  password: string
}

export interface LoginResp {
  token: string
  expiresAt: string
}

export interface RegisterReq {
  username: string
  password: string
}

export interface RegisterResp {
  userId: number
  username: string
}

export interface UserInfo {
  userId: number
  username: string
  createdAt: string
}

export const login = (data: LoginReq) => {
  return request.post<any, { data: ApiResponse<LoginResp> }>('/auth/login', data)
}

export const register = (data: RegisterReq) => {
  return request.post<any, { data: ApiResponse<RegisterResp> }>('/auth/register', data)
}

export const logout = () => {
  return request.post<any, { data: ApiResponse<null> }>('/auth/logout')
}

export const getCurrentUser = () => {
  return request.get<any, { data: ApiResponse<UserInfo> }>('/auth/me')
}

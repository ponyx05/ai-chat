import request, { type ApiResponse } from './request'

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export const changePassword = (data: ChangePasswordReq) => {
  return request.put<any, { data: ApiResponse<null> }>('/users/password', data)
}

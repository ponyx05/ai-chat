import request, { type ApiResponse } from './request'

export interface Session {
  id: number
  title: string
  updatedAt: string
}

export const getSessions = () => {
  return request.get<any, { data: ApiResponse<Session[]> }>('/sessions')
}

export const deleteSession = (id: number) => {
  return request.delete<any, { data: ApiResponse<null> }>(`/sessions/${id}`)
}
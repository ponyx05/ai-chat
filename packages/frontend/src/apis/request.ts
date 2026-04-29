import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

export type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse }

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface ApiError {
  code: number
  message: string
  data: null
}

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (response.data.code !== 200 && response.data.code !== 201) {
      return Promise.reject(new Error(response.data.message || 'Request failed'))
    }
    return response
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const message = error.response.data?.message || error.message || 'Request failed'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  }
)

export default request

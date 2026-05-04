import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken, removeToken } from '../utils/storage'
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser as getCurrentUserApi, UserInfo } from '../apis/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = () => !!token.value

  const setUserToken = (newToken: string) => {
    token.value = newToken
    setToken(newToken)
  }

  const clearAuth = () => {
    token.value = null
    userInfo.value = null
    removeToken()
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return null
    try {
      const res = await getCurrentUserApi()
      userInfo.value = res.data.data
      return userInfo.value
    } catch {
      clearAuth()
      return null
    }
  }

  const login = async (username: string, password: string) => {
    const res = await loginApi({ username, password })
    const data = res.data.data
    setUserToken(data.token)
    await fetchCurrentUser()
    return data
  }

  const register = async (username: string, password: string) => {
    const res = await registerApi({ username, password })
    return res.data.data
  }

  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      clearAuth()
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setUserToken,
    clearAuth,
    fetchCurrentUser,
    login,
    register,
    logout
  }
})

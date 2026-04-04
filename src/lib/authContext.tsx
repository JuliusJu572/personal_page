import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'

type UserInfo = {
  id: number
  username: string
  role: string
  frozen: boolean
  quotaTokens: number
  usedTokens: number
  payMode: number
  payModeLabel: string
  expiresAt: string | null
  weeklyQuota: number
  monthlyLimit: number
  currentPoints: number
  monthlyUsedPoints: number
}

type AuthContextValue = {
  user: UserInfo | null
  loading: boolean
  refresh: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  login: async (_username: string, _password: string) => {},
  register: async (_username: string, _password: string) => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!api.getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const data = await api.getMe()
      setUser({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        frozen: data.user.frozen,
        quotaTokens: data.user.quotaTokens,
        usedTokens: data.user.usedTokens,
        payMode: data.user.payMode,
        payModeLabel: data.user.payModeLabel,
        expiresAt: data.user.expiresAt,
        weeklyQuota: data.user.weeklyQuota,
        monthlyLimit: data.user.monthlyLimit,
        currentPoints: data.user.currentPoints,
        monthlyUsedPoints: data.user.monthlyUsedPoints,
      })
    } catch {
      api.clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const data = await api.login(username, password)
    api.setToken(data.token)
    await refresh()
  }, [refresh])

  const register = useCallback(async (username: string, password: string) => {
    const data = await api.register(username, password)
    api.setToken(data.token)
    await refresh()
  }, [refresh])

  const logout = useCallback(() => {
    api.clearToken()
    setUser(null)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

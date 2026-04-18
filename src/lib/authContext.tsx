import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'

type UserInfo = {
  id: number
  username: string
  email: string
  inviteCode: string
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
  register: (username: string, email: string, password: string, code: string, inviteCode?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await api.getMe()
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email || '',
        inviteCode: data.user.inviteCode || '',
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
      // 401 means no valid cookie → user is not logged in
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  /** Login: server sets HttpOnly cookie; we then refresh user info. */
  const login = useCallback(async (username: string, password: string) => {
    await api.login(username, password)
    await refresh()
  }, [refresh])

  /** Register: server sets HttpOnly cookie; we then refresh user info. */
  const register = useCallback(async (username: string, email: string, password: string, code: string, inviteCode?: string) => {
    await api.register(username, email, password, code, inviteCode)
    await refresh()
  }, [refresh])

  /** Logout: server clears the cookie, we clear local state. */
  const logout = useCallback(async () => {
    try { await api.logout() } catch { /* ignore errors */ }
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

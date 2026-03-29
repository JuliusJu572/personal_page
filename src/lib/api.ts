const API_BASE = 'http://182.92.63.149:8787'

class ApiError extends Error {
  code: string
  status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  const token = localStorage.getItem('userToken')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(
      data?.error || `HTTP ${res.status}`,
      data?.code || '',
      res.status,
    )
  }

  return data as T
}

export interface LoginResponse {
  success: boolean
  token: string
  user: {
    id: number
    username: string
    role: string
    frozen: boolean
    quotaTokens: number
    usedTokens: number
    created_at: string
  }
}

export interface RegisterResponse {
  success: boolean
  token: string
  user: {
    id: number
    username: string
    role: string
    frozen: boolean
    quotaTokens: number
    usedTokens: number
    created_at: string
  }
}

export interface MeResponse {
  success: boolean
  user: {
    id: number
    username: string
    licenseKey: string
    createdAt: string
    role: string
    frozen: boolean
    quotaTokens: number
    usedTokens: number
  }
}

export interface BalanceResponse {
  success: boolean
  usedTokens: number
  quotaTokens: number
  frozen: boolean
}

export const api = {
  login(username: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  register(username: string, password: string) {
    return request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  getMe() {
    return request<MeResponse>('/auth/me')
  },

  getBalance() {
    return request<BalanceResponse>('/api/user/balance')
  },

  getToken() {
    return localStorage.getItem('userToken') || ''
  },

  setToken(token: string) {
    if (token) localStorage.setItem('userToken', token)
    else localStorage.removeItem('userToken')
  },

  clearToken() {
    localStorage.removeItem('userToken')
  },
}

export { ApiError }

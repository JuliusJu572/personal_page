const API_BASE = ''

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
    license_key: string
    license_type: string
    pay_mode: number
    pay_mode_label: string
    expires_at: string | null
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
    licenseType: string
    payMode: number
    payModeLabel: string
    expiresAt: string | null
    createdAt: string
    role: string
    frozen: boolean
    quotaTokens: number
    usedTokens: number
    weeklyQuota: number
    monthlyLimit: number
    currentPoints: number
    monthlyUsedPoints: number
    lastWeeklyReset: string | null
  }
  serverTime: string
}

export interface DashboardResponse {
  success: boolean
  weeklyQuota: number
  monthlyLimit: number
  currentPoints: number
  monthlyUsedPoints: number
  lastWeeklyReset: string | null
  nextWeeklyReset: string
  nextMonthlyReset: string
  serverTime: string
  payMode: number
  payModeLabel: string
  weekCallCount: number
  topModels: Array<{ model: string; count: number }>
}

export interface BalanceResponse {
  success: boolean
  usedTokens: number
  quotaTokens: number
  frozen: boolean
}

export interface KnowledgeCardMeta {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

export interface KnowledgeCardData extends KnowledgeCardMeta {
  markdown: string
}

export interface KnowledgeCardsListResponse {
  success: boolean
  cards: KnowledgeCardMeta[]
}

export interface KnowledgeCardGetResponse {
  success: boolean
  card: KnowledgeCardData
}

export interface KnowledgeCardSaveResponse {
  success: boolean
  card: KnowledgeCardData
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

  getDashboard() {
    return request<DashboardResponse>('/api/user/dashboard')
  },

  listKnowledgeCards() {
    return request<KnowledgeCardsListResponse>('/api/knowledge-cards/list')
  },

  getKnowledgeCard(cardId: string) {
    return request<KnowledgeCardGetResponse>(`/api/knowledge-cards/${cardId}`)
  },

  saveKnowledgeCard(markdown: string, name: string) {
    return request<KnowledgeCardSaveResponse>('/api/knowledge-cards/save', {
      method: 'POST',
      body: JSON.stringify({ markdown, name }),
    })
  },

  updateKnowledgeCard(cardId: string, markdown: string, name?: string) {
    return request<KnowledgeCardSaveResponse>(`/api/knowledge-cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify({ markdown, name }),
    })
  },

  deleteKnowledgeCard(cardId: string) {
    return request<{ success: boolean }>(`/api/knowledge-cards/${cardId}`, {
      method: 'DELETE',
    })
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

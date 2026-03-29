export type KnowledgeDraftMeta = { id: string; name: string; updatedAt: number }
export type KnowledgeDraft = KnowledgeDraftMeta & { markdown: string }

export type KnowledgeDraftHistoryItem = { savedAt: number; markdown: string }

export type KnowledgePublishedMeta = { id: string; name: string; updatedAt: number }
export type KnowledgePublished = KnowledgePublishedMeta & { markdown: string }

export type SavedKnowledgeCardMeta = { id: string; name: string; createdAt: number; updatedAt: number }
export type SavedKnowledgeCard = SavedKnowledgeCardMeta & { markdown: string }

let _userId: string | null = null

export function setStorageUserId(userId: string | number | null) {
  _userId = userId != null ? String(userId) : null
}

function prefix() {
  return _userId ? `knowledgeCards:u${_userId}:` : 'knowledgeCards:'
}

const KEY = {
  drafts: () => `${prefix()}drafts`,
  draft: (id: string) => `${prefix()}draft:${id}`,
  draftHistory: (id: string) => `${prefix()}draftHistory:${id}`,
  published: () => `${prefix()}published`,
  publishedItem: (id: string) => `${prefix()}published:${id}`,
  savedCards: () => `${prefix()}savedCards`,
  savedCard: (id: string) => `${prefix()}savedCard:${id}`,
} as const

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function sortByUpdatedDesc<T extends { updatedAt: number }>(items: T[]) {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt)
}

export function listDraftMetas(): KnowledgeDraftMeta[] {
  if (typeof window === 'undefined') return []
  const metas = safeJsonParse<KnowledgeDraftMeta[]>(window.localStorage.getItem(KEY.drafts())) ?? []
  return sortByUpdatedDesc(metas)
}

export function loadDraft(id: string): KnowledgeDraft | null {
  if (typeof window === 'undefined') return null
  const meta = listDraftMetas().find((d) => d.id === id)
  if (!meta) return null
  const markdown = window.localStorage.getItem(KEY.draft(id)) ?? ''
  return { ...meta, markdown }
}

export function createDraft(markdown: string, name?: string): KnowledgeDraft {
  if (typeof window === 'undefined') {
    return { id: uuid(), name: name ?? '新草稿', updatedAt: Date.now(), markdown }
  }

  const id = uuid()
  const now = Date.now()
  const meta: KnowledgeDraftMeta = {
    id,
    name: (name ?? '新草稿').trim() || '新草稿',
    updatedAt: now,
  }

  const metas = listDraftMetas().filter((d) => d.id !== id)
  window.localStorage.setItem(KEY.drafts(), JSON.stringify([meta, ...metas]))
  window.localStorage.setItem(KEY.draft(id), markdown)
  window.localStorage.setItem(KEY.draftHistory(id), JSON.stringify([] satisfies KnowledgeDraftHistoryItem[]))

  return { ...meta, markdown }
}

export function saveDraft(id: string, markdown: string, updates?: { name?: string }) {
  if (typeof window === 'undefined') return

  const now = Date.now()
  const metas = listDraftMetas()
  const existing = metas.find((d) => d.id === id)
  const nextMeta: KnowledgeDraftMeta = {
    id,
    name: (updates?.name ?? existing?.name ?? '草稿').trim() || '草稿',
    updatedAt: now,
  }

  const nextMetas = sortByUpdatedDesc([nextMeta, ...metas.filter((d) => d.id !== id)])
  window.localStorage.setItem(KEY.drafts(), JSON.stringify(nextMetas))

  window.localStorage.setItem(KEY.draft(id), markdown)

  const history = listDraftHistory(id)
  const nextHistory: KnowledgeDraftHistoryItem[] = [
    { savedAt: now, markdown },
    ...history.filter((h) => h.markdown !== markdown).slice(0, 29),
  ]
  window.localStorage.setItem(KEY.draftHistory(id), JSON.stringify(nextHistory))
}

export function deleteDraft(id: string) {
  if (typeof window === 'undefined') return
  const metas = listDraftMetas().filter((d) => d.id !== id)
  window.localStorage.setItem(KEY.drafts(), JSON.stringify(metas))
  window.localStorage.removeItem(KEY.draft(id))
  window.localStorage.removeItem(KEY.draftHistory(id))
}

export function listDraftHistory(id: string): KnowledgeDraftHistoryItem[] {
  if (typeof window === 'undefined') return []
  const history =
    safeJsonParse<KnowledgeDraftHistoryItem[]>(window.localStorage.getItem(KEY.draftHistory(id))) ?? []
  return [...history].sort((a, b) => b.savedAt - a.savedAt)
}

export function listPublishedMetas(): KnowledgePublishedMeta[] {
  if (typeof window === 'undefined') return []
  const metas = safeJsonParse<KnowledgePublishedMeta[]>(window.localStorage.getItem(KEY.published())) ?? []
  return sortByUpdatedDesc(metas)
}

export function loadPublished(id: string): KnowledgePublished | null {
  if (typeof window === 'undefined') return null
  const meta = listPublishedMetas().find((d) => d.id === id)
  if (!meta) return null
  const markdown = window.localStorage.getItem(KEY.publishedItem(id)) ?? ''
  return { ...meta, markdown }
}

export function publishFromDraft(draft: KnowledgeDraft, updates?: { name?: string }) {
  if (typeof window === 'undefined') {
    return { id: uuid(), name: updates?.name ?? draft.name, updatedAt: Date.now(), markdown: draft.markdown }
  }

  const id = uuid()
  const now = Date.now()
  const meta: KnowledgePublishedMeta = {
    id,
    name: (updates?.name ?? draft.name ?? '已发布').trim() || '已发布',
    updatedAt: now,
  }

  const metas = listPublishedMetas()
  const nextMetas = sortByUpdatedDesc([meta, ...metas])
  window.localStorage.setItem(KEY.published(), JSON.stringify(nextMetas))
  window.localStorage.setItem(KEY.publishedItem(id), draft.markdown)
  return { ...meta, markdown: draft.markdown }
}

export function listSavedCardMetas(): SavedKnowledgeCardMeta[] {
  if (typeof window === 'undefined') return []
  const metas = safeJsonParse<SavedKnowledgeCardMeta[]>(window.localStorage.getItem(KEY.savedCards())) ?? []
  return sortByUpdatedDesc(metas)
}

export function loadSavedCard(id: string): SavedKnowledgeCard | null {
  if (typeof window === 'undefined') return null
  const meta = listSavedCardMetas().find((d) => d.id === id)
  if (!meta) return null
  const markdown = window.localStorage.getItem(KEY.savedCard(id)) ?? ''
  return { ...meta, markdown }
}

export function saveKnowledgeCard(markdown: string, name: string): SavedKnowledgeCard {
  if (typeof window === 'undefined') {
    return { id: uuid(), name, createdAt: Date.now(), updatedAt: Date.now(), markdown }
  }

  const id = uuid()
  const now = Date.now()
  const meta: SavedKnowledgeCardMeta = { id, name: name.trim() || '未命名', createdAt: now, updatedAt: now }

  const metas = listSavedCardMetas()
  window.localStorage.setItem(KEY.savedCards(), JSON.stringify(sortByUpdatedDesc([meta, ...metas])))
  window.localStorage.setItem(KEY.savedCard(id), markdown)
  return { ...meta, markdown }
}

export function updateSavedCard(id: string, markdown: string, name?: string) {
  if (typeof window === 'undefined') return
  const metas = listSavedCardMetas()
  const existing = metas.find((d) => d.id === id)
  if (!existing) return

  const now = Date.now()
  const updated: SavedKnowledgeCardMeta = {
    ...existing,
    name: name ? name.trim() || existing.name : existing.name,
    updatedAt: now,
  }
  window.localStorage.setItem(KEY.savedCards(), JSON.stringify(sortByUpdatedDesc([updated, ...metas.filter((d) => d.id !== id)])))
  window.localStorage.setItem(KEY.savedCard(id), markdown)
}

export function deleteSavedCard(id: string) {
  if (typeof window === 'undefined') return
  const metas = listSavedCardMetas().filter((d) => d.id !== id)
  window.localStorage.setItem(KEY.savedCards(), JSON.stringify(metas))
  window.localStorage.removeItem(KEY.savedCard(id))
}

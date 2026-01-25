export type KnowledgeDraftMeta = { id: string; name: string; updatedAt: number }
export type KnowledgeDraft = KnowledgeDraftMeta & { markdown: string }

export type KnowledgeDraftHistoryItem = { savedAt: number; markdown: string }

export type KnowledgePublishedMeta = { id: string; name: string; updatedAt: number }
export type KnowledgePublished = KnowledgePublishedMeta & { markdown: string }

const KEY = {
  drafts: 'knowledgeCards:drafts',
  draft: (id: string) => `knowledgeCards:draft:${id}`,
  draftHistory: (id: string) => `knowledgeCards:draftHistory:${id}`,
  published: 'knowledgeCards:published',
  publishedItem: (id: string) => `knowledgeCards:published:${id}`,
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
  const metas = safeJsonParse<KnowledgeDraftMeta[]>(window.localStorage.getItem(KEY.drafts)) ?? []
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
  window.localStorage.setItem(KEY.drafts, JSON.stringify([meta, ...metas]))
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
  window.localStorage.setItem(KEY.drafts, JSON.stringify(nextMetas))

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
  window.localStorage.setItem(KEY.drafts, JSON.stringify(metas))
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
  const metas = safeJsonParse<KnowledgePublishedMeta[]>(window.localStorage.getItem(KEY.published)) ?? []
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
  window.localStorage.setItem(KEY.published, JSON.stringify(nextMetas))
  window.localStorage.setItem(KEY.publishedItem(id), draft.markdown)
  return { ...meta, markdown: draft.markdown }
}


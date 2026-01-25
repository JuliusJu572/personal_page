import type { KnowledgeBrowseItem, KnowledgeCard, KnowledgeFolderLevel } from './types'

export type KnowledgeBrowseFilter = { h1: string | null; h2: string | null; h3: string | null }

function groupByCategory(cards: KnowledgeCard[], level: KnowledgeFolderLevel): KnowledgeBrowseItem[] {
  const groups = new Map<string, { title: string | null; count: number }>()

  for (const card of cards) {
    const value = card[level]
    const key = value === null ? '___NULL___' : value
    const group = groups.get(key)
    if (group) group.count += 1
    else groups.set(key, { title: value, count: 1 })
  }

  return Array.from(groups.values()).map((g) => ({ type: 'folder', level, title: g.title, count: g.count }))
}

export function getBrowseItems(cards: KnowledgeCard[], filter: KnowledgeBrowseFilter): KnowledgeBrowseItem[] {
  let filtered = cards
  if (filter.h1) filtered = filtered.filter((c) => c.h1 === filter.h1)
  if (filter.h2) filtered = filtered.filter((c) => c.h2 === filter.h2)
  if (filter.h3) filtered = filtered.filter((c) => c.h3 === filter.h3)

  if (filtered.length === 0) return []

  if (!filter.h1) return groupByCategory(filtered, 'h1')

  if (!filter.h2) {
    const categories = groupByCategory(filtered, 'h2')
    const hasValidH2 = categories.some((c) => c.type === 'folder' && c.title !== null && c.title !== '未分类')
    if (hasValidH2 || categories.length > 1) {
      return categories.map((c) => ({
        ...c,
        title: c.title || '（无二级标题）',
      }))
    }
  }

  if (!filter.h3) {
    const categories = groupByCategory(filtered, 'h3')
    const hasValidH3 = categories.some((c) => c.type === 'folder' && c.title !== null)
    if (hasValidH3) {
      return categories.map((c) => ({
        ...c,
        title: c.title || '（无三级标题）',
      }))
    }
  }

  return filtered.map((c) => ({ type: 'note', data: c, title: c.title, count: null }))
}


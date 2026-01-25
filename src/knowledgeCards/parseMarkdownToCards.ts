import type { KnowledgeCard } from './types'

function splitLinesKeepEndings(input: string): string[] {
  if (!input) return []
  const matches = input.match(/.*(?:\r\n|\n|$)/g)
  if (!matches) return []
  if (matches.length > 0 && matches[matches.length - 1] === '') return matches.slice(0, -1)
  return matches
}

export function parseMarkdownToCards(markdown: string): KnowledgeCard[] {
  const lines = splitLinesKeepEndings(markdown)

  const cards: KnowledgeCard[] = []
  let currentH1 = '未分类'
  let currentH2: string | null = null
  let currentH3: string | null = null
  let currentTitle: string | null = null
  let currentContent: string[] = []

  const flushCard = () => {
    const contentStr = currentContent.join('').trim()
    if (contentStr) {
      cards.push({
        id: cards.length,
        h1: currentH1,
        h2: currentH2,
        h3: currentH3,
        title: currentTitle ?? '无标题',
        content: contentStr,
      })
    }
    currentContent = []
  }

  for (const line of lines) {
    const stripped = line.trim()
    if (stripped.startsWith('# ')) {
      flushCard()
      currentH1 = stripped.slice(2).trim()
      currentH2 = null
      currentH3 = null
      currentTitle = currentH1
      continue
    }

    if (stripped.startsWith('## ')) {
      flushCard()
      currentH2 = stripped.slice(3).trim()
      currentH3 = null
      currentTitle = currentH2
      continue
    }

    if (stripped.startsWith('### ')) {
      flushCard()
      currentH3 = stripped.slice(4).trim()
      currentTitle = currentH3
      continue
    }

    currentContent.push(line)
  }

  flushCard()
  return cards
}


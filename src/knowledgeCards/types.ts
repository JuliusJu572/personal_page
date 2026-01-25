export type KnowledgeCard = {
  id: number
  h1: string
  h2: string | null
  h3: string | null
  title: string
  content: string
}

export type KnowledgeFolderLevel = 'h1' | 'h2' | 'h3'

export type KnowledgeBrowseItem =
  | { type: 'folder'; level: KnowledgeFolderLevel; title: string | null; count: number }
  | { type: 'note'; data: KnowledgeCard; title: string; count: null }


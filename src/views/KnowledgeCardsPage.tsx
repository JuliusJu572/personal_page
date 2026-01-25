import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getBrowseItems, type KnowledgeBrowseFilter } from '../knowledgeCards/browseModel'
import { parseMarkdownToCards } from '../knowledgeCards/parseMarkdownToCards'
import { renderMarkdownWithMath } from '../knowledgeCards/renderMarkdownWithMath'
import { listDraftMetas, listPublishedMetas, loadDraft, loadPublished } from '../knowledgeCards/storage'
import type { KnowledgeBrowseItem, KnowledgeCard } from '../knowledgeCards/types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './knowledgeCardsPage.module.css'

const NUMPAD_MAP = [7, 8, 9, 4, 5, 6, 1, 2, 3]

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

async function ensureMathJax() {
  const w = window as unknown as { MathJax?: unknown }
  if (w.MathJax) return
  ;(window as unknown as { MathJax: unknown }).MathJax = {
    tex: {
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)'],
      ],
      displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]'],
      ],
      processEscapes: true,
    },
    svg: { fontCache: 'global' },
  }
  await loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js')
}

export function KnowledgeCardsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const draftId = searchParams.get('draft')
  const publishedId = searchParams.get('published')

  const [markdown, setMarkdown] = useState<string>('')
  const [sourceLabel, setSourceLabel] = useState<string>('')
  const [sourceDraftId, setSourceDraftId] = useState<string | null>(null)

  useEffect(() => {
    const fromState = (location.state as { markdown?: string } | null)?.markdown
    if (fromState) {
      setMarkdown(fromState)
      setSourceLabel('临时预览')
      setSourceDraftId(null)
      return
    }

    if (publishedId) {
      const published = loadPublished(publishedId)
      if (published) {
        setMarkdown(published.markdown)
        setSourceLabel(`已发布：${published.name}`)
        setSourceDraftId(null)
        return
      }
    }

    if (draftId) {
      const draft = loadDraft(draftId)
      if (draft) {
        setMarkdown(draft.markdown)
        setSourceLabel(`草稿：${draft.name}`)
        setSourceDraftId(draft.id)
        return
      }
    }

    const latestPublishedMeta = listPublishedMetas()[0]
    if (latestPublishedMeta) {
      const published = loadPublished(latestPublishedMeta.id)
      if (published) {
        setMarkdown(published.markdown)
        setSourceLabel(`已发布：${published.name}`)
        setSourceDraftId(null)
        return
      }
    }

    const latestDraftMeta = listDraftMetas()[0]
    if (latestDraftMeta) {
      const draft = loadDraft(latestDraftMeta.id)
      if (draft) {
        setMarkdown(draft.markdown)
        setSourceLabel(`草稿：${draft.name}`)
        setSourceDraftId(draft.id)
        return
      }
    }

    setMarkdown('')
    setSourceLabel('')
    setSourceDraftId(null)
  }, [draftId, location.state, publishedId])
  const cards = useMemo(() => parseMarkdownToCards(markdown), [markdown])

  const [filter, setFilter] = useState<KnowledgeBrowseFilter>({ h1: null, h2: null, h3: null })
  const [page, setPage] = useState<number>(0)
  const itemsPerPage = 9

  const [modalCard, setModalCard] = useState<KnowledgeCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalBodyRef = useRef<HTMLDivElement | null>(null)

  const allItems = useMemo(() => getBrowseItems(cards, filter), [cards, filter])
  const totalPages = Math.max(1, Math.ceil(allItems.length / itemsPerPage))

  useEffect(() => {
    if (page >= totalPages) setPage(totalPages - 1)
  }, [page, totalPages])

  const pageItems = useMemo(() => {
    const start = page * itemsPerPage
    return allItems.slice(start, start + itemsPerPage)
  }, [allItems, page])

  const breadcrumb = useMemo(() => {
    const parts = [
      filter.h1 ? { label: filter.h1, resetTo: 'h1' as const } : null,
      filter.h2 ? { label: filter.h2, resetTo: 'h2' as const } : null,
      filter.h3 ? { label: filter.h3, resetTo: null } : null,
    ].filter(Boolean) as Array<{ label: string; resetTo: 'h1' | 'h2' | null }>

    return parts
  }, [filter.h1, filter.h2, filter.h3])

  const goBack = useCallback(() => {
    if (isModalOpen) {
      setIsModalOpen(false)
      window.setTimeout(() => setModalCard(null), 220)
      return
    }

    setPage(0)
    setFilter((prev) => {
      if (prev.h3) return { ...prev, h3: null }
      if (prev.h2) return { ...prev, h2: null, h3: null }
      if (prev.h1) return { h1: null, h2: null, h3: null }
      return prev
    })
  }, [isModalOpen])

  const resetFilter = useCallback((level: 'all' | 'h1' | 'h2') => {
    setPage(0)
    setFilter((prev) => {
      if (level === 'all') return { h1: null, h2: null, h3: null }
      if (level === 'h1') return { ...prev, h2: null, h3: null }
      return { ...prev, h3: null }
    })
  }, [])

  const handleSelect = useCallback(
    (visualIndex: number) => {
    const realIndex = page * itemsPerPage + visualIndex
    const item = allItems[realIndex]
    if (!item) return

    if (item.type === 'folder') {
      setPage(0)
      setFilter((prev) => {
        if (item.level === 'h1') return { h1: item.title, h2: null, h3: null }
        if (item.level === 'h2') return { ...prev, h2: item.title, h3: null }
        return { ...prev, h3: item.title }
      })
      return
    }

    setModalCard(item.data)
    setIsModalOpen(true)
    },
    [allItems, page],
  )

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(allItems.length / itemsPerPage) - 1
    if (page < maxPage) setPage((p) => p + 1)
  }, [allItems.length, page])

  const prevPage = useCallback(() => {
    if (page > 0) setPage((p) => p - 1)
  }, [page])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === '0' || e.key === 'Escape') {
          e.preventDefault()
          goBack()
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          modalBodyRef.current?.scrollBy({ top: 120, behavior: 'smooth' })
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          modalBodyRef.current?.scrollBy({ top: -120, behavior: 'smooth' })
        }
        return
      }

      if (e.key === '0' || e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        goBack()
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goBack()
        return
      }

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        handleSelect(Number.parseInt(e.key, 10) - 1)
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'd') nextPage()
      if (e.key === 'ArrowLeft' || e.key === 'a') prevPage()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [goBack, handleSelect, isModalOpen, nextPage, prevPage])

  const modalHtml = useMemo(() => (modalCard ? renderMarkdownWithMath(modalCard.content) : ''), [modalCard])

  useEffect(() => {
    if (!isModalOpen) return
    const body = modalBodyRef.current
    if (!body) return

    body.querySelectorAll('pre code').forEach((node) => {
      hljs.highlightElement(node as HTMLElement)
    })

    ensureMathJax()
      .then(() => {
        const mj = window as unknown as { MathJax?: { typesetPromise?: (elements: Element[]) => Promise<void> } }
        return mj.MathJax?.typesetPromise?.([body]) ?? Promise.resolve()
      })
      .catch(() => {})
  }, [isModalOpen, modalHtml])

  if (!markdown || cards.length === 0) {
    return (
      <Container className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title}>知识卡片</h1>
            <p className={styles.subtitle}>
              将 Markdown 按标题层级拆分为卡片，并以更适合复习的方式浏览。
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link to="/knowledge-cards/editor">
              <Button>编辑 / 上传</Button>
            </Link>
            <Button variant="secondary" onClick={() => navigate(-1)} disabled={location.key === 'default'}>
              返回
            </Button>
          </div>
        </div>

        <Card className={styles.placeholder}>
          <div className={styles.placeholderTitle}>未加载任何内容</div>
          <div className={styles.placeholderDesc}>
            请前往“编辑 / 上传”页面加载 Markdown 文件，或发布一个版本后再来浏览。
          </div>
          <div className={styles.placeholderActions}>
            <Link to="/knowledge-cards/editor">
              <Button variant="secondary">去编辑</Button>
            </Link>
          </div>
        </Card>
      </Container>
    )
  }

  const visualToItem = (visualIndex: number): KnowledgeBrowseItem | undefined => pageItems[visualIndex]

  return (
    <Container className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerCopy}>
          <h1 className={styles.title}>知识卡片</h1>
          <p className={styles.subtitle}>
            将 Markdown 按标题层级拆分为卡片，并以更适合复习的方式浏览。
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link to="/knowledge-cards/editor">
            <Button>编辑 / 上传</Button>
          </Link>
          {sourceDraftId ? (
            <Link to={`/knowledge-cards/editor?draft=${encodeURIComponent(sourceDraftId)}`}>
              <Button variant="secondary">编辑该草稿</Button>
            </Link>
          ) : null}
          <Button variant="secondary" onClick={goBack} disabled={!filter.h1 && !filter.h2 && !filter.h3}>
            返回上级
          </Button>
        </div>
      </div>

      {sourceLabel ? <div className={styles.sourceLabel}>{sourceLabel}</div> : null}

      <div className={styles.breadcrumbBar}>
        <button type="button" className={styles.breadcrumbHome} onClick={() => resetFilter('all')}>
          首页
        </button>
        {breadcrumb.map((b, idx) => (
          <div key={`${b.label}-${idx}`} className={styles.breadcrumbPart}>
            <span className={styles.breadcrumbSep}>/</span>
            {b.resetTo === 'h1' || b.resetTo === 'h2' ? (
              <button
                type="button"
                className={styles.breadcrumbLink}
                onClick={() => resetFilter(b.resetTo === 'h1' ? 'h1' : 'h2')}
              >
                {b.label}
              </button>
            ) : (
              <span className={styles.breadcrumbCurrent}>{b.label}</span>
            )}
          </div>
        ))}

        <div className={styles.breadcrumbRight}>
          <div className={styles.hotkeys}>
            <span className={styles.kbd}>1-9</span>
            <span>选择</span>
          </div>
          <div className={styles.hotkeys}>
            <span className={styles.kbd}>0</span>
            <span>返回</span>
          </div>
        </div>
      </div>

      <div className={styles.gridWrap}>
        {allItems.length === 0 ? (
          <Card className={styles.empty}>
            <div className={styles.emptyTitle}>该分类下暂无内容</div>
            <div className={styles.emptyDesc}>试试返回上级，或在编辑页加载新的 Markdown。</div>
          </Card>
        ) : (
          <div className={styles.grid}>
            {NUMPAD_MAP.map((keyNum) => {
              const visualIndex = keyNum - 1
              const item = visualToItem(visualIndex)
              if (!item) return <div key={keyNum} className={styles.gridSpacer} />

              const isFolder = item.type === 'folder'
              const metaLeft = isFolder ? `${item.count} 篇` : `#${item.data.id}`
              const subtitle = !isFolder && item.data.h2 ? `${item.data.h1} / ${item.data.h2}` : null

              return (
                <button
                  key={keyNum}
                  type="button"
                  className={styles.itemButton}
                  onClick={() => handleSelect(visualIndex)}
                >
                  <Card className={styles.itemCard}>
                    <div className={styles.keyBadge}>{keyNum}</div>
                    <div className={[styles.icon, isFolder ? styles.iconFolder : styles.iconNote].join(' ')} />
                    <div className={styles.itemTitle}>{item.title}</div>
                    {subtitle ? <div className={styles.itemSubtitle}>{subtitle}</div> : null}
                    <div className={styles.itemFooter}>
                      <span className={styles.itemMeta}>{metaLeft}</span>
                      {isFolder ? <span className={styles.itemArrow} aria-hidden="true" /> : null}
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        )}

        {Math.ceil(allItems.length / itemsPerPage) > 1 ? (
          <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(allItems.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={[styles.pageDot, i === page ? styles.pageDotActive : undefined].filter(Boolean).join(' ')}
                onClick={() => setPage(i)}
                aria-label={`第 ${i + 1} 页`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {modalCard ? (
        <div
          className={[styles.modalOverlay, isModalOpen ? styles.modalOverlayOpen : styles.modalOverlayClosed]
            .filter(Boolean)
            .join(' ')}
          role="dialog"
          aria-modal="true"
          aria-label="知识卡片详情"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) goBack()
          }}
        >
          <div className={[styles.modalPanel, isModalOpen ? styles.modalPanelOpen : styles.modalPanelClosed].join(' ')}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderCopy}>
                <div className={styles.modalTitle}>{modalCard.title}</div>
                <div className={styles.modalPath}>
                  {[modalCard.h1, modalCard.h2, modalCard.h3].filter(Boolean).join(' / ')}
                </div>
              </div>
              <Button variant="secondary" onClick={goBack}>
                0 返回
              </Button>
            </div>

            <div
              ref={modalBodyRef}
              className={styles.modalBody}
              dangerouslySetInnerHTML={{ __html: modalHtml }}
            />
          </div>
        </div>
      ) : null}
    </Container>
  )
}

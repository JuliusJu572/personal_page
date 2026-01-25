import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { parseMarkdownToCards } from '../knowledgeCards/parseMarkdownToCards'
import { renderMarkdownWithMath } from '../knowledgeCards/renderMarkdownWithMath'
import {
  createDraft,
  deleteDraft,
  listDraftHistory,
  listDraftMetas,
  loadDraft,
  publishFromDraft,
  saveDraft,
  type KnowledgeDraftHistoryItem,
} from '../knowledgeCards/storage'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './knowledgeCardEditorPage.module.css'

function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

async function tryFetchText(url: string) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(String(res.status))
  return await res.text()
}

export function KnowledgeCardEditorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryDraftId = searchParams.get('draft')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [markdown, setMarkdown] = useState<string>('')
  const [draftId, setDraftId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState<string>('新草稿')
  const [draftMetasVersion, setDraftMetasVersion] = useState<number>(0)
  const [history, setHistory] = useState<KnowledgeDraftHistoryItem[]>([])
  const [status, setStatus] = useState<string>('')
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)

  const cards = useMemo(() => parseMarkdownToCards(markdown), [markdown])
  const selectedCard =
    selectedCardId === null ? cards[0] : cards.find((c) => c.id === selectedCardId) ?? cards[0]

  const previewHtml = useMemo(
    () => (selectedCard ? renderMarkdownWithMath(selectedCard.content) : ''),
    [selectedCard],
  )

  const stats = useMemo(() => {
    const lines = markdown ? markdown.split(/\r?\n/).length : 0
    const chars = markdown.length
    return { lines, chars }
  }, [markdown])

  useEffect(() => {
    if (queryDraftId) {
      const draft = loadDraft(queryDraftId)
      if (draft) {
        setDraftId(draft.id)
        setDraftName(draft.name)
        setMarkdown(draft.markdown)
        setSelectedCardId(null)
        setHistory(listDraftHistory(draft.id))
        setStatus(`已加载草稿：${draft.name}`)
        return
      }
    }

    const latest = listDraftMetas()[0]
    if (latest) {
      const draft = loadDraft(latest.id)
      if (draft) {
        setDraftId(draft.id)
        setDraftName(draft.name)
        setMarkdown(draft.markdown)
        setSelectedCardId(null)
        setHistory(listDraftHistory(draft.id))
        setStatus(`已加载草稿：${draft.name}`)
        return
      }
    }

    setDraftId(null)
    setDraftName('新草稿')
    setHistory([])
  }, [draftMetasVersion, queryDraftId])

  const draftMetas = useMemo(() => {
    void draftMetasVersion
    return listDraftMetas()
  }, [draftMetasVersion])

  const onNewDraft = () => {
    const draft = createDraft('', '新草稿')
    setDraftId(draft.id)
    setDraftName(draft.name)
    setMarkdown(draft.markdown)
    setSelectedCardId(null)
    setHistory([])
    setDraftMetasVersion((v) => v + 1)
    setStatus('已创建新草稿')
    navigate(`/knowledge-cards/editor?draft=${encodeURIComponent(draft.id)}`, { replace: true })
  }

  const onSaveDraft = () => {
    if (!draftId) {
      const created = createDraft(markdown, draftName)
      setDraftId(created.id)
      setDraftName(created.name)
      setDraftMetasVersion((v) => v + 1)
      setHistory(listDraftHistory(created.id))
      setStatus('已保存为新草稿')
      navigate(`/knowledge-cards/editor?draft=${encodeURIComponent(created.id)}`, { replace: true })
      return
    }

    saveDraft(draftId, markdown, { name: draftName })
    setDraftMetasVersion((v) => v + 1)
    setHistory(listDraftHistory(draftId))
    setStatus('已保存草稿')
  }

  const onPublish = () => {
    if (!draftId) {
      const created = createDraft(markdown, draftName)
      const published = publishFromDraft(created)
      setDraftId(created.id)
      setDraftName(created.name)
      setDraftMetasVersion((v) => v + 1)
      setHistory(listDraftHistory(created.id))
      setStatus(`已发布：${published.name}`)
      navigate(`/knowledge-cards?published=${encodeURIComponent(published.id)}`)
      return
    }

    saveDraft(draftId, markdown, { name: draftName })
    const draft = loadDraft(draftId)
    if (!draft) return
    const published = publishFromDraft(draft)
    setDraftMetasVersion((v) => v + 1)
    setHistory(listDraftHistory(draftId))
    setStatus(`已发布：${published.name}`)
    navigate(`/knowledge-cards?published=${encodeURIComponent(published.id)}`)
  }

  const onDeleteDraft = () => {
    if (!draftId) return
    deleteDraft(draftId)
    setDraftMetasVersion((v) => v + 1)
    setStatus('已删除草稿')
    navigate('/knowledge-cards/editor', { replace: true })
  }

  const onLoadDefault = async () => {
    setStatus('正在加载 contents.md…')
    const candidates = ['/@fs/d:/07_juliusju/contents.md', '/@fs/D:/07_juliusju/contents.md', '/contents.md']
    for (const url of candidates) {
      try {
        const text = await tryFetchText(url)
        setMarkdown(text)
        setSelectedCardId(null)
        setStatus(`已加载：${url}`)
        return
      } catch {
        continue
      }
    }
    setStatus('未找到 contents.md：请上传文件，或将其放入 site/public/contents.md')
  }

  useEffect(() => {
    const body = previewRef.current
    if (!body) return
    body.querySelectorAll('pre code').forEach((node) => {
      hljs.highlightElement(node as HTMLElement)
    })
  }, [previewHtml])

  return (
    <Container className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerCopy}>
          <h1 className={styles.title}>知识卡片编辑</h1>
          <p className={styles.subtitle}>加载/编辑 Markdown，并实时预览与发布。</p>
        </div>

        <div className={styles.headerActions}>
          <Link to="/knowledge-cards">
            <Button variant="secondary">去浏览</Button>
          </Link>
          <Button variant="secondary" onClick={onNewDraft}>
            新建草稿
          </Button>
          <Button variant="secondary" onClick={onSaveDraft}>
            保存
          </Button>
          <Button onClick={onPublish} disabled={!markdown}>
            发布
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/knowledge-cards', { state: { markdown } })}
            disabled={!markdown}
          >
            预览当前
          </Button>
          <Button variant="secondary" onClick={onLoadDefault}>
            加载 contents.md
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            上传 Markdown
          </Button>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            onChange={async (e) => {
              const file = e.currentTarget.files?.[0]
              if (!file) return
              const text = await file.text()
              setMarkdown(text)
              setSelectedCardId(null)
              setStatus(`已加载：${file.name}`)
            }}
          />
        </div>
      </div>

      {status ? <div className={styles.status}>{status}</div> : null}

      <div className={styles.grid}>
        <Card className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <div className={styles.editorTitle}>Markdown</div>
            <div className={styles.editorMeta}>
              {stats.lines} 行 · {stats.chars} 字符
            </div>
          </div>
          <div className={styles.editorTools}>
            <label className={styles.draftLabel}>
              <span className={styles.draftLabelText}>草稿</span>
              <select
                className={styles.select}
                value={draftId ?? ''}
                onChange={(e) => {
                  const nextId = e.currentTarget.value
                  if (!nextId) return
                  navigate(`/knowledge-cards/editor?draft=${encodeURIComponent(nextId)}`)
                }}
              >
                <option value="" disabled>
                  请选择…
                </option>
                {draftMetas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.draftLabel}>
              <span className={styles.draftLabelText}>标题</span>
              <input
                className={styles.input}
                value={draftName}
                onChange={(e) => setDraftName(e.currentTarget.value)}
                placeholder="草稿标题"
              />
            </label>

            <label className={styles.draftLabel}>
              <span className={styles.draftLabelText}>历史</span>
              <select
                className={styles.select}
                value=""
                onChange={(e) => {
                  const ts = e.currentTarget.value
                  if (!ts) return
                  const item = history.find((h) => String(h.savedAt) === ts)
                  if (!item) return
                  setMarkdown(item.markdown)
                  setSelectedCardId(null)
                  setStatus(`已恢复版本：${new Date(item.savedAt).toLocaleString()}`)
                  e.currentTarget.value = ''
                }}
                disabled={!history.length}
              >
                <option value="" disabled>
                  {history.length ? '选择要恢复的版本…' : '暂无'}
                </option>
                {history.slice(0, 20).map((h) => (
                  <option key={h.savedAt} value={String(h.savedAt)}>
                    {new Date(h.savedAt).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.editorToolActions}>
              <Button
                variant="ghost"
                onClick={() => downloadTextFile(`${draftName || 'contents'}.md`, markdown, 'text/markdown;charset=utf-8')}
                disabled={!markdown}
              >
                导出 Markdown
              </Button>
              <Button variant="ghost" onClick={onDeleteDraft} disabled={!draftId}>
                删除草稿
              </Button>
            </div>
          </div>
          <textarea
            className={styles.textarea}
            value={markdown}
            onChange={(e) => setMarkdown(e.currentTarget.value)}
            placeholder={`# 一级标题\n\n## 二级标题\n\n### 三级标题\n\n在这里开始写内容…`}
            spellCheck={false}
          />
        </Card>

        <Card className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div className={styles.previewTitle}>实时预览</div>
            <div className={styles.previewHint}>
              {cards.length ? `${cards.length} 张卡片` : '按 # / ## / ### 拆分内容'}
            </div>
          </div>
          <div className={styles.previewBody}>
            {cards.length ? (
              <div className={styles.previewLayout}>
                <div className={styles.previewList}>
                  {cards.slice(0, 30).map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      className={[
                        styles.previewListItem,
                        selectedCard?.id === card.id ? styles.previewListItemActive : undefined,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      <div className={styles.previewListTitle}>{card.title}</div>
                      <div className={styles.previewListMeta}>
                        {[card.h1, card.h2, card.h3].filter(Boolean).join(' / ')}
                      </div>
                    </button>
                  ))}
                  {cards.length > 30 ? <div className={styles.previewListMore}>仅展示前 30 张</div> : null}
                </div>
                <div className={styles.previewContent}>
                  <div className={styles.previewContentTitle}>{selectedCard?.title}</div>
                  <div
                    ref={previewRef}
                    className={styles.markdownBody}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            ) : (
              <pre className={styles.previewPre}>{markdown || '（空）'}</pre>
            )}
          </div>
        </Card>
      </div>
    </Container>
  )
}

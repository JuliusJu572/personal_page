import DOMPurify from 'dompurify'
import { marked } from 'marked'

type ProtectResult = { protectedContent: string; map: Record<string, string> }

function isEscaped(text: string, index: number) {
  return index > 0 && text[index - 1] === '\\'
}

function protectBlockMath(content: string, startCount: number): { result: ProtectResult; nextCount: number } {
  const map: Record<string, string> = {}
  let count = startCount

  let out = ''
  for (let i = 0; i < content.length; ) {
    const isBlockStart =
      content[i] === '$' && content[i + 1] === '$' && !isEscaped(content, i) && content[i + 2] !== '$'
    if (!isBlockStart) {
      out += content[i]
      i += 1
      continue
    }

    let j = i + 2
    while (j < content.length - 1) {
      const isBlockEnd = content[j] === '$' && content[j + 1] === '$' && !isEscaped(content, j)
      if (isBlockEnd) break
      j += 1
    }

    if (j >= content.length - 1) {
      out += content.slice(i)
      break
    }

    const match = content.slice(i, j + 2)
    const key = `MATHBLOCKPLACEHOLDER${count++}`
    map[key] = `&#36;&#36;${match.slice(2, -2)}&#36;&#36;`
    out += key
    i = j + 2
  }

  return { result: { protectedContent: out, map }, nextCount: count }
}

function protectInlineMath(content: string, startCount: number): { result: ProtectResult; nextCount: number } {
  const map: Record<string, string> = {}
  let count = startCount

  let out = ''
  for (let i = 0; i < content.length; ) {
    const isInlineStart =
      content[i] === '$' &&
      content[i + 1] !== '$' &&
      !isEscaped(content, i) &&
      content[i - 1] !== '$' &&
      content[i + 1] !== '\n' &&
      content[i + 1] !== '\r'

    if (!isInlineStart) {
      out += content[i]
      i += 1
      continue
    }

    const lineEnd = (() => {
      const nl = content.indexOf('\n', i + 1)
      const cr = content.indexOf('\r', i + 1)
      if (nl === -1) return cr === -1 ? content.length : cr
      if (cr === -1) return nl
      return Math.min(nl, cr)
    })()

    let j = i + 1
    while (j < lineEnd) {
      const isInlineEnd = content[j] === '$' && !isEscaped(content, j)
      if (isInlineEnd) break
      j += 1
    }

    if (j >= lineEnd) {
      out += content[i]
      i += 1
      continue
    }

    const match = content.slice(i, j + 1)
    const key = `MATHINLINEPLACEHOLDER${count++}`
    map[key] = `&#36;${match.slice(1, -1)}&#36;`
    out += key
    i = j + 1
  }

  return { result: { protectedContent: out, map }, nextCount: count }
}

function protectMath(content: string): ProtectResult {
  const block = protectBlockMath(content, 0)
  const inline = protectInlineMath(block.result.protectedContent, block.nextCount)

  return {
    protectedContent: inline.result.protectedContent,
    map: { ...block.result.map, ...inline.result.map },
  }
}

function restoreMath(html: string, map: Record<string, string>) {
  let out = html
  for (const key of Object.keys(map)) {
    out = out.replaceAll(key, map[key])
  }
  return out
}

export function renderMarkdownWithMath(content: string) {
  const { protectedContent, map } = protectMath(content)

  marked.setOptions({
    gfm: true,
    breaks: false,
  })

  const html = marked.parse(protectedContent)
  const restored = restoreMath(typeof html === 'string' ? html : String(html), map)

  if (typeof window === 'undefined') return restored
  return DOMPurify.sanitize(restored, { USE_PROFILES: { html: true } })
}

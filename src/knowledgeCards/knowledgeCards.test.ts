import { describe, expect, it } from 'vitest'
import { getBrowseItems } from './browseModel'
import { parseMarkdownToCards } from './parseMarkdownToCards'
import { renderMarkdownWithMath } from './renderMarkdownWithMath'

describe('parseMarkdownToCards', () => {
  it('splits markdown by heading levels and preserves grouping fields', () => {
    const md = [
      'intro',
      'line2',
      '',
      '# H1',
      '',
      'a',
      'b',
      '',
      '## H2',
      'c',
      '',
      '### H3',
      'd',
      '',
    ].join('\n')

    const cards = parseMarkdownToCards(md)
    expect(cards.length).toBe(4)

    expect(cards[0]).toMatchObject({
      h1: '未分类',
      h2: null,
      h3: null,
      title: '无标题',
    })
    expect(cards[0].content).toContain('intro')
    expect(cards[0].content).toContain('line2')

    expect(cards[1]).toMatchObject({ h1: 'H1', h2: null, h3: null, title: 'H1' })
    expect(cards[1].content).toBe('a\nb')

    expect(cards[2]).toMatchObject({ h1: 'H1', h2: 'H2', h3: null, title: 'H2' })
    expect(cards[2].content).toBe('c')

    expect(cards[3]).toMatchObject({ h1: 'H1', h2: 'H2', h3: 'H3', title: 'H3' })
    expect(cards[3].content).toBe('d')
  })
})

describe('getBrowseItems', () => {
  it('groups by h1 when no filter is provided', () => {
    const cards = parseMarkdownToCards(['intro', '# A', 'x', '# B', 'y'].join('\n'))
    const items = getBrowseItems(cards, { h1: null, h2: null, h3: null })

    const titles = items.filter((i) => i.type === 'folder').map((i) => i.title)
    expect(titles).toContain('未分类')
    expect(titles).toContain('A')
    expect(titles).toContain('B')
  })
})

describe('renderMarkdownWithMath', () => {
  it('keeps $...$ and $$...$$ intact after markdown parsing', () => {
    const content = [
      'inline: $x_1$',
      '',
      '$$x_k = F x_{k-1} + w_k$$',
      '',
      'text',
    ].join('\n')

    const html = renderMarkdownWithMath(content)
    const el = document.createElement('div')
    el.innerHTML = html
    const text = el.textContent ?? ''
    expect(text).toContain('$x_1$')
    expect(text).toContain('$$x_k = F x_{k-1} + w_k$$')
    expect(html).not.toContain('<em>1</em>')
  })
})

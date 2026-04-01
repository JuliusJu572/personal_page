import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './cheatingBuddyPage.module.css'

const RELEASES_BASE = '/releases'
const LATEST_URL = '/releases/latest.txt'

interface ReleaseInfo {
  version: string
  changelog: string[]
}

const shortcuts = [
  { icon: '📸', name: '截屏翻译', win: 'Ctrl + Enter', mac: 'Cmd + Enter' },
  { icon: '🖱️', name: '点击穿透', win: 'Ctrl + M', mac: 'Cmd + M' },
  { icon: '🪟', name: '窗口移动', win: 'Ctrl + 方向键', mac: 'Cmd + 方向键' },
  { icon: '🔇', name: '显示/隐藏', win: 'Ctrl + \\', mac: 'Cmd + \\' },
  { icon: '🔊', name: '系统录音', win: 'Ctrl + L', mac: 'Cmd + L' },
  { icon: '🎤', name: '麦克风录制', win: 'Ctrl + K', mac: 'Cmd + K' },
  { icon: '📝', name: '屏幕 OCR', win: 'Ctrl + ;', mac: 'Cmd + ;' },
  { icon: '📋', name: '复制内容', win: 'Ctrl + C', mac: 'Cmd + C' },
  { icon: '⬆️', name: '上一条响应', win: 'Ctrl + [', mac: 'Cmd + [' },
  { icon: '⬇️', name: '下一条响应', win: 'Ctrl + ]', mac: 'Cmd + ]' },
  { icon: '↕️', name: '响应滚动', win: 'Ctrl + Shift + 方向键', mac: 'Cmd + Shift + 方向键' },
  { icon: '🗑️', name: '清除历史', win: "Ctrl + '", mac: "Cmd + '" },
  { icon: '🧹', name: '清空转写', win: 'Ctrl + Shift + L', mac: 'Cmd + Shift + L' },
  { icon: '💬', name: '发送文本', win: 'Enter', mac: 'Enter' },
  { icon: '↩️', name: '文本换行', win: 'Shift + Enter', mac: 'Shift + Enter' },
]

export function CheatingBuddyPage() {
  const [selectedOs, setSelectedOs] = useState<'windows' | 'mac'>(() => {
    if (typeof navigator === 'undefined') return 'windows'
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('mac os') || ua.includes('macintosh') ? 'mac' : 'windows'
  })

  const [release, setRelease] = useState<ReleaseInfo | null>(null)

  useEffect(() => {
    fetch(LATEST_URL)
      .then((r) => r.json())
      .then((data) => {
        let changelog: string[] = []
        if (Array.isArray(data.changelog)) {
          changelog = data.changelog
        } else if (typeof data.changelog === 'string' && data.changelog.trim()) {
          changelog = data.changelog.split('\n').filter((s: string) => s.trim())
        }
        const info: ReleaseInfo = {
          version: data.version || '',
          changelog,
        }
        setRelease(info)
      })
      .catch(() => {})
  }, [])

  const winUrl = release ? `${RELEASES_BASE}/${release.version}/Lucencia.Setup.exe` : '#'
  const macUrl = release ? `${RELEASES_BASE}/${release.version}/Lucencia.dmg` : '#'

  return (
    <Container className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroImageWrapper}>
            <img
              className={styles.heroImage}
              src="/lucencia_hero.png"
              alt="Lucencia"
              width={2662}
              height={2252}
            />
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleEn}>Lucencia</span>
            <span className={styles.titleSep}> · </span>
            <span className={styles.titleCn}>露森西娅</span>
          </h1>
          <p className={styles.desc}>
            跨国会议与无障碍沟通 AI 协同助手 — 提供实时翻译、屏幕智能解析与知识库集成，让每一次全球协作都清晰高效。
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>下载</h2>
        <div className={styles.downloadGrid}>
          <Card className={styles.downloadCard}>
            <div className={styles.downloadIcon}>🪟</div>
            <div className={styles.downloadInfo}>
              <h3 className={styles.downloadOs}>Windows</h3>
              <p className={styles.downloadNote}>适用于 Windows 10 / 11</p>
              {release && <p className={styles.downloadVersion}>v{release.version}</p>}
            </div>
            <a
              href={winUrl}
              className={styles.downloadBtn}
              aria-label="下载 Windows 版本"
            >
              下载
            </a>
          </Card>

          <Card className={styles.downloadCard}>
            <div className={styles.downloadIcon}>🍎</div>
            <div className={styles.downloadInfo}>
              <h3 className={styles.downloadOs}>macOS</h3>
              <p className={styles.downloadNote}>Apple Silicon (M 系列)</p>
              {release && <p className={styles.downloadVersion}>v{release.version}</p>}
            </div>
            <a
              href={macUrl}
              className={styles.downloadBtn}
              aria-label="下载 macOS 版本"
            >
              下载
            </a>
          </Card>
        </div>
      </section>

      {release && release.changelog.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>更新日志 <span className={styles.changelogVersion}>v{release.version}</span></h2>
          <Card className={styles.changelogCard}>
            <ul className={styles.changelogList}>
              {release.changelog.map((item, i) => (
                <li key={i} className={styles.changelogItem}>
                  <span className={styles.changelogDot} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.shortcutsHeader}>
          <h2 className={styles.sectionTitle}>快捷键</h2>
          <div className={styles.osToggle} role="tablist" aria-label="选择操作系统">
            <button
              type="button"
              className={[styles.osBtn, selectedOs === 'windows' ? styles.osBtnActive : ''].filter(Boolean).join(' ')}
              aria-pressed={selectedOs === 'windows'}
              onClick={() => setSelectedOs('windows')}
            >
              Windows
            </button>
            <button
              type="button"
              className={[styles.osBtn, selectedOs === 'mac' ? styles.osBtnActive : ''].filter(Boolean).join(' ')}
              aria-pressed={selectedOs === 'mac'}
              onClick={() => setSelectedOs('mac')}
            >
              macOS
            </button>
          </div>
        </div>

        <Card className={styles.shortcutsCard}>
          <div className={styles.shortcutsGrid}>
            {shortcuts.map((s) => (
              <div key={s.name} className={styles.shortcutRow}>
                <span className={styles.shortcutIcon}>{s.icon}</span>
                <span className={styles.shortcutName}>{s.name}</span>
                <kbd className={styles.shortcutKey}>
                  {selectedOs === 'windows' ? s.win : s.mac}
                </kbd>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </Container>
  )
}

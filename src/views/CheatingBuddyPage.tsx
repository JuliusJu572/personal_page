import { useState } from 'react'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './cheatingBuddyPage.module.css'

const shortcuts = [
  { icon: '📸', name: '截屏提问', win: 'Ctrl + Enter', mac: 'Cmd + Enter' },
  { icon: '🖱️', name: '点击穿透', win: 'Ctrl + M', mac: 'Cmd + M' },
  { icon: '🪟', name: '窗口移动', win: 'Ctrl + 方向键', mac: 'Cmd + 方向键' },
  { icon: '🔇', name: '显示/隐藏', win: 'Ctrl + \\', mac: 'Cmd + \\' },
  { icon: '🔊', name: '系统录音', win: 'Ctrl + L', mac: 'Cmd + L' },
  { icon: '🎤', name: '麦克风录制', win: 'Ctrl + K', mac: 'Cmd + K' },
  { icon: '📝', name: 'OCR 识题', win: 'Ctrl + ;', mac: 'Cmd + ;' },
  { icon: '📋', name: '复制转发', win: 'Ctrl + C', mac: 'Cmd + C' },
  { icon: '⬆️', name: '上一条响应', win: 'Ctrl + [', mac: 'Cmd + [' },
  { icon: '⬇️', name: '下一条响应', win: 'Ctrl + ]', mac: 'Cmd + ]' },
  { icon: '↕️', name: '响应滚动', win: 'Ctrl + Shift + 方向键', mac: 'Cmd + Shift + 方向键' },
  { icon: '🗑️', name: '清除历史', win: "Ctrl + '", mac: "Cmd + '" },
  { icon: '🧹', name: '清空转写', win: 'Ctrl + Shift + L', mac: 'Cmd + Shift + L' },
  { icon: '🚨', name: '紧急擦除', win: 'Ctrl + Shift + E', mac: 'Cmd + Shift + E' },
  { icon: '💬', name: '发送文本', win: 'Enter', mac: 'Enter' },
  { icon: '↩️', name: '文本换行', win: 'Shift + Enter', mac: 'Shift + Enter' },
]

export function CheatingBuddyPage() {
  const [selectedOs, setSelectedOs] = useState<'windows' | 'mac'>(() => {
    if (typeof navigator === 'undefined') return 'windows'
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('mac os') || ua.includes('macintosh') ? 'mac' : 'windows'
  })

  return (
    <Container className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <img
            className={styles.heroImage}
            src="/lucencia_hero.png"
            alt="Lucencia"
            width={2662}
            height={2252}
          />
          <h1 className={styles.title}>
            <span className={styles.titleEn}>Lucencia</span>
            <span className={styles.titleSep}> · </span>
            <span className={styles.titleCn}>露森西娅</span>
          </h1>
          <p className={styles.desc}>
            实时 AI 助手 — 基于屏幕截图与音频分析，在视频通话、面试、演示与会议中提供上下文辅助与回答草稿。
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
            </div>
            <a
              href="#"
              className={styles.downloadBtn}
              onClick={(e) => e.preventDefault()}
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
            </div>
            <a
              href="#"
              className={styles.downloadBtn}
              onClick={(e) => e.preventDefault()}
              aria-label="下载 macOS 版本"
            >
              下载
            </a>
          </Card>
        </div>
      </section>

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

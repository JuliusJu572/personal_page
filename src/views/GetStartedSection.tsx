import { useState, useEffect } from 'react'
import styles from './getStartedSection.module.css'

const RELEASES_BASE = '/releases'
const LATEST_URL = '/releases/latest.txt'

interface ReleaseInfo {
  version: string
}

const stats = [
  { value: '50+', label: '支持语言' },
  { value: '99.2%', label: '翻译准确率' },
  { value: '<50ms', label: '响应延迟' },
  { value: '10K+', label: '全球用户' },
]

export function GetStartedSection() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null)

  useEffect(() => {
    fetch(LATEST_URL)
      .then((r) => r.json())
      .then((data) => setRelease({ version: data.version || '' }))
      .catch(() => {})
  }, [])

  const winUrl = release ? `${RELEASES_BASE}/${release.version}/Lucencia.Setup.exe` : '#'
  const macUrl = release ? `${RELEASES_BASE}/${release.version}/Lucencia.dmg` : '#'

  return (
    <section className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.inner}>
        <h2 className={styles.title}>开始使用 LUCENCIA</h2>
        <p className={styles.subtitle}>Try it for Free</p>

        <p className={styles.desc}>
          让全球协作变得简单高效。立即下载，开启无障碍沟通新体验。
        </p>

        <div className={styles.downloadGrid}>
          <a href={winUrl} className={styles.downloadBtn} aria-label="下载 Windows 版本">
            <span className={styles.downloadIcon}>🪟</span>
            <div className={styles.downloadInfo}>
              <span className={styles.downloadOs}>Windows</span>
              <span className={styles.downloadNote}>Windows 10 / 11</span>
            </div>
            {release && <span className={styles.downloadVersion}>v{release.version}</span>}
          </a>
          <a href={macUrl} className={styles.downloadBtn} aria-label="下载 macOS 版本">
            <span className={styles.downloadIcon}>🍎</span>
            <div className={styles.downloadInfo}>
              <span className={styles.downloadOs}>macOS</span>
              <span className={styles.downloadNote}>Apple Silicon (M 系列)</span>
            </div>
            {release && <span className={styles.downloadVersion}>v{release.version}</span>}
          </a>
        </div>

        <a href="/guide" className={styles.secondaryBtn}>查看使用说明</a>

        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

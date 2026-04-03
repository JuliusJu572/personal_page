import { useState, useEffect } from 'react'
import { WorldMapParticles } from './WorldMapParticles'
import { LucenciaLogoText } from './LucenciaLogoText'
import styles from './heroSection.module.css'

const RELEASES_BASE = '/releases'
const LATEST_URL = '/releases/latest.txt'

interface ReleaseInfo {
  version: string
}

export function HeroSection() {
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
    <section className={styles.hero} id="hero-download">
      <div className={styles.bgLayer}>
        <WorldMapParticles />
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logoArea}>
            <LucenciaLogoText />
          </div>
          <p className={styles.subtitleEn}>AI-Powered Global Communication Assistant</p>
          <p className={styles.subtitleCn}>让每一次全球协作都清晰高效</p>
          <div className={styles.tags}>
            <span className={styles.tag}>实时翻译</span>
            <span className={styles.tag}>屏幕智能解析</span>
            <span className={styles.tag}>企业知识库</span>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>Download</h3>
            <div className={styles.downloadBtns}>
              <a href={winUrl} className={[styles.downloadBtn, styles.downloadBtnPrimary].join(' ')}>
                <span className={styles.btnIcon}>🪟</span>
                <div className={styles.btnText}>
                  <div>Windows</div>
                  <div className={styles.btnSubtext}>Windows 10 / 11{release ? ` · v${release.version}` : ''}</div>
                </div>
              </a>
              <a href={macUrl} className={styles.downloadBtn}>
                <span className={styles.btnIcon}>🍎</span>
                <div className={styles.btnText}>
                  <div>macOS</div>
                  <div className={styles.btnSubtext}>Apple Silicon (M){release ? ` · v${release.version}` : ''}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { WorldMapParticles } from './WorldMapParticles'
import { LucenciaLogoText } from './LucenciaLogoText'
import { fetchLatestRelease, pickReleaseAsset } from '../lib/github'
import { projects } from '../config/projects'
import styles from './heroSection.module.css'

export function HeroSection() {
  const [winUrl, setWinUrl] = useState<string>('#')
  const [macUrl, setMacUrl] = useState<string>('#')
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    const cfg = projects.cheatingBuddy
    fetchLatestRelease({ owner: cfg.owner, repo: cfg.repo })
      .then((release) => {
        setVersion(release.tag_name)
        const winAsset = pickReleaseAsset(release, 'windows')
        const macAsset = pickReleaseAsset(release, 'mac')
        if (winAsset) setWinUrl(winAsset.browser_download_url)
        if (macAsset) setMacUrl(macAsset.browser_download_url)
      })
      .catch(() => {})
  }, [])

  return (
    <section className={styles.hero} id="hero-download">
      <div className={styles.bgLayer}>
        <WorldMapParticles />
      </div>

      <div className={styles.content}>
        <div className={styles.logoArea}>
          <LucenciaLogoText />
        </div>

        <div className={styles.bodyRow}>
          <div className={styles.left}>
            <p className={styles.subtitleEn}>
              <span className={styles.subtitleLine1}>AI-Powered</span>
              <span className={styles.subtitleLine2}>Global Communication Assistant</span>
            </p>
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
                  <svg className={styles.btnIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
                  <div className={styles.btnText}>
                    <div>Windows</div>
                    <div className={styles.btnSubtext}>Windows 10 / 11{version ? ` · ${version}` : ''}</div>
                  </div>
                </a>
                <a href={macUrl} className={styles.downloadBtn}>
                  <svg className={styles.btnIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.145 2 11.24c0 2.885 1.41 5.45 3.62 7.16A9.03 9.03 0 0 1 12 19c2.27 0 4.36-.68 6.08-1.84C20.39 16.57 22 13.99 22 11.24 22 6.145 17.523 2 12 2z"/><path d="M12 18.5V22m-3-2h6"/></svg>
                  <div className={styles.btnText}>
                    <div>macOS</div>
                    <div className={styles.btnSubtext}>Apple Silicon (M){version ? ` · ${version}` : ''}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import styles from './getStartedSection.module.css'

const stats = [
  { value: '50+', label: '支持语言' },
  { value: '99.2%', label: '识别准确率' },
  { value: '<50ms', label: '响应延迟' },
  { value: '10K+', label: '活跃用户' },
]

export function GetStartedSection() {
  const scrollToDownload = () => {
    const el = document.getElementById('hero-download')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.inner}>
        <h2 className={styles.title}>开始使用 LUCENCIA</h2>
        <p className={styles.subtitle}>Try it for Free</p>

        <p className={styles.desc}>
          让高效协作变得简单。立即下载，开启智能辅助新体验。
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={scrollToDownload}>
            立即免费下载
          </button>
          <a href="/guide" className={styles.secondaryBtn}>查看使用说明</a>
        </div>

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

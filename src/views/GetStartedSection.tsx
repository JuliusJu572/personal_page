import { Link } from 'react-router-dom'
import styles from './getStartedSection.module.css'

const STATS = [
  { num: '50+', label: '语种支持' },
  { num: '99.2%', label: '翻译准确率' },
  { num: '<50ms', label: '响应延迟' },
  { num: '10K+', label: '企业用户' },
]

export function GetStartedSection() {
  return (
    <section className={styles.section}>
      <div className={styles.bgGlow} />
      <div className={styles.content}>
        <h2 className={styles.title}>Get Started with LUCENCIA</h2>
        <p className={styles.subtitle}>Try it for Free</p>
        <p className={styles.desc}>
          让全球协作变得简单高效。立即下载，开启无障碍沟通新体验。
        </p>
        <div className={styles.btnGroup}>
          <a href="#hero-download" className={styles.primaryBtn}>立即免费下载</a>
          <Link to="/guide" className={styles.secondaryBtn}>查看使用说明</Link>
        </div>
        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './homePage.module.css'

export function HomePage() {
  return (
    <Container>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <Badge tone="accent">React · 响应式 · 统一设计</Badge>
          <h1 className={styles.title}>个人主页 / Projects Hub</h1>
          <p className={styles.subtitle}>
            集成两个核心模块：Cheating Buddy（作弊老铁）与 Mystic AI Tarot（塔罗牌预测）。
          </p>
          <div className={styles.heroActions}>
            <Link to="/cheating-buddy">
              <Button>进入 Cheating Buddy</Button>
            </Link>
            <Link to="/tarot">
              <Button variant="secondary">进入 Mystic AI Tarot</Button>
            </Link>
          </div>
        </div>

        <Card className={styles.heroRight}>
          <div className={styles.panelHeader}>
            <div className={styles.panelDot} />
            <div className={styles.panelDot} />
            <div className={styles.panelDot} />
            <div className={styles.panelTitle}>/</div>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.panelRow}>
              <span className={styles.k}>GitHub</span>
              <a href="https://github.com/JuliusJu572" target="_blank" rel="noreferrer" className={styles.v}>
                github.com/JuliusJu572
              </a>
            </div>
            <div className={styles.panelRow}>
              <span className={styles.k}>Modules</span>
              <span className={styles.v}>Cheating Buddy · Mystic AI Tarot</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.grid}>
        <Card className={styles.gridCard}>
          <div className={styles.gridCardTop}>
            <Badge tone="success">应用</Badge>
            <h2 className={styles.gridTitle}>Cheating Buddy（作弊老铁）</h2>
            <p className={styles.gridDesc}>
              将 README 核心信息结构化展示，并自动抓取最新 Release，提供 Windows / macOS 直链下载。
            </p>
          </div>
          <Link to="/cheating-buddy" className={styles.gridLink}>
            进入介绍页 →
          </Link>
        </Card>

        <Card className={styles.gridCard}>
          <div className={styles.gridCardTop}>
            <Badge tone="accent">子应用</Badge>
            <h2 className={styles.gridTitle}>Mystic AI Tarot</h2>
            <p className={styles.gridDesc}>
              作为子应用挂载在主站路径下，保留其原有神秘视觉风格与动效。
            </p>
          </div>
          <Link to="/tarot" className={styles.gridLink}>
            打开 Tarot →
          </Link>
        </Card>
      </section>
    </Container>
  )
}

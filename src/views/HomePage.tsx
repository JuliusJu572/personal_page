import { Link } from 'react-router-dom'
import { projects } from '../config/projects'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './homePage.module.css'

export function HomePage() {
  const cheatingRepoUrl = `https://github.com/${projects.cheatingBuddy.owner}/${projects.cheatingBuddy.repo}`

  return (
    <div className={styles.page}>
      {/* Hero Section - Bento Grid */}
      <section className={styles.hero}>
        {/* Title Section - spans 8 columns, 2 rows */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>JuliusJu</h1>
          <p className={styles.subtitle}>
            极简项目入口。当前主推：Cheating Buddy（作弊老铁）—— 下载中心、安装指引、使用前测试，一站式整理。
          </p>
          <div className={styles.actions}>
            <Link to="/cheating-buddy">
              <Button>打开 Cheating Buddy</Button>
            </Link>
            <a href={cheatingRepoUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">GitHub</Button>
            </a>
          </div>
        </div>

        {/* Hero Card - spans 4 columns, 2 rows */}
        <Card className={styles.heroCard} variant="thick">
          <div className={styles.heroCardTop}>
            <div className={styles.featureIcon} aria-hidden="true" />
            <div className={styles.featureText}>
              <div className={styles.featureName}>Cheating Buddy</div>
              <div className={styles.featureDesc}>macOS / Windows · 最新 Release 自动拉取</div>
            </div>
          </div>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaK}>Repo</div>
              <div className={styles.metaV}>
                <a href={cheatingRepoUrl} target="_blank" rel="noreferrer">
                  {projects.cheatingBuddy.owner}/{projects.cheatingBuddy.repo}
                </a>
              </div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaK}>包含</div>
              <div className={styles.metaV}>下载 · 安装 · 快捷键 · 风险测试</div>
            </div>
          </div>
          <div className={styles.heroCardActions}>
            <Link to="/cheating-buddy">
              <Button variant="secondary">进入介绍页</Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Features Section - Bento Grid */}
      <section className={styles.section}>
        <h2 className={styles.h2}>你可以在这里做什么</h2>
        <div className={styles.bentoGrid}>
          <Card className={[styles.infoCard, styles.bentoMedium].join(' ')} variant="default">
            <div className={styles.infoTop}>
              <div className={styles.infoIcon} aria-hidden="true" />
              <div className={styles.infoTitle}>直达下载</div>
            </div>
            <p className={styles.infoDesc}>自动获取最新 Release，并给出 Windows / macOS 安装包直链。</p>
            <Link to="/cheating-buddy" className={styles.cardLink}>
              去下载 →
            </Link>
          </Card>

          <Card className={[styles.infoCard, styles.bentoMedium].join(' ')} variant="default">
            <div className={styles.infoTop}>
              <div className={styles.infoIcon2} aria-hidden="true" />
              <div className={styles.infoTitle}>快速上手</div>
            </div>
            <p className={styles.infoDesc}>按系统拆分的安装步骤与 ffmpeg 配置要点，少踩坑。</p>
            <Link to="/cheating-buddy" className={styles.cardLink}>
              看指引 →
            </Link>
          </Card>

          <Card className={[styles.infoCard, styles.bentoMedium].join(' ')} variant="default">
            <div className={styles.infoTop}>
              <div className={styles.infoIcon3} aria-hidden="true" />
              <div className={styles.infoTitle}>使用前测试</div>
            </div>
            <p className={styles.infoDesc}>切屏/可见性与屏幕共享预览，提前暴露环境差异。</p>
            <Link to="/cheating-buddy" className={styles.cardLink}>
              去测试 →
            </Link>
          </Card>

          <Card className={[styles.infoCard, styles.bentoMedium].join(' ')} variant="default">
            <div className={styles.infoTop}>
              <div className={styles.infoIcon} aria-hidden="true" />
              <div className={styles.infoTitle}>知识卡片编辑</div>
            </div>
            <p className={styles.infoDesc}>上传或编辑 Markdown，一键拆分成可浏览的知识卡片。</p>
            <Link to="/knowledge-cards/editor" className={styles.cardLink}>
              去编辑 →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}

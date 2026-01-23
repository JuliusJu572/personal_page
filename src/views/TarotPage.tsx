import { useMemo, useState } from 'react'
import { projects } from '../config/projects'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import styles from './tarotPage.module.css'

export function TarotPage() {
  const [mode, setMode] = useState<'embed' | 'newtab'>('embed')

  const iframeSrc = useMemo(() => {
    if (import.meta.env.DEV) return 'http://localhost:3000/'
    const base = import.meta.env.BASE_URL || '/'
    const normalized = base.endsWith('/') ? base : `${base}/`
    return `${normalized}tarot/`
  }, [])

  return (
    <Container>
      <header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.badges}>
            <Badge tone="accent">子应用挂载</Badge>
            <Badge tone="neutral">保留原有视觉风格</Badge>
          </div>
          <h1 className={styles.title}>Mystic AI Tarot（塔罗牌预测）</h1>
          <p className={styles.subtitle}>
            该模块以独立应用形式构建，并挂载在主站路径下。为了保留其“神秘风格”，这里使用嵌入式方式呈现。
          </p>
          <div className={styles.actions}>
            <Button variant={mode === 'embed' ? 'primary' : 'secondary'} onClick={() => setMode('embed')}>
              嵌入式打开
            </Button>
            <a href={iframeSrc} target="_blank" rel="noreferrer">
              <Button variant={mode === 'newtab' ? 'primary' : 'secondary'} onClick={() => setMode('newtab')}>
                新标签打开
              </Button>
            </a>
            <a href={projects.tarot.repoUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost">项目仓库</Button>
            </a>
          </div>
        </div>
        <Card className={styles.right}>
          <div className={styles.tipTitle}>提示</div>
          <ul className={styles.tipList}>
            <li>开发模式下默认嵌入 http://localhost:3000（Tarot 开发服务）。</li>
            <li>构建产物中 Tarot 会挂载到 /tarot/，并随主站一起部署。</li>
          </ul>
        </Card>
      </header>

      {mode === 'embed' ? (
        <Card className={styles.frameCard}>
          <iframe title="Mystic AI Tarot" src={iframeSrc} className={styles.iframe} />
        </Card>
      ) : (
        <Card className={styles.frameCard}>
          <div className={styles.newtab}>
            <div className={styles.newtabTitle}>已选择“新标签打开”</div>
            <div className={styles.newtabDesc}>
              若浏览器拦截弹窗，请点击上方按钮或直接访问：
              <a href={iframeSrc} target="_blank" rel="noreferrer" className={styles.newtabLink}>
                {iframeSrc}
              </a>
            </div>
          </div>
        </Card>
      )}
    </Container>
  )
}

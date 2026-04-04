import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { useAuth } from '../lib/authContext'
import { api, type DashboardResponse } from '../lib/api'
import styles from './dashboardPage.module.css'

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

function getTimeUntil(target: string): string {
  const now = new Date()
  const targetDate = new Date(target)
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return '即将刷新'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}天 ${hours}小时`
  return `${hours}小时`
}

function getBarColor(ratio: number): string {
  if (ratio > 0.5) return 'var(--color-accent-success)'
  if (ratio > 0.2) return 'var(--color-accent-warning)'
  return 'var(--color-accent-error)'
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <Card className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </Card>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/dashboard')
      return
    }
    api.getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, navigate])

  if (authLoading || loading || !data) {
    return (
      <div className={styles.pageShell}>
        <HomeNavbar />
        <Container className={styles.page}>
          <div className={styles.loading}>加载中...</div>
        </Container>
        <HomeFooter />
      </div>
    )
  }

  const weeklyRatio = data.weeklyQuota > 0 ? data.currentPoints / data.weeklyQuota : 0
  const monthlyRatio = data.monthlyLimit > 0 ? data.monthlyUsedPoints / data.monthlyLimit : 0
  const weeklyPercent = Math.max(0, Math.min(100, weeklyRatio * 100))
  const monthlyPercent = Math.max(0, Math.min(100, monthlyRatio * 100))
  const payModeLabelMap: Record<number, string> = { 0: '已注册未付费', 1: '普通版', 2: '进阶版', 3: '高级版' }
  const displayPayModeLabel = payModeLabelMap[data.payMode] || data.payModeLabel

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>工作台</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.username}</span>
            <Badge tone="accent">{displayPayModeLabel}</Badge>
            {user?.expiresAt && (
              <span className={styles.expiresAt}>
                到期: {new Date(user.expiresAt).toLocaleDateString('zh-CN')}
              </span>
            )}
          </div>
        </header>

        <section className={styles.energySection}>
          <Card className={styles.energyCard}>
            <h2 className={styles.sectionTitle}>算力能量槽</h2>

            <div className={styles.barGroup}>
              <div className={styles.barHeader}>
                <span className={styles.barLabel}>周额度</span>
                <span className={styles.barPercent}>{weeklyPercent.toFixed(1)}%</span>
              </div>
              <div className={styles.barTrack} style={{ '--bar-color': getBarColor(weeklyRatio) } as React.CSSProperties}>
                <div className={styles.barFill} style={{ width: `${weeklyPercent}%` }} />
              </div>
              <div className={styles.barTooltip}>
                <span>剩余: {formatNumber(Math.round(data.currentPoints))} / {formatNumber(data.weeklyQuota)}</span>
                <span className={styles.resetHint}>距下周刷新还有 {getTimeUntil(data.nextWeeklyReset)}</span>
              </div>
            </div>

            <div className={styles.barGroup}>
              <div className={styles.barHeader}>
                <span className={styles.barLabel}>月度总额度</span>
                <span className={styles.barPercent}>{monthlyPercent.toFixed(1)}%</span>
              </div>
              <div className={styles.barTrack} style={{ '--bar-color': getBarColor(1 - monthlyRatio) } as React.CSSProperties}>
                <div className={`${styles.barFill} ${styles.barFillMonthly}`} style={{ width: `${monthlyPercent}%` }} />
              </div>
              <div className={styles.barTooltip}>
                <span>本月已用: {formatNumber(data.monthlyUsedPoints)} / {formatNumber(data.monthlyLimit)}</span>
                <span className={styles.resetHint}>距月度刷新还有 {getTimeUntil(data.nextMonthlyReset)}</span>
              </div>
            </div>
          </Card>
        </section>

        <section className={styles.statsGrid}>
          <StatCard label="本周对话次数" value={data.weekCallCount} />
          <StatCard
            label="本周消耗积分"
            value={formatNumber(data.weeklyQuota - Math.round(data.currentPoints))}
            sub={`周额 ${formatNumber(data.weeklyQuota)}`}
          />
          <StatCard
            label="本月消耗积分"
            value={formatNumber(data.monthlyUsedPoints)}
            sub={`月额 ${formatNumber(data.monthlyLimit)}`}
          />
          <StatCard
            label="常用模型 TOP3"
            value={
              data.topModels.length > 0
                ? data.topModels.map(m => m.model.split('/').pop()).join(' / ')
                : '暂无数据'
            }
            sub={data.topModels.length > 0 ? `${data.topModels[0].count} 次调用` : undefined}
          />
        </section>

        <section className={styles.actionsSection}>
          <Button variant="primary" className={styles.actionPrimaryBtn} onClick={() => navigate('/pricing')}>
            升级套餐
          </Button>
          <Button variant="secondary" className={styles.actionSecondaryBtn} onClick={() => window.open('https://juliusju.xyz/lucencia', '_blank')}>
            下载桌面客户端
          </Button>
        </section>
      </Container>
      <HomeFooter />
    </div>
  )
}

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

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate('/login?redirect=/dashboard')
      return
    }
    api.getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, authLoading, navigate])

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

  const weeklyRemainingPoints = Math.max(0, data.weeklyQuota - data.weeklyUsedPoints)
  const weeklyRatio = data.weeklyQuota > 0 ? weeklyRemainingPoints / data.weeklyQuota : 0
  const monthlyRemainingPoints = Math.max(0, data.monthlyLimit - data.monthlyUsedPoints)
  const monthlyRatio = data.monthlyLimit > 0 ? monthlyRemainingPoints / data.monthlyLimit : 0
  const weeklyPercent = Math.max(0, Math.min(100, weeklyRatio * 100))
  const monthlyPercent = Math.max(0, Math.min(100, monthlyRatio * 100))
  const payModeLabelMap: Record<number, string> = { 0: '已注册未付费', 1: '普通版', 2: '进阶版', 3: '高级版' }
  const displayPayModeLabel = payModeLabelMap[data.payMode] || data.payModeLabel

  const isOneTime = data.billingType === 'one_time'

  // One-time session helpers
  const onetimeTotal = data.currentPoints + data.weeklyUsedPoints // approximate total quota
  const onetimeUsed = data.weeklyUsedPoints
  const onetimeRemaining = Math.max(0, data.currentPoints)
  const onetimeRatio = onetimeTotal > 0 ? onetimeRemaining / onetimeTotal : 0
  const onetimePercent = Math.max(0, Math.min(100, onetimeRatio * 100))

  function getSessionTimeLeft(): string {
    if (!data?.expiresAt) return '未激活'
    const now = new Date()
    const expires = new Date(data.expiresAt)
    const diff = expires.getTime() - now.getTime()
    if (diff <= 0) return '已过期'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `${hours}小时 ${mins}分钟`
    return `${mins}分钟`
  }

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>工作台</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.username}</span>
            <Badge tone="accent">{displayPayModeLabel}{isOneTime ? ' · 单次' : ''}</Badge>
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

            {isOneTime ? (
              <>
                {/* ── One-time session display ── */}
                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>算力余额</span>
                    <span className={styles.barPercent}>{onetimePercent.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack} style={{ '--bar-color': getBarColor(onetimeRatio) } as React.CSSProperties}>
                    <div className={styles.barFill} style={{ width: `${onetimePercent}%` }} />
                  </div>
                  <div className={styles.barTooltip}>
                    <span>剩余: {formatNumber(onetimeRemaining)} / {formatNumber(onetimeTotal)}</span>
                    <span className={styles.resetHint}>已消耗: {formatNumber(onetimeUsed)}</span>
                  </div>
                </div>

                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>剩余时间</span>
                  </div>
                  <div className={styles.barTooltip}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
                      {getSessionTimeLeft()}
                    </span>
                    {data.expiresAt && (
                      <span className={styles.resetHint}>
                        到期: {new Date(data.expiresAt).toLocaleString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── Subscription display ── */}
                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>周额度</span>
                    <span className={styles.barPercent}>{weeklyPercent.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack} style={{ '--bar-color': getBarColor(weeklyRatio) } as React.CSSProperties}>
                    <div className={styles.barFill} style={{ width: `${weeklyPercent}%` }} />
                  </div>
                  <div className={styles.barTooltip}>
                    <span>剩余: {formatNumber(weeklyRemainingPoints)} / {formatNumber(data.weeklyQuota)}</span>
                    <span className={styles.resetHint}>距下周刷新还有 {getTimeUntil(data.nextWeeklyReset)}</span>
                  </div>
                </div>

                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>月度总额度</span>
                    <span className={styles.barPercent}>{monthlyPercent.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack} style={{ '--bar-color': getBarColor(monthlyRatio) } as React.CSSProperties}>
                    <div className={`${styles.barFill} ${styles.barFillMonthly}`} style={{ width: `${monthlyPercent}%` }} />
                  </div>
                  <div className={styles.barTooltip}>
                    <span>剩余: {formatNumber(monthlyRemainingPoints)} / {formatNumber(data.monthlyLimit)}</span>
                    <span className={styles.resetHint}>距月度刷新还有 {getTimeUntil(data.nextMonthlyReset)}</span>
                  </div>
                </div>
              </>
            )}
          </Card>
        </section>

        <section className={styles.actionsSection}>
          <Button variant="primary" className={styles.actionPrimaryBtn} onClick={() => navigate('/pricing')}>
            升级套餐
          </Button>
          <Button variant="secondary" className={styles.actionSecondaryBtn} onClick={() => navigate('/lucencia')}>
            下载桌面客户端
          </Button>
        </section>

        {user?.inviteCode && (
          <section className={styles.inviteSection}>
            <Card className={styles.inviteCard}>
              <h2 className={styles.sectionTitle}>邀请好友</h2>
              <p className={styles.inviteDesc}>分享您的邀请码，双方均可获得 7 天进阶版试用</p>
              <div className={styles.inviteCodeGroup}>
                <div>
                  <div className={styles.inviteCodeLabel}>我的邀请码</div>
                  <div className={styles.inviteCodeText}>{user.inviteCode}</div>
                </div>
                <button
                  className={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(user.inviteCode)
                      .then(() => {
                        const btn = document.querySelector(`.${styles.copyBtn}`) as HTMLButtonElement
                        if (btn) { btn.textContent = '已复制!'; setTimeout(() => { btn.textContent = '复制' }, 2000) }
                      })
                      .catch(() => {})
                  }}
                >
                  复制
                </button>
              </div>
            </Card>
          </section>
        )}
      </Container>
      <HomeFooter />
    </div>
  )
}

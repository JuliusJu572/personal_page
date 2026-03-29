import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { api, ApiError } from '../lib/api'
import styles from './loginPage.module.css'

function formatNumber(n: number) {
  return n.toLocaleString('zh-CN')
}

function formatExpiresAt(iso: string | null): string {
  if (!iso) return '未设置'
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function getDaysRemaining(iso: string | null): number {
  if (!iso) return 0
  const now = new Date()
  const exp = new Date(iso)
  const diff = exp.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function UnpaidView({ user, onLogout }: { user: { username: string; role: string }; onLogout: () => void }) {
  return (
    <div className={styles.loggedInSection}>
      <Card variant="thick" className={styles.infoCard}>
        <div className={styles.welcomeRow}>
          <div>
            <h2 className={styles.welcomeTitle}>
              欢迎回来，{user.username}
            </h2>
            <p className={styles.welcomeRole}>
              未付费用户 · {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
          <Button variant="ghost" onClick={onLogout} className={styles.logoutBtn}>
            退出登录
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>当前状态</div>
            <div className={styles.statValueDanger}>未开通</div>
            <div className={styles.statUnit}>尚未开通付费套餐</div>
          </div>
        </div>

        <div className={styles.frozenNotice}>
          您尚未开通付费套餐，无法使用 AI 功能。请联系管理员开通。
        </div>
      </Card>

      <Card variant="default" className={styles.pricingCard}>
        <h3 className={styles.pricingTitle}>开通套餐</h3>
        <p className={styles.pricingDesc}>
          选择适合你的套餐，开通后即可使用 AI 面试辅助功能。
        </p>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>普通用户</div>
            <div className={styles.pricingTokens}>Qwen 系列模型</div>
            <div className={styles.pricingPrice}>¥99/月</div>
          </div>
          <div className={`${styles.pricingItem} ${styles.pricingItemFeatured}`}>
            <div className={styles.pricingBadge}>推荐</div>
            <div className={styles.pricingName}>高级会员</div>
            <div className={styles.pricingTokens}>GLM5、MiniMax2.7 等旗舰模型</div>
            <div className={styles.pricingPrice}>¥299/月</div>
          </div>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>按量付费</div>
            <div className={styles.pricingTokens}>自行定义额度，1元=1万Token</div>
            <div className={styles.pricingPrice}>¥1/万Token</div>
          </div>
        </div>

        <div className={styles.modelNotice}>
          <div className={styles.modelNoticeTitle}>模型权限说明</div>
          <div className={styles.modelNoticeItem}>
            <span className={styles.modelNoticeTag}>普通用户 / 按量付费</span>
            <span>仅可使用 Qwen 系列模型</span>
          </div>
          <div className={styles.modelNoticeItem}>
            <span className={`${styles.modelNoticeTag} ${styles.modelNoticeTagFeatured}`}>高级会员</span>
            <span>可使用 GLM5、MiniMax2.7 等国内旗舰模型</span>
          </div>
        </div>

        <div className={styles.noteBox}>
          <p>注：由于 OpenAI、Anthropic 公司的模型需要梯子，如果梯子过脏，容易封号，因此暂不开放。</p>
        </div>

        <div className={styles.warningBox}>
          <p>软件自行监测 MAC 地址，请勿借用账号，本软件保留权利对违规账号进行处理。</p>
        </div>

        <div className={styles.contactInfo}>
          <p>🟢 微信：jrb_572_</p>
          <p>开通后请联系管理员手动设置套餐</p>
        </div>
      </Card>
    </div>
  )
}

function SubscriptionView({ user, onLogout }: { user: { username: string; role: string; payMode: number; payModeLabel: string; expiresAt: string | null; frozen: boolean }; onLogout: () => void }) {
  const daysRemaining = getDaysRemaining(user.expiresAt)
  const isExpired = user.expiresAt && daysRemaining === 0
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7

  return (
    <div className={styles.loggedInSection}>
      <Card variant="thick" className={styles.infoCard}>
        <div className={styles.welcomeRow}>
          <div>
            <h2 className={styles.welcomeTitle}>
              欢迎回来，{user.username}
            </h2>
            <p className={styles.welcomeRole}>
              {user.payModeLabel} · {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
          <Button variant="ghost" onClick={onLogout} className={styles.logoutBtn}>
            退出登录
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>订阅模式</div>
            <div className={styles.statValue}>{user.payModeLabel}</div>
            <div className={styles.statUnit}>当前套餐</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>到期时间</div>
            <div className={`${styles.statValue} ${isExpired ? styles.statValueDanger : isExpiringSoon ? styles.statValueWarning : styles.statValueSuccess}`}>
              {formatExpiresAt(user.expiresAt)}
            </div>
            <div className={styles.statUnit}>
              {user.expiresAt ? (isExpired ? '已过期' : `剩余 ${daysRemaining} 天`) : '未设置'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>状态</div>
            <div className={`${styles.statValue} ${user.frozen ? styles.statValueDanger : styles.statValueSuccess}`}>
              {user.frozen ? '已冻结' : (isExpired ? '已过期' : '正常')}
            </div>
            <div className={styles.statUnit}>
              {user.frozen ? '请联系管理员' : isExpired ? '请续费' : '使用中'}
            </div>
          </div>
        </div>

        {(isExpired || isExpiringSoon) && (
          <div className={styles.frozenNotice}>
            {isExpired
              ? '订阅已过期，请续费后联系管理员更新到期时间。'
              : `订阅将在 ${daysRemaining} 天后到期，请及时续费。`}
          </div>
        )}
        {user.frozen && (
          <div className={styles.frozenNotice}>
            账号已冻结，请联系管理员解冻。
          </div>
        )}
      </Card>

      <Card variant="default" className={styles.pricingCard}>
        <h3 className={styles.pricingTitle}>续费 / 升级套餐</h3>
        <p className={styles.pricingDesc}>
          选择适合你的套餐，续费或升级以获得更多功能。
        </p>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>普通用户</div>
            <div className={styles.pricingTokens}>Qwen 系列模型</div>
            <div className={styles.pricingPrice}>¥99/月</div>
          </div>
          <div className={`${styles.pricingItem} ${styles.pricingItemFeatured}`}>
            <div className={styles.pricingBadge}>推荐</div>
            <div className={styles.pricingName}>高级会员</div>
            <div className={styles.pricingTokens}>GLM5、MiniMax2.7 等旗舰模型</div>
            <div className={styles.pricingPrice}>¥299/月</div>
          </div>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>按量付费</div>
            <div className={styles.pricingTokens}>自行定义额度，1元=1万Token</div>
            <div className={styles.pricingPrice}>¥1/万Token</div>
          </div>
        </div>

        <div className={styles.modelNotice}>
          <div className={styles.modelNoticeTitle}>模型权限说明</div>
          <div className={styles.modelNoticeItem}>
            <span className={styles.modelNoticeTag}>普通用户 / 按量付费</span>
            <span>仅可使用 Qwen 系列模型</span>
          </div>
          <div className={styles.modelNoticeItem}>
            <span className={`${styles.modelNoticeTag} ${styles.modelNoticeTagFeatured}`}>高级会员</span>
            <span>可使用 GLM5、MiniMax2.7 等国内旗舰模型</span>
          </div>
        </div>

        <div className={styles.noteBox}>
          <p>注：由于 OpenAI、Anthropic 公司的模型需要梯子，如果梯子过脏，容易封号，因此暂不开放。</p>
        </div>

        <div className={styles.warningBox}>
          <p>软件自行监测 MAC 地址，请勿借用账号，本软件保留权利对违规账号进行处理。</p>
        </div>

        <div className={styles.contactInfo}>
          <p>🟢 微信：jrb_572_</p>
          <p>续费后请联系管理员手动更新到期时间</p>
        </div>
      </Card>
    </div>
  )
}

function PayGoView({ user, onLogout }: { user: { username: string; role: string; payMode: number; payModeLabel: string; quotaTokens: number; usedTokens: number; frozen: boolean }; onLogout: () => void }) {
  const remaining = Math.max(user.quotaTokens - user.usedTokens, 0)
  const usagePercent = user.quotaTokens > 0
    ? Math.min((user.usedTokens / user.quotaTokens) * 100, 100)
    : 0

  return (
    <div className={styles.loggedInSection}>
      <Card variant="thick" className={styles.infoCard}>
        <div className={styles.welcomeRow}>
          <div>
            <h2 className={styles.welcomeTitle}>
              欢迎回来，{user.username}
            </h2>
            <p className={styles.welcomeRole}>
              {user.payModeLabel} · {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
          <Button variant="ghost" onClick={onLogout} className={styles.logoutBtn}>
            退出登录
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>总余额</div>
            <div className={styles.statValue}>{formatNumber(user.quotaTokens)}</div>
            <div className={styles.statUnit}>Tokens</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>已使用</div>
            <div className={`${styles.statValue} ${styles.statValueAccent}`}>{formatNumber(user.usedTokens)}</div>
            <div className={styles.statUnit}>Tokens</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>剩余余额</div>
            <div className={`${styles.statValue} ${styles.statValueSuccess}`}>{formatNumber(remaining)}</div>
            <div className={styles.statUnit}>Tokens</div>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>余额使用进度</span>
            <span className={styles.progressPercent}>{usagePercent.toFixed(1)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={[
                styles.progressFill,
                usagePercent > 90 ? styles.progressDanger : usagePercent > 70 ? styles.progressWarning : '',
              ].filter(Boolean).join(' ')}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {user.frozen && (
            <div className={styles.frozenNotice}>
              账号已冻结，余额已用完，请充值后联系管理员解冻。
            </div>
          )}
        </div>
      </Card>

      <Card variant="default" className={styles.pricingCard}>
        <h3 className={styles.pricingTitle}>充值余额</h3>
        <p className={styles.pricingDesc}>
          余额不足？选择充值包获取更多 Token 额度。1元 = 1万Token。
        </p>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>基础包</div>
            <div className={styles.pricingTokens}>100,000 Tokens</div>
            <div className={styles.pricingPrice}>¥10</div>
          </div>
          <div className={`${styles.pricingItem} ${styles.pricingItemFeatured}`}>
            <div className={styles.pricingBadge}>推荐</div>
            <div className={styles.pricingName}>标准包</div>
            <div className={styles.pricingTokens}>500,000 Tokens</div>
            <div className={styles.pricingPrice}>¥50</div>
          </div>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>专业包</div>
            <div className={styles.pricingTokens}>2,000,000 Tokens</div>
            <div className={styles.pricingPrice}>¥200</div>
          </div>
        </div>

        <div className={styles.modelNotice}>
          <div className={styles.modelNoticeTitle}>模型权限说明</div>
          <div className={styles.modelNoticeItem}>
            <span className={styles.modelNoticeTag}>按量付费</span>
            <span>仅可使用 Qwen 系列模型</span>
          </div>
          <div className={styles.modelNoticeItem}>
            <span className={`${styles.modelNoticeTag} ${styles.modelNoticeTagFeatured}`}>升级高级会员</span>
            <span>可使用 GLM5、MiniMax2.7 等国内旗舰模型</span>
          </div>
        </div>

        <div className={styles.noteBox}>
          <p>注：由于 OpenAI、Anthropic 公司的模型需要梯子，如果梯子过脏，容易封号，因此暂不开放。</p>
        </div>

        <div className={styles.warningBox}>
          <p>软件自行监测 MAC 地址，请勿借用账号，本软件保留权利对违规账号进行处理。</p>
        </div>

        <div className={styles.contactInfo}>
          <p>🟢 微信：jrb_572_</p>
          <p>充值后请联系管理员手动增加余额</p>
        </div>
      </Card>
    </div>
  )
}

function LoggedInView({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<null | {
    username: string
    role: string
    quotaTokens: number
    usedTokens: number
    frozen: boolean
    payMode: number
    payModeLabel: string
    expiresAt: string | null
  }>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMe()
      .then((data) => {
        setUser({
          username: data.user.username,
          role: data.user.role,
          quotaTokens: data.user.quotaTokens,
          usedTokens: data.user.usedTokens,
          frozen: data.user.frozen,
          payMode: data.user.payMode,
          payModeLabel: data.user.payModeLabel,
          expiresAt: data.user.expiresAt,
        })
      })
      .catch(() => {
        api.clearToken()
        onLogout()
      })
      .finally(() => setLoading(false))
  }, [onLogout])

  if (loading) {
    return (
      <div className={styles.loading}>加载中...</div>
    )
  }

  if (!user) return null

  if (user.payMode === 0) {
    return <UnpaidView user={user} onLogout={onLogout} />
  }

  if (user.payMode === 3) {
    return <PayGoView user={user} onLogout={onLogout} />
  }

  return <SubscriptionView user={user} onLogout={onLogout} />
}

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!api.getToken())
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = () => {
    api.clearToken()
    setIsLoggedIn(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('请填写用户名和密码')
      return
    }

    setLoading(true)
    try {
      const data = await api.login(username.trim().toLowerCase(), password)
      api.setToken(data.token)
      setIsLoggedIn(true)
      navigate('/login', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('登录失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    return (
      <Container className={styles.page}>
        <LoggedInView onLogout={handleLogout} />
      </Container>
    )
  }

  return (
    <Container className={styles.page}>
      <div className={styles.wrapper}>
        <Card variant="thick" className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>登录</h1>
            <p className={styles.subtitle}>
              登录后查看 Token 额度和使用情况
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="login-username" className={styles.label}>
                用户名
              </label>
              <input
                id="login-username"
                type="text"
                className={styles.input}
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="login-password" className={styles.label}>
                密码
              </label>
              <input
                id="login-password"
                type="password"
                className={styles.input}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className={styles.footer}>
            还没有账号？
            <Link to="/register" className={styles.link}>
              立即注册
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  )
}

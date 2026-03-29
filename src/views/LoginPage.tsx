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

function LoggedInView({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<null | {
    username: string
    role: string
    quotaTokens: number
    usedTokens: number
    frozen: boolean
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
              {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
          </div>
          <Button variant="ghost" onClick={onLogout} className={styles.logoutBtn}>
            退出登录
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>总配额</div>
            <div className={styles.statValue}>{formatNumber(user.quotaTokens)}</div>
            <div className={styles.statUnit}>Tokens</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>已使用</div>
            <div className={`${styles.statValue} ${styles.statValueAccent}`}>{formatNumber(user.usedTokens)}</div>
            <div className={styles.statUnit}>Tokens</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>剩余</div>
            <div className={`${styles.statValue} ${styles.statValueSuccess}`}>{formatNumber(remaining)}</div>
            <div className={styles.statUnit}>Tokens</div>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>额度使用进度</span>
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
              账号已冻结，额度已用完，请充值后联系管理员解冻。
            </div>
          )}
        </div>
      </Card>

      <Card variant="default" className={styles.pricingCard}>
        <h3 className={styles.pricingTitle}>充值 / 升级额度</h3>
        <p className={styles.pricingDesc}>
          额度不足？联系以下方式充值，获取更多 Token 额度。
        </p>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>基础包</div>
            <div className={styles.pricingTokens}>100,000 Tokens</div>
            <div className={styles.pricingPrice}>¥9.9</div>
          </div>
          <div className={`${styles.pricingItem} ${styles.pricingItemFeatured}`}>
            <div className={styles.pricingBadge}>推荐</div>
            <div className={styles.pricingName}>标准包</div>
            <div className={styles.pricingTokens}>500,000 Tokens</div>
            <div className={styles.pricingPrice}>¥39.9</div>
          </div>
          <div className={styles.pricingItem}>
            <div className={styles.pricingName}>专业包</div>
            <div className={styles.pricingTokens}>2,000,000 Tokens</div>
            <div className={styles.pricingPrice}>¥99.9</div>
          </div>
        </div>
        <div className={styles.contactInfo}>
          <p>🟢 微信：jrb_572_</p>
          <p>充值后请联系管理员手动增加额度</p>
        </div>
      </Card>
    </div>
  )
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

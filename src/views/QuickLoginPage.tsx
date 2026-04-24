import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { api } from '../lib/api'
import { Background } from '../ui/Background'
import { HomeNavbar } from '../ui/HomeNavbar'
import styles from './quickLoginPage.module.css'

export function QuickLoginPage() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || ''
  const navigate = useNavigate()
  const { user, loading, login } = useAuth()

  const [authorizing, setAuthorizing] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState('')

  // Login form state (shown when user is not logged in)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  async function handleAuthorize() {
    if (!code) return
    setError('')
    setAuthorizing(true)
    try {
      await api.authorizeClient(code)
      setAuthorized(true)
      // Redirect to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.message || '授权失败，请重试')
    } finally {
      setAuthorizing(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoginLoading(true)
    try {
      await login(username, password)
      // After login, user state will update and we'll show the authorize button
    } catch (err: any) {
      if (err.code === 'ACCOUNT_FROZEN') {
        setError('账号已被冻结，请联系管理员')
      } else {
        setError(err.message || '登录失败，请检查用户名和密码')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  // No code parameter — invalid access
  if (!code) {
    return (
      <div className={styles.page}>
        <Background />
        <HomeNavbar minimal />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logoIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className={styles.title}>无效链接</h1>
              <p className={styles.subtitle}>缺少授权码参数，请从 Lucencia 客户端发起快速登录</p>
            </div>
            <p className={styles.switchText}>
              <Link to="/login" className={styles.link}>前往登录页</Link>
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Loading auth state
  if (loading) {
    return (
      <div className={styles.page}>
        <Background />
        <HomeNavbar minimal />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logoIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className={styles.title}>加载中...</h1>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Authorized successfully
  if (authorized) {
    return (
      <div className={styles.page}>
        <Background />
        <HomeNavbar minimal />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logoIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h1 className={styles.title}>授权成功</h1>
              <p className={styles.subtitle}>客户端已登录，正在跳转到控制台...</p>
            </div>
            <div className={styles.successBox}>
              ✅ Lucencia 客户端已完成登录授权<br />
              您可以返回客户端使用，或在此处管理账户。
            </div>
          </div>
        </main>
      </div>
    )
  }

  // User is logged in — show authorize button
  if (user) {
    return (
      <div className={styles.page}>
        <Background />
        <HomeNavbar minimal />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logoIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className={styles.title}>授权客户端登录</h1>
              <p className={styles.subtitle}>Lucencia 客户端正在请求登录您的账户</p>
            </div>
            <div className={styles.body}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.username}</div>
                {user.email && <div className={styles.userEmail}>{user.email}</div>}
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                className={styles.authorizeBtn}
                onClick={handleAuthorize}
                disabled={authorizing}
              >
                {authorizing ? <span className={styles.spinner} /> : '授权登录'}
              </button>

              <p className={styles.hint}>
                点击授权后，Lucencia 客户端将使用您的账户自动登录。
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // User not logged in — show login form
  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar minimal />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className={styles.title}>快速登录</h1>
            <p className={styles.subtitle}>登录后将自动授权 Lucencia 客户端</p>
          </div>

          <form onSubmit={handleLogin} className={styles.body}>
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>用户名 / 邮箱</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="输入您的用户名或邮箱"
                required
                autoComplete="username"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入您的密码"
                required
                autoComplete="current-password"
                className={styles.input}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loginLoading || !username || !password}
              className={styles.authorizeBtn}
            >
              {loginLoading ? <span className={styles.spinner} /> : '登录并授权'}
            </button>

            <p className={styles.switchText}>
              还没有账户？{' '}
              <Link to={`/register`} className={styles.link}>立即注册</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

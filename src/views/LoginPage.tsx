import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { Background } from '../ui/Background'
import { HomeNavbar } from '../ui/HomeNavbar'
import styles from './loginPage.module.css'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar />

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
            <h1 className={styles.title}>欢迎回来</h1>
            <p className={styles.subtitle}>登录您的 LUCENCIA 账户</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
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

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className={styles.submitBtn}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : '登录'}
            </button>

            <p className={styles.switchText}>
              还没有账户？{' '}
              <Link to="/register" className={styles.link}>立即注册</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

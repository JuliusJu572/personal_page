import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { api, ApiError } from '../lib/api'
import styles from './registerPage.module.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('请填写用户名和密码')
      return
    }
    if (password.length < 8) {
      setError('密码至少 8 位')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const data = await api.register(username.trim().toLowerCase(), password)
      api.setToken(data.token)
      navigate('/cheating-buddy')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('注册失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className={styles.page}>
      <div className={styles.wrapper}>
        <Card variant="thick" className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>创建账号</h1>
            <p className={styles.subtitle}>
              注册即可获得 50,000 Token 免费额度
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                用户名
              </label>
              <input
                id="username"
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
              <label htmlFor="password" className={styles.label}>
                密码
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="至少 8 位"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm-password" className={styles.label}>
                确认密码
              </label>
              <input
                id="confirm-password"
                type="password"
                className={styles.input}
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>

          <div className={styles.footer}>
            已有账号？
            <Link to="/login" className={styles.link}>
              立即登录
            </Link>
          </div>
        </Card>
      </div>
    </Container>
  )
}

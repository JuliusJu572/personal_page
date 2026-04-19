import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { api } from '../lib/api'
import { Background } from '../ui/Background'
import { HomeNavbar } from '../ui/HomeNavbar'
import styles from './registerPage.module.css'

type Step = 'email' | 'code' | 'info'

export function RegisterPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [resendHint, setResendHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const navigate = useNavigate()
  const { register } = useAuth()

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startCountdown = useCallback(() => {
    setCountdown(60)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址')
      return
    }
    setLoading(true)
    try {
      await api.sendVerificationCode(email)
      startCountdown()
      setStep('code')
    } catch (err: any) {
      setError(err.message || '发送验证码失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (code.length !== 6) {
      setError('请输入 6 位验证码')
      return
    }
    setStep('info')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('请填写所有必填字段')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    if (password.length < 8) {
      setError('密码至少 8 位')
      return
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('密码需包含字母和数字')
      return
    }
    setLoading(true)
    try {
      await register(username, email, password, code, inviteCode || undefined)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    if (countdown > 0) return
    setError('')
    setLoading(true)
    try {
      await api.sendVerificationCode(email)
      startCountdown()
      setResendHint('新验证码已发送，之前的验证码已失效')
    } catch (err: any) {
      setError(err.message || '发送验证码失败')
    } finally {
      setLoading(false)
    }
  }

  const stepIndicator = (
    <div className={styles.steps}>
      <div className={`${styles.stepDot} ${step === 'email' ? styles.stepActive : ''} ${step !== 'email' ? styles.stepDone : ''}`}>1</div>
      <div className={styles.stepLine} />
      <div className={`${styles.stepDot} ${step === 'code' ? styles.stepActive : ''} ${step === 'info' ? styles.stepDone : ''}`}>2</div>
      <div className={styles.stepLine} />
      <div className={`${styles.stepDot} ${step === 'info' ? styles.stepActive : ''}`}>3</div>
    </div>
  )

  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <h1 className={styles.title}>创建账户</h1>
            <p className={styles.subtitle}>注册您的 LUCENCIA 账户</p>
          </div>

          {stepIndicator}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>邮箱地址</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您的邮箱地址"
                  required
                  autoComplete="email"
                  className={styles.input}
                />
              </div>

              {/* 【预留】CAPTCHA 验证位 */}

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading || !email}
                className={styles.submitBtn}
              >
                {loading ? <span className={styles.spinner} /> : '发送验证码'}
              </button>

              <p className={styles.switchText}>
                已有账户？{' '}
                <Link to="/login" className={styles.link}>立即登录</Link>
              </p>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className={styles.form}>
              <p className={styles.codeHint}>验证码已发送至 <strong>{email}</strong></p>
              <div className={styles.field}>
                <label htmlFor="code" className={styles.label}>验证码</label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="输入 6 位验证码"
                  required
                  autoComplete="one-time-code"
                  className={`${styles.input} ${styles.codeInput}`}
                />
              </div>

              <div className={styles.resendRow}>
                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={handleResendCode}
                  className={styles.resendBtn}
                >
                  {countdown > 0 ? `重新发送 (${countdown}s)` : '重新发送验证码'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); setResendHint('') }}
                  className={styles.resendBtn}
                >
                  更换邮箱
                </button>
              </div>

              {resendHint && <div className={styles.resendHint}>{resendHint}</div>}
              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={code.length !== 6}
                className={styles.submitBtn}
              >
                下一步
              </button>
            </form>
          )}

          {/* Step 3: Username / Password / Invite Code */}
          {step === 'info' && (
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="username" className={styles.label}>用户名</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="3-20位，小写字母、数字、下划线"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-z0-9_]{3,20}"
                  autoComplete="username"
                  className={styles.input}
                />
                <span className={styles.fieldHint}>用户名仅支持小写字母、数字和下划线</span>
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>密码</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="设置密码（至少 8 位）"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>确认密码</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="inviteCode" className={styles.label}>
                  邀请码 <span className={styles.optional}>（选填，双方获 7 天进阶版试用）</span>
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="如有邀请码请输入"
                  maxLength={8}
                  autoComplete="off"
                  className={styles.input}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading || !username || !password || !confirmPassword}
                className={styles.submitBtn}
              >
                {loading ? <span className={styles.spinner} /> : '创建账户'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('code'); setError('') }}
                className={styles.backBtn}
              >
                ← 返回上一步
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

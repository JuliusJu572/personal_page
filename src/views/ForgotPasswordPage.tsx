import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Background } from '../ui/Background'
import { HomeNavbar } from '../ui/HomeNavbar'
import styles from './forgotPasswordPage.module.css'

type Step = 'email' | 'reset'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const navigate = useNavigate()

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
    setSuccess('')
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址')
      return
    }
    setLoading(true)
    try {
      const res = await api.forgotPassword(email)
      startCountdown()
      setSuccess(res.message || '验证码已发送')
      setStep('reset')
    } catch (err: any) {
      setError(err.message || '发送失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (code.length !== 6) {
      setError('请输入 6 位验证码')
      return
    }
    if (newPassword.length < 8) {
      setError('密码至少 8 位')
      return
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('密码需包含字母和数字')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    setLoading(true)
    try {
      const res = await api.resetPassword(email, code, newPassword)
      setSuccess(res.message || '密码重置成功')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.message || '重置失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    if (countdown > 0) return
    setError('')
    setLoading(true)
    try {
      await api.forgotPassword(email)
      startCountdown()
    } catch (err: any) {
      setError(err.message || '发送失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Background />
      <HomeNavbar minimal />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h1 className={styles.title}>重置密码</h1>
            <p className={styles.subtitle}>通过邮箱验证码重置您的密码</p>
          </div>

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>注册邮箱</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入您注册时的邮箱地址"
                  required
                  autoComplete="email"
                  className={styles.input}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <button
                type="submit"
                disabled={loading || !email}
                className={styles.submitBtn}
              >
                {loading ? <span className={styles.spinner} /> : '发送验证码'}
              </button>

              <p className={styles.switchText}>
                <Link to="/login" className={styles.link}>← 返回登录</Link>
              </p>
            </form>
          )}

          {/* Step 2: Code + New Password */}
          {step === 'reset' && (
            <form onSubmit={handleReset} className={styles.form}>
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

              <div className={styles.field}>
                <label htmlFor="newPassword" className={styles.label}>新密码</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="设置新密码（至少 8 位）"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>确认新密码</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入新密码"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
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
                  onClick={() => { setStep('email'); setError(''); setSuccess('') }}
                  className={styles.resendBtn}
                >
                  更换邮箱
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <button
                type="submit"
                disabled={loading || code.length !== 6 || !newPassword || !confirmPassword}
                className={styles.submitBtn}
              >
                {loading ? <span className={styles.spinner} /> : '重置密码'}
              </button>

              <p className={styles.switchText}>
                <Link to="/login" className={styles.link}>← 返回登录</Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

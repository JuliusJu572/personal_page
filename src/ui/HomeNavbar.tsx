import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import styles from './homeNavbar.module.css'

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById('pricing')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById('hero-download')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <nav className={[styles.navbar, scrolled ? styles.navbarScrolled : undefined].filter(Boolean).join(' ')}>
        <div className={styles.left}>
          <button className={styles.logo} onClick={handleLogoClick} aria-label="回到顶部">
            <img className={styles.logoImg} src="/lucencia-logo.png" alt="LUCENCIA" />
          </button>
          <div className={styles.navLinks}>
            <a href="#pricing" className={styles.navLink} onClick={handlePricingClick}>定价</a>
            <Link to="/guide" className={styles.navLink}>使用说明</Link>
            <a href="#hero-download" className={styles.navLink} onClick={handleDownloadClick}>下载</a>
          </div>
        </div>

        <div className={styles.right}>
          <a href="#hero-download" className={styles.downloadBtn} onClick={handleDownloadClick}>
            Download
          </a>

          {user ? (
            <div className={styles.userArea}>
              <span className={styles.userName}>{user.username}</span>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>退出</button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginLink}>登录</Link>
          )}

          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <div className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : undefined].filter(Boolean).join(' ')}>
        <a href="#pricing" className={styles.mobileMenuLink} onClick={(e) => { handlePricingClick(e); setMenuOpen(false) }}>定价</a>
        <Link to="/guide" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>使用说明</Link>
        <a href="#hero-download" className={styles.mobileMenuLink} onClick={(e) => { handleDownloadClick(e); setMenuOpen(false) }}>下载</a>
        {user ? (
          <>
            <span className={styles.userName}>{user.username}</span>
            <button type="button" className={styles.logoutBtn} onClick={() => { handleLogout(); setMenuOpen(false) }}>退出</button>
          </>
        ) : (
          <Link to="/login" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>登录</Link>
        )}
      </div>
    </>
  )
}

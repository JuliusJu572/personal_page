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
    navigate('/lucencia')
    window.scrollTo(0, 0)
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
            <Link to="/pricing" className={styles.navLink}>定价</Link>
            <Link to="/guide" className={styles.navLink}>使用说明</Link>
            <Link to="/knowledge-cards" className={styles.navLink}>知识卡片</Link>
          </div>
        </div>

        <div className={styles.right}>
          {user ? (
            <div className={styles.userArea}>
              <Link to="/dashboard" className={styles.dashboardLink}>{user.username || '工作台'}</Link>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>退出</button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtnSolid}>登录</Link>
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
        <Link to="/pricing" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>定价</Link>
        <Link to="/guide" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>使用说明</Link>
        <Link to="/knowledge-cards" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>知识卡片</Link>
        {user ? (
          <>
            <Link to="/dashboard" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>{user.username || '工作台'}</Link>
            <button type="button" className={styles.logoutBtn} onClick={() => { handleLogout(); setMenuOpen(false) }}>退出</button>
          </>
        ) : (
          <Link to="/login" className={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>登录</Link>
        )}
      </div>
    </>
  )
}

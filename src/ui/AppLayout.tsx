import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import styles from './appLayout.module.css'

const navItems: Array<{ to: string; label: string }> = [
  { to: '/cheating-buddy', label: 'Cheating Buddy' },
  { to: '/guide', label: '使用说明' },
  { to: '/knowledge-cards', label: '知识卡片' },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true" />
            <div className={styles.brandText}>
              <div className={styles.brandTitle}>JuliusJu</div>
              <div className={styles.brandSubtitle}>Cheating Buddy · Projects</div>
            </div>
          </div>

          <nav className={styles.nav} aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : undefined]
                    .filter(Boolean)
                    .join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.username}</span>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  退出
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : undefined]
                    .filter(Boolean)
                    .join(' ')
                }
              >
                登录
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} JuliusJu</span>
        </div>
      </footer>
    </div>
  )
}

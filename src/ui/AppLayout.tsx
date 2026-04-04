import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import styles from './appLayout.module.css'

const navItems: Array<{ to: string; label: string }> = [
  { to: '/lucencia', label: '产品概览' },
  { to: '/features', label: '核心功能' },
  { to: '/pricing', label: '定价' },
  { to: '/guide', label: '使用说明' },
  { to: '/knowledge-cards', label: '知识卡片' },
]

const authNavItems: Array<{ to: string; label: string }> = [
  { to: '/dashboard', label: '工作台' },
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
            <img className={styles.brandIcon} src="/lucencia_icon.png" alt="" width={36} height={36} />
            <div className={styles.brandText}>
              <div className={styles.brandTitle}>Lucencia · 露森西娅</div>
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
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    [styles.navLink, isActive ? styles.navLinkActive : undefined]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  工作台
                </NavLink>
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
          <div className={styles.footerLinks}>
            <a href="/terms" className={styles.footerLink}>用户服务协议</a>
            <a href="/privacy" className={styles.footerLink}>隐私政策</a>
          </div>
          <span>© {new Date().getFullYear()} Daedalus Tech</span>
        </div>
      </footer>
    </div>
  )
}

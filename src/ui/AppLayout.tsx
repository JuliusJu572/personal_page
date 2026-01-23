import { NavLink, Outlet } from 'react-router-dom'
import styles from './appLayout.module.css'

const navItems: Array<{ to: string; label: string }> = [
  { to: '/', label: '主页' },
  { to: '/cheating-buddy', label: 'Cheating Buddy' },
  { to: '/tarot', label: 'Mystic AI Tarot' },
]

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true" />
            <div className={styles.brandText}>
              <div className={styles.brandTitle}>JuliusJu</div>
              <div className={styles.brandSubtitle}>个人主页 · Projects</div>
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
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} JuliusJu</span>
          <a
            href="https://github.com/JuliusJu572"
            target="_blank"
            rel="noreferrer"
            className={styles.footerLink}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}


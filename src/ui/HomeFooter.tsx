import styles from './homeFooter.module.css'

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLine} />
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <span className={styles.brand}>LUCENCIA</span>
        </div>
        <nav className={styles.footerLinks}>
          <a href="/terms" className={styles.footerLink}>用户服务协议</a>
          <a href="/privacy" className={styles.footerLink}>隐私政策</a>
        </nav>
        <span className={styles.copyright}>© {new Date().getFullYear()} Daedalus Tech</span>
      </div>
    </footer>
  )
}

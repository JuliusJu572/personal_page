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
        <div className={styles.footerRight}>
          <span className={styles.company}>上海岱达罗智信息科技有限公司</span>
          <span className={styles.companyEn}>Shanghai Daedalus Intelligence Technology Co., Ltd.</span>
          <span className={styles.copyright}>© {new Date().getFullYear()} Daedalus Tech</span>
        </div>
      </div>
    </footer>
  )
}

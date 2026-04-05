import styles from './privacySecuritySection.module.css'

const ITEMS = [
  {
    icon: '🔒',
    iconClass: styles.iconShield,
    title: '数据隐私保护',
    desc: '本服务器仅保存用户账号信息，不保存任何用户上传的文档以及个人信息。本地优先原则。音频、截图等文件本地存储。支持隐私模式限制数据使用范围。',
  },
  {
    icon: '🔑',
    iconClass: styles.iconKey,
    title: '安全数据访问',
    desc: '端到端加密传输，严格访问控制机制。防止未授权访问，降低数据暴露风险，全方位守护信息安全。',
  },
  {
    icon: '🌐',
    iconClass: styles.iconGlobeSeg,
    title: '区域化部署',
    desc: '基于账户位置的区域部署策略，数据存储隔离，满足各地数据合规要求，让数据主权得到保障。',
  },
]

export function PrivacySecuritySection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>隐私与安全</h2>
      <p className={styles.subtitle}>你的数据，由你掌控</p>
      <div className={styles.grid}>
        {ITEMS.map((item, i) => (
          <div key={i} className={styles.card}>
            <div className={[styles.iconWrap, item.iconClass].join(' ')}>
              {item.icon}
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

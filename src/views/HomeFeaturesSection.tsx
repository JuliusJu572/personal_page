import styles from './homeFeaturesSection.module.css'

const FEATURES = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    iconClass: styles.iconGlobe,
    title: '多语种同声传译',
    desc: '支持 50+ 语种实时语音翻译，毫秒级响应。专业术语库定制，确保跨国会议沟通精准无误，让语言不再是障碍。',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><path d="M12 5v2m0 10v2M5 12h2m10 0h2"/></svg>,
    iconClass: styles.iconEye,
    title: '智能屏幕视界解析',
    desc: 'PPT、图表、代码一键识别翻译。基于视觉模型的 OCR 引擎，会议投屏内容实时理解与翻译，信息获取从未如此高效。',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    iconClass: styles.iconBrain,
    title: '企业知识大脑共鸣',
    desc: '上传文档自动构建企业知识库。智能检索 + RAG 增强检索，让 AI 真正理解你的业务领域，提供精准的上下文回答。',
  },
]

export function HomeFeaturesSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>核心功能</h2>
      <p className={styles.subtitle}>三大 AI 能力，重新定义全球协作体验</p>
      <div className={styles.grid}>
        {FEATURES.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={[styles.iconWrap, f.iconClass].join(' ')}>
              <span className={styles.iconPulse} />
              {f.icon}
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

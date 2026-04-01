import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import styles from './featuresPage.module.css'

const features = [
  {
    id: 'translation',
    title: '多语种同声传译',
    subtitle: 'Real-time Polyglot Translation',
    tagline: '听见世界，母语呈现。',
    description: '无论会议使用的是英语、日语还是法语，Lucencia 都能进行毫秒级的语音捕获与高精度转写，并实时翻译为您熟悉的母语。为跨国业务团队和听障人士提供无延迟的"字幕级"沟通体验。',
    icon: '🌐',
    benefits: [
      '支持 50+ 语种实时翻译',
      '毫秒级语音识别与转写',
      '专业术语库定制',
      '会议纪要自动生成',
    ],
    image: '/features-images/translation.png',
  },
  {
    id: 'ocr',
    title: '智能屏幕视界解析',
    subtitle: 'Smart Screen OCR & Translation',
    tagline: '看懂每一页跨国演示。',
    description: '开会时遇到复杂的外语 PPT 或图表？Lucencia 独创的智能屏幕捕获与 OCR 技术，能够一键解析共享屏幕上的外文资料，并在不打扰会议进程的情况下，在侧边栏为您提供精准的翻译与图文内容结构化摘要。',
    icon: '📸',
    benefits: [
      '一键屏幕内容捕获',
      '多语种 OCR 识别',
      '图表数据智能提取',
      '结构化内容摘要',
    ],
    image: '/features-images/ocr.png',
  },
  {
    id: 'knowledge',
    title: '企业级知识大脑共鸣',
    subtitle: 'Enterprise Knowledge Copilot',
    tagline: '您的专属会议智囊团。',
    description: '支持一键上传项目文档、企业白皮书及行业研报。在会议进行时，Lucencia 会结合会议语境与您的外接知识库进行实时比对，当您被问及复杂数据或专业方案时，AI 助手将迅速从您的知识库中检索并生成标准回答参考，让您在任何会议中都游刃有余。',
    icon: '🧠',
    benefits: [
      '企业文档智能解析',
      '实时知识库检索',
      '上下文关联推荐',
      '标准回答生成',
    ],
    image: '/features-images/knowledge.png',
  },
]

export function FeaturesPage() {
  return (
    <Container className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>核心功能</h1>
          <p className={styles.subtitle}>
            三大核心能力，重新定义跨国会议协作体验
          </p>
        </div>
      </header>

      <div className={styles.featuresContainer}>
        {features.map((feature, index) => (
          <section
            key={feature.id}
            className={`${styles.featureSection} ${index % 2 === 1 ? styles.featureSectionReverse : ''}`}
          >
            <div className={styles.featureContent}>
              <div className={styles.featureText}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h2 className={styles.featureTitle}>{feature.title}</h2>
                <p className={styles.featureSubtitle}>{feature.subtitle}</p>
                <p className={styles.featureTagline}>{feature.tagline}</p>
                <p className={styles.featureDescription}>{feature.description}</p>
                <ul className={styles.benefitsList}>
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className={styles.benefitItem}>
                      <span className={styles.benefitIcon}>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.featureImage}>
                <Card className={styles.imageCard}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={styles.image}
                    loading="lazy"
                  />
                </Card>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className={styles.integrationSection}>
        <div className={styles.integrationContent}>
          <h2 className={styles.integrationTitle}>无缝集成您的工作流</h2>
          <p className={styles.integrationText}>
            Lucencia 支持与主流会议平台无缝集成，无需改变现有工作习惯
          </p>
          <div className={styles.platformsGrid}>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>🎥</div>
              <span className={styles.platformName}>Zoom</span>
            </div>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>💼</div>
              <span className={styles.platformName}>Microsoft Teams</span>
            </div>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>📱</div>
              <span className={styles.platformName}>腾讯会议</span>
            </div>
            <div className={styles.platformItem}>
              <div className={styles.platformIcon}>📞</div>
              <span className={styles.platformName}>飞书会议</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsContent}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>支持语种</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.2%</div>
            <div className={styles.statLabel}>翻译准确率</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50ms</div>
            <div className={styles.statLabel}>平均延迟</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>企业用户</div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>准备好提升您的会议效率了吗？</h2>
          <p className={styles.ctaText}>
            立即体验 Lucencia，感受 AI 驱动的会议协同新方式
          </p>
          <div className={styles.ctaButtons}>
            <a href="/lucencia" className={styles.ctaPrimary}>
              免费试用
            </a>
            <a href="/guide" className={styles.ctaSecondary}>
              查看使用指南
            </a>
          </div>
        </div>
      </section>
    </Container>
  )
}
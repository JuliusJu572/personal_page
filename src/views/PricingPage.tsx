import { useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { useAuth } from '../lib/authContext'
import styles from './pricingPage.module.css'

interface ModelLogo {
  src: string
  alt: string
}

interface PricingPlan {
  id: string
  price: number
  tagline: string
  weeklyQuota: number
  monthlyLimit: number
  weeklyDisplay: string
  monthlyDisplay: string
  modelTier: string
  icon: string
  modelLogos: ModelLogo[]
  overseasOnly?: boolean
  features: string[]
  limitations: string[]
  popular?: boolean
  payMode: number
}

const plans: PricingPlan[] = [
  {
    id: 'normal',
    price: 99,
    tagline: '极速流畅的 AI 对话引擎，日常创作利器',
    weeklyQuota: 1000000,
    monthlyLimit: 5000000,
    weeklyDisplay: '1,000,000',
    monthlyDisplay: '5,000,000',
    modelTier: 'Qwen 等基础极速大模型矩阵',
    icon: '/Qwen.png',
    modelLogos: [
      { src: '/Qwen.png', alt: 'Qwen' },
    ],
    features: [
      `每周发放 ${'1,000,000'} 基础算力积分`,
      'Qwen 系列基础极速大模型',
    ],
    limitations: ['不支持 MiniMax 等国产旗舰模型', '不支持文档解析功能'],
    payMode: 1,
  },
  {
    id: 'advanced',
    price: 199,
    tagline: '专业知识工作者的生产力中枢',
    weeklyQuota: 2000000,
    monthlyLimit: 10000000,
    weeklyDisplay: '2,000,000',
    monthlyDisplay: '10,000,000',
    modelTier: '国产进阶大模型全家桶',
    icon: '/智谱.png',
    modelLogos: [
      { src: '/Qwen.png', alt: 'Qwen' },
      { src: '/MiniMax.png', alt: 'MiniMax' },
      { src: '/智谱.png', alt: 'Zhipu' },
      { src: '/Kimi.png', alt: 'Kimi' },
    ],
    features: [
      `每周发放 ${'2,000,000'} 专业算力积分`,
      '解锁国产进阶大模型全家桶',
      '支持专业级长文档解析（轻松应对万字研报）',
    ],
    limitations: [],
    popular: true,
    payMode: 2,
  },
  {
    id: 'premium',
    price: 399,
    tagline: '全能数据分析与极客工程站',
    weeklyQuota: 4000000,
    monthlyLimit: 20000000,
    weeklyDisplay: '4,000,000',
    monthlyDisplay: '20,000,000',
    modelTier: '全球全量算力矩阵',
    icon: '/Claude.png',
    overseasOnly: true,
    modelLogos: [
      { src: '/ChatGPT.png', alt: 'ChatGPT' },
      { src: '/Claude.png', alt: 'Claude' },
      { src: '/gemini-ai.png', alt: 'Gemini' },
      { src: '/Grok.png', alt: 'Grok' },
      { src: '/智谱.png', alt: 'Zhipu' },
      { src: '/Qwen.png', alt: 'Qwen' },
      { src: '/Kimi.png', alt: 'Kimi' },
      { src: '/MiniMax.png', alt: 'MiniMax' },
    ],
    features: [
      `每周发放 ${'4,000,000'} 超级算力积分`,
      '解锁全球全量模型（国产 + 海外）',
      '支持超长巨型文档解析矩阵，代码库级全局构建',
      '优先响应与专属通道',
    ],
    limitations: ['适用范围：非中国大陆地区'],
    payMode: 3,
  },
]

function formatPrice(price: number) {
  return `\u00a5${price}`
}

export function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handlePurchase = (_planId: string) => {
    if (!user) {
      navigate('/login?redirect=/pricing')
      return
    }
  }

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.bgGlow} />
          <div className={styles.heroContent}>
            <h1 className={styles.title}>选择适合你的算力引擎</h1>
            <p className={styles.subtitle}>每周自动充能，按需释放潜能</p>
          </div>
        </header>

        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
            >
              {plan.popular && (
              <Badge tone="accent" className={styles.popularBadge}>
                最受欢迎
              </Badge>
            )}
            {plan.overseasOnly && (
              <Badge tone="warn" className={styles.overseasBadge}>
                仅海外用户可用
              </Badge>
            )}

              <div className={`${styles.planIconGroup} ${plan.modelLogos.length > 4 ? styles.planIconGroupGrid : ''}`}>
                {plan.modelLogos.map((logo) => (
                  <img
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    className={styles.planLogoImg}
                    loading="lazy"
                    title={logo.alt}
                  />
                ))}
              </div>

              <h2 className={styles.planName}>
                {plan.id === 'normal' ? '普通版' : plan.id === 'advanced' ? '进阶版' : plan.id === 'overseas' ? '海外版' : '高级版'}
              </h2>

              <div className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(plan.price)}</span>
                <span className={styles.period}>/月</span>
              </div>

              <p className={styles.tagline}>{plan.tagline}</p>

            <div className={styles.quotaInfo}>
                <div className={styles.quotaItem}>
                  <span className={styles.quotaLabel}>周额度</span>
                  <span className={styles.quotaValue}>{plan.weeklyDisplay}</span>
                </div>
                <div className={styles.quotaDivider} />
                <div className={styles.quotaItem}>
                  <span className={styles.quotaLabel}>月限额</span>
                  <span className={styles.quotaValue}>{plan.monthlyDisplay}</span>
                </div>
              </div>

              <ul className={styles.featuresList}>
                {plan.features.map((feature, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <li key={`lim-${i}`} className={styles.limitItem}>
                    <span className={styles.crossIcon}>✗</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                size="lg"
                className={styles.purchaseBtn}
                onClick={() => handlePurchase(plan.id)}
              >
                立即购买
              </Button>
            </Card>
          ))}
        </div>

        <section className={styles.noteSection}>
          <p className={styles.noteText}>
            所有套餐均按月计费，周额度于每周一自动刷新，月度限额于付费日重置。
            随时可升级或降级套餐，差价按比例折算。
          </p>
        </section>
      </Container>
      <HomeFooter />
    </div>
  )
}

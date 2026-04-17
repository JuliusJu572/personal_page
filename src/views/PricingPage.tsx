import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { useAuth } from '../lib/authContext'
import { api } from '../lib/api'
import type { PricingPlanApi, FeatureComparisonItem } from '../lib/api'
import styles from './pricingPage.module.css'

function formatPrice(price: number) {
  return `\u00a5${price}`
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

export function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [subscriptionPlans, setSubscriptionPlans] = useState<PricingPlanApi[]>([])
  const [onetimePlans, setOnetimePlans] = useState<PricingPlanApi[]>([])
  const [featureComparison, setFeatureComparison] = useState<Record<string, FeatureComparisonItem>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getPricing()
      .then((data) => {
        setSubscriptionPlans(data.subscriptionPlans || [])
        setOnetimePlans(data.onetimePlans || [])
        setFeatureComparison(data.featureComparison || {})
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || '获取定价信息失败')
        setLoading(false)
      })
  }, [])

  const handlePurchase = (_planId: string) => {
    if (!user) {
      navigate('/login?redirect=/pricing')
      return
    }
  }

  const planNameMap: Record<string, string> = {
    normal: '普通版',
    advanced: '进阶版',
    premium: '高级版',
    'onetime-normal': '普通版',
    'onetime-advanced': '进阶版',
    'onetime-premium': '高级版',
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

        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>加载中...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ff6b6b' }}>{error}</p>}

        {/* ── Subscription Plans ── */}
        {!loading && subscriptionPlans.length > 0 && (
          <>
            <h2 className={styles.sectionHeading}>订阅制套餐 <span className={styles.sectionSub}>按月计费 · 每周自动充能</span></h2>
            <div className={styles.plansGrid}>
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
                >
                  {plan.popular && (
                    <Badge tone="accent" className={styles.popularBadge}>最受欢迎</Badge>
                  )}
                  {plan.overseasOnly && (
                    <Badge tone="warn" className={styles.overseasBadge}>仅海外用户可用</Badge>
                  )}

                  <div className={`${styles.planIconGroup} ${(plan.modelLogos?.length || 0) > 4 ? styles.planIconGroupGrid : ''}`}>
                    {(plan.modelLogos || []).map((logo) => (
                      <img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.planLogoImg} loading="lazy" title={logo.alt} />
                    ))}
                  </div>

                  <h2 className={styles.planName}>{planNameMap[plan.id] || plan.id}</h2>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(plan.price)}</span>
                    <span className={styles.period}>/月</span>
                  </div>

                  <p className={styles.tagline}>{plan.tagline}</p>

                  <div className={styles.quotaInfo}>
                    <div className={styles.quotaItem}>
                      <span className={styles.quotaLabel}>周额度</span>
                      <span className={styles.quotaValue}>{formatNumber(plan.weeklyQuota || 0)}</span>
                    </div>
                    <div className={styles.quotaDivider} />
                    <div className={styles.quotaItem}>
                      <span className={styles.quotaLabel}>月限额</span>
                      <span className={styles.quotaValue}>{formatNumber(plan.monthlyLimit || 0)}</span>
                    </div>
                  </div>

                  <ul className={styles.featuresList}>
                    {plan.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        <span className={styles.checkIcon}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {(plan.limitations || []).map((limitation, i) => (
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
          </>
        )}

        {/* ── One-Time Plans ── */}
        {!loading && onetimePlans.length > 0 && (
          <>
            <h2 className={styles.sectionHeading}>单次付费模式 <span className={styles.sectionSub}>即用即买 · 限时体验</span></h2>
            <div className={styles.plansGrid}>
              {onetimePlans.map((plan) => (
                <Card key={plan.id} className={styles.planCard}>
                  <div className={styles.onetimeBadgeArea}>
                    <Badge tone="accent" className={styles.onetimeBadge}>
                      {plan.durationDisplay} 限时
                    </Badge>
                  </div>

                  <h2 className={styles.planName}>{planNameMap[plan.id] || plan.id}</h2>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(plan.price)}</span>
                    <span className={styles.period}>/次</span>
                  </div>

                  <p className={styles.tagline}>{plan.tagline}</p>

                  <div className={styles.quotaInfo}>
                    <div className={styles.quotaItem}>
                      <span className={styles.quotaLabel}>算力额度</span>
                      <span className={styles.quotaValue}>{formatNumber(plan.quota || 0)}</span>
                    </div>
                    <div className={styles.quotaDivider} />
                    <div className={styles.quotaItem}>
                      <span className={styles.quotaLabel}>限时</span>
                      <span className={styles.quotaValue}>{plan.durationDisplay}</span>
                    </div>
                  </div>

                  <ul className={styles.featuresList}>
                    {plan.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        <span className={styles.checkIcon}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="secondary"
                    size="lg"
                    className={styles.purchaseBtn}
                    onClick={() => handlePurchase(plan.id)}
                  >
                    立即购买
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── Feature Comparison Table ── */}
        {!loading && Object.keys(featureComparison).length > 0 && (
          <>
            <h2 className={styles.sectionHeading}>功能对比</h2>
            <div className={styles.comparisonTable}>
              <table>
                <thead>
                  <tr>
                    <th>功能</th>
                    <th>普通版</th>
                    <th>进阶版</th>
                    <th>高级版</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(featureComparison).map((row, i) => (
                    <tr key={i}>
                      <td className={styles.compLabel}>{row.label}</td>
                      <td>{row.normal}</td>
                      <td>{row.advanced}</td>
                      <td>{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Available Models per Tier ── */}
        {!loading && subscriptionPlans.length > 0 && (
          <>
            <h2 className={styles.sectionHeading}>各套餐可用模型</h2>
            <div className={styles.modelGrid}>
              {[...subscriptionPlans, ...onetimePlans].filter(plan => (plan.models || []).length > 0).map((plan) => (
                <div key={plan.id} className={styles.modelCard}>
                  <h3 className={styles.modelCardTitle}>
                    {planNameMap[plan.id] || plan.id}
                    {plan.billingType === 'one_time' && <span className={styles.modelCardTag}>单次</span>}
                  </h3>
                  <ul className={styles.modelList}>
                    {(plan.models || []).map((m, i) => (
                      <li key={i} className={styles.modelItem}>{m}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        <section className={styles.noteSection}>
          <p className={styles.noteText}>
            订阅套餐按月计费，周额度于每周一自动刷新，月度限额于付费日重置。
            随时可升级或降级套餐，差价按比例折算。
            单次付费模式在客户端激活后开始计时，不可暂停，到期后自动结束。
          </p>
        </section>
      </Container>
      <HomeFooter />
    </div>
  )
}

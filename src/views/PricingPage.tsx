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
import type { PricingPlanApi } from '../lib/api'
import styles from './pricingPage.module.css'

function formatPrice(price: number) {
  return `\u00a5${price}`
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

type BillingTab = 'subscription' | 'one_time'

export function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [subscriptionPlans, setSubscriptionPlans] = useState<PricingPlanApi[]>([])
  const [onetimePlans, setOnetimePlans] = useState<PricingPlanApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [billingTab, setBillingTab] = useState<BillingTab>('subscription')

  useEffect(() => {
    api.getPricing()
      .then((data) => {
        setSubscriptionPlans(data.subscriptionPlans || [])
        setOnetimePlans(data.onetimePlans || [])
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

  // Pair subscription and one-time plans by payMode for unified rendering
  const activePlans = billingTab === 'subscription' ? subscriptionPlans : onetimePlans
  const isOneTime = billingTab === 'one_time'

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.bgGlow} />
          <div className={styles.heroContent}>
            <h1 className={styles.title}>选择适合你的算力引擎</h1>
            <p className={styles.subtitle}>
              {isOneTime ? '即用即买，灵活释放潜能' : '每周自动充能，按需释放潜能'}
            </p>
          </div>
        </header>

        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>加载中...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ff6b6b' }}>{error}</p>}

        {/* ── Billing Mode Toggle ── */}
        {!loading && (
          <div className={styles.billingToggle}>
            <button
              className={`${styles.billingToggleBtn} ${billingTab === 'subscription' ? styles.billingToggleBtnActive : ''}`}
              onClick={() => setBillingTab('subscription')}
            >
              月包制
            </button>
            <button
              className={`${styles.billingToggleBtn} ${billingTab === 'one_time' ? styles.billingToggleBtnActive : ''}`}
              onClick={() => setBillingTab('one_time')}
            >
              单次制
            </button>
          </div>
        )}

        {/* ── Plan Cards (shared layout) ── */}
        {!loading && activePlans.length > 0 && (
          <div className={styles.plansGrid}>
            {activePlans.map((plan) => (
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
                {isOneTime && (
                  <Badge tone="accent" className={styles.onetimeTimeBadge}>
                    {plan.durationDisplay} 限时
                  </Badge>
                )}

                <div className={`${styles.planIconGroup} ${(plan.modelLogos?.length || 0) > 4 ? styles.planIconGroupGrid : ''}`}>
                  {(plan.modelLogos || []).map((logo) => (
                    <img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.planLogoImg} loading="lazy" title={logo.alt} />
                  ))}
                </div>

                <h2 className={styles.planName}>{planNameMap[plan.id] || plan.id}</h2>

                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatPrice(plan.price)}</span>
                  <span className={styles.period}>{isOneTime ? '/次' : '/月'}</span>
                </div>

                <p className={styles.tagline}>{plan.tagline}</p>

                <div className={styles.quotaInfo}>
                  {isOneTime ? (
                    <>
                      <div className={styles.quotaItem}>
                        <span className={styles.quotaLabel}>算力额度</span>
                        <span className={styles.quotaValue}>{formatNumber(plan.quota || 0)}</span>
                      </div>
                      <div className={styles.quotaDivider} />
                      <div className={styles.quotaItem}>
                        <span className={styles.quotaLabel}>限时</span>
                        <span className={styles.quotaValue}>{plan.durationDisplay}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.quotaItem}>
                        <span className={styles.quotaLabel}>周额度</span>
                        <span className={styles.quotaValue}>{formatNumber(plan.weeklyQuota || 0)}</span>
                      </div>
                      <div className={styles.quotaDivider} />
                      <div className={styles.quotaItem}>
                        <span className={styles.quotaLabel}>月限额</span>
                        <span className={styles.quotaValue}>{formatNumber(plan.monthlyLimit || 0)}</span>
                      </div>
                    </>
                  )}
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
        )}

        {/* ── Available Models per Tier (subscription only, same for one-time) ── */}
        {!loading && subscriptionPlans.length > 0 && (
          <>
            <h2 className={styles.sectionHeading}>各套餐可用模型</h2>
            <div className={styles.modelGrid}>
              {subscriptionPlans.filter(plan => (plan.models || []).length > 0).map((plan) => (
                <div key={plan.id} className={styles.modelCard}>
                  <h3 className={styles.modelCardTitle}>
                    {planNameMap[plan.id] || plan.id}
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

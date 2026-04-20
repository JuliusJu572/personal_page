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
  const [eligibility, setEligibility] = useState<Record<string, { canPurchase: boolean; reason: string; isUpgrade: boolean; upgradePrice: number | null; isCurrent: boolean }>>({})

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

  useEffect(() => {
    if (!user) return
    api.getEligibility()
      .then((data) => {
        const map: Record<string, typeof eligibility[string]> = {}
        for (const p of data.plans) {
          map[p.planId] = { canPurchase: p.canPurchase, reason: p.reason, isUpgrade: p.isUpgrade, upgradePrice: p.upgradePrice, isCurrent: p.isCurrent }
        }
        setEligibility(map)
      })
      .catch(() => {})
  }, [user])

  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [pendingOrder, setPendingOrder] = useState<{
    outTradeNo: string; planLabel: string; amount: string; payUrl: string; createdAt: string
  } | null>(null)
  const [cancellingOrder, setCancellingOrder] = useState(false)

  // Check for pending orders
  useEffect(() => {
    if (!user) return
    api.getPendingOrder()
      .then((data) => setPendingOrder(data.order || null))
      .catch(() => {})
  }, [user])

  const handleCancelOrder = async () => {
    if (!pendingOrder) return
    setCancellingOrder(true)
    try {
      await api.cancelOrder(pendingOrder.outTradeNo)
      setPendingOrder(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '取消订单失败')
    } finally {
      setCancellingOrder(false)
    }
  }

  const handlePurchase = async (planId: string) => {
    if (!user) {
      navigate('/login?redirect=/pricing')
      return
    }

    setPurchasing(planId)
    try {
      const billingType = isOneTime ? 'one_time' : 'subscription'
      const data = await api.createPayment(planId, billingType as 'subscription' | 'one_time')
      if (data.payUrl) {
        const elig = eligibility[planId]
        const displayAmount = (elig?.isUpgrade && elig?.upgradePrice != null)
          ? elig.upgradePrice.toFixed(2)
          : String(activePlans.find(p => p.id === planId)?.price || '')
        setPendingOrder({
          outTradeNo: data.outTradeNo,
          planLabel: planNameMap[planId] || planId,
          amount: displayAmount,
          payUrl: data.payUrl,
          createdAt: new Date().toISOString(),
        })
        window.location.href = data.payUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建订单失败')
    } finally {
      setPurchasing(null)
    }
  }

  const planNameMap: Record<string, string> = {
    free: '免费版',
    normal: '普通版',
    advanced: '进阶版',
    premium: '高级版',
    'onetime-normal': '普通版',
    'onetime-advanced': '进阶版',
    'onetime-premium': '高级版',
  }

  // Featured models: highlighted + sorted to the top
  const featuredModels = new Set([
    'Kimi-K2.5',
    'GLM-5.1',
    'MiniMax-M2.7-Highspeed',
    'Claude-Sonnet-4.6',
    'Claude-Haiku-4.5',
    'Gemini-3.1-Pro',
    'Gemini-3.1-Flash-Lite',
    'Grok-4.1-Fast',
    'GPT-5.4',
    'GPT-5.4-Nano',
  ])
  const modelPriority: Record<string, number> = {
    'Claude-Sonnet-4.6': 0,
    'Gemini-3.1-Pro': 1,
    'MiniMax-M2.7-Highspeed': 2,
  }
  function sortModels(models: string[]) {
    return [...models].sort((a, b) => {
      const af = featuredModels.has(a)
      const bf = featuredModels.has(b)
      if (af !== bf) return af ? -1 : 1
      if (af && bf) {
        const pa = modelPriority[a] ?? 99
        const pb = modelPriority[b] ?? 99
        return pa - pb
      }
      return 0
    })
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

        {/* ── Pending Order Banner ── */}
        {pendingOrder && (
          <div style={{
            margin: '0 auto 1.5rem',
            maxWidth: '600px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            background: 'rgba(255, 170, 0, 0.1)',
            border: '1px solid rgba(255, 170, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>⏳</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                您有一笔待支付订单：{pendingOrder.planLabel}（¥{pendingOrder.amount}）
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={pendingOrder.payUrl}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#ffaa00',
                  color: '#000',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                继续支付
              </a>
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: cancellingOrder ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {cancellingOrder ? '取消中...' : '取消订单'}
              </button>
            </div>
          </div>
        )}

        {/* ── Billing Mode Toggle ── */}
        {!loading && (
          <div className={styles.billingToggle}>
            <button
              className={`${styles.billingToggleBtn} ${billingTab === 'subscription' ? styles.billingToggleBtnActive : ''}`}
              onClick={() => setBillingTab('subscription')}
            >
              月包制
            </button>
            {(() => {
              const onetimeBlocked = ['onetime-normal', 'onetime-advanced', 'onetime-premium'].every(
                id => eligibility[id] && !eligibility[id].canPurchase
              )
              return (
                <button
                  className={`${styles.billingToggleBtn} ${billingTab === 'one_time' ? styles.billingToggleBtnActive : ''}`}
                  onClick={() => setBillingTab('one_time')}
                  title={onetimeBlocked ? '月包有效期内不可购买单次制' : ''}
                >
                  单次制{onetimeBlocked ? ' 🔒' : ''}
                </button>
              )
            })()}
          </div>
        )}

        {/* ── Plan Cards (shared layout) ── */}
        {!loading && activePlans.length > 0 && (
          <div className={`${styles.plansGrid} ${isOneTime ? styles.plansGrid3 : ''}`}>
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

                {(() => {
                  const isFree = plan.payMode === 0

                  if (isFree) {
                    const isCurrentFree = user && user.payMode === 0
                    return (
                      <Button
                        variant="secondary"
                        size="lg"
                        className={styles.purchaseBtn}
                        disabled
                      >
                        {isCurrentFree ? '当前套餐' : (user ? '免费版' : '注册即享')}
                      </Button>
                    )
                  }

                  const elig = eligibility[plan.id]
                  const disabled = purchasing === plan.id || (elig && !elig.canPurchase)
                  const isCurrent = elig?.isCurrent
                  const isUpgrade = elig?.isUpgrade

                  let label = '立即购买'
                  if (purchasing === plan.id) label = '正在跳转...'
                  else if (isCurrent) label = '当前套餐'
                  else if (elig && !elig.canPurchase) label = elig.reason || '不可购买'
                  else if (isUpgrade && elig?.upgradePrice != null) label = `升级 ¥${elig.upgradePrice.toFixed(2)}`

                  return (
                    <Button
                      variant={isCurrent ? 'secondary' : (plan.popular ? 'primary' : 'secondary')}
                      size="lg"
                      className={styles.purchaseBtn}
                      onClick={() => handlePurchase(plan.id)}
                      disabled={disabled}
                      title={elig?.reason || ''}
                    >
                      {label}
                    </Button>
                  )
                })()}
              </Card>
            ))}
          </div>
        )}

        {/* ── Available Models per Tier (subscription only, same for one-time) ── */}
        {!loading && subscriptionPlans.length > 0 && (
          <>
            <h2 className={styles.sectionHeading}>各套餐可用模型</h2>
            <div className={styles.modelGrid}>
              {subscriptionPlans.filter(plan => (plan.models || []).length > 0 && plan.payMode !== 0).map((plan) => (
                <div key={plan.id} className={styles.modelCard}>
                  <h3 className={styles.modelCardTitle}>
                    {planNameMap[plan.id] || plan.id}
                  </h3>
                  <ul className={styles.modelList}>
                    {sortModels(plan.models || []).map((m, i) => (
                      <li key={i} className={`${styles.modelItem} ${featuredModels.has(m) ? styles.modelItemFeatured : ''}`}>{m}</li>
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
            月包用户可随时升级更高套餐，剩余时间按比例折算为抵扣金额。
            月包有效期内不可购买单次制，套餐过期后可自由选择任意计划。
            单次付费模式在客户端激活后开始计时，不可暂停，到期后自动结束。
          </p>
        </section>
      </Container>
      <HomeFooter />
    </div>
  )
}

import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCodeStyling from 'qr-code-styling'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { useAuth } from '../lib/authContext'
import { api, type DashboardResponse } from '../lib/api'
import styles from './dashboardPage.module.css'

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

function getTimeUntil(target: string): string {
  const now = new Date()
  const targetDate = new Date(target)
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return '即将刷新'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}天 ${hours}小时`
  return `${hours}小时`
}

function getBarColor(ratio: number): string {
  if (ratio > 0.5) return 'var(--color-accent-success)'
  if (ratio > 0.2) return 'var(--color-accent-warning)'
  return 'var(--color-accent-error)'
}

const PAY_MODE_LABELS: Record<number, string> = { 0: '免费版', 1: '普通版', 2: '进阶版', 3: '高级版' }

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [giftActivating, setGiftActivating] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [redeemKey, setRedeemKey] = useState('')
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [redeemMessage, setRedeemMessage] = useState('')
  const [showRedeemSuccess, setShowRedeemSuccess] = useState(false)
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('')
  const [showQrModal, setShowQrModal] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const qrInstanceRef = useRef<QRCodeStyling | null>(null)

  const generateQr = useCallback((inviteCode: string) => {
    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'canvas',
      data: `https://lucencia.daedalustech.cn/register?invite=${inviteCode}`,
      image: '/lucencia-logo-hd.png',
      dotsOptions: {
        color: '#4a90d9',
        type: 'rounded',
      },
      cornersSquareOptions: {
        color: '#0066cc',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#0088ff',
        type: 'dot',
      },
      backgroundOptions: {
        color: '#0a0e1a',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 6,
        imageSize: 0.35,
      },
      qrOptions: {
        errorCorrectionLevel: 'Q',
      },
    })
    qrInstanceRef.current = qr
    return qr
  }, [])

  const openQrModal = useCallback((inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode).catch(() => {})
    const qr = generateQr(inviteCode)
    setShowQrModal(true)
    setTimeout(() => {
      if (qrRef.current) {
        qrRef.current.innerHTML = ''
        qr.append(qrRef.current)
      }
    }, 50)
  }, [generateQr])

  const saveQrImage = useCallback(() => {
    qrInstanceRef.current?.download({ name: 'lucencia-invite', extension: 'png' })
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate('/login?redirect=/dashboard')
      return
    }
    api.getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  if (authLoading || loading || !data) {
    return (
      <div className={styles.pageShell}>
        <HomeNavbar />
        <Container className={styles.page}>
          <div className={styles.loading}>加载中...</div>
        </Container>
        <HomeFooter />
      </div>
    )
  }

  const weeklyRemainingPoints = Math.max(0, data.weeklyQuota - data.weeklyUsedPoints)
  const weeklyRatio = data.weeklyQuota > 0 ? weeklyRemainingPoints / data.weeklyQuota : 0
  const monthlyRemainingPoints = Math.max(0, data.monthlyLimit - data.monthlyUsedPoints)
  const monthlyRatio = data.monthlyLimit > 0 ? monthlyRemainingPoints / data.monthlyLimit : 0
  const weeklyPercent = Math.max(0, Math.min(100, weeklyRatio * 100))
  const monthlyPercent = Math.max(0, Math.min(100, monthlyRatio * 100))
  const displayPayModeLabel = PAY_MODE_LABELS[data.payMode] || data.payModeLabel

  const isOneTime = data.billingType === 'one_time'
  const isSubscriptionExpired = !isOneTime && data.expiresAt && data.serverTime && new Date(data.serverTime) >= new Date(data.expiresAt)

  const onetimeTotal = data.currentPoints + data.weeklyUsedPoints
  const onetimeUsed = data.weeklyUsedPoints
  const onetimeRemaining = Math.max(0, data.currentPoints)
  const onetimeRatio = onetimeTotal > 0 ? onetimeRemaining / onetimeTotal : 0
  const onetimePercent = Math.max(0, Math.min(100, onetimeRatio * 100))

  function getSessionTimeLeft(): string {
    if (!data?.expiresAt) return '未激活'
    const now = new Date()
    const expires = new Date(data.expiresAt)
    const diff = expires.getTime() - now.getTime()
    if (diff <= 0) return '已过期'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `${hours}小时 ${mins}分钟`
    return `${mins}分钟`
  }

  async function handleActivateGift() {
    setGiftActivating(true)
    setGiftMessage('')
    try {
      const res = await api.activateGift()
      setGiftMessage(res.message || '激活成功')
      const refreshed = await api.getDashboard()
      setData(refreshed)
    } catch (err: any) {
      setGiftMessage(err?.message || '激活失败')
    } finally {
      setGiftActivating(false)
    }
  }

  async function handleRedeemKey() {
    if (!redeemKey.trim()) return
    setRedeemLoading(true)
    setRedeemMessage('')
    try {
      const res = await api.redeemGiftKey(redeemKey.trim())
      setRedeemSuccessMsg(res.message || '兑换成功')
      setShowRedeemSuccess(true)
      setRedeemKey('')
    } catch (err: any) {
      setRedeemMessage(err?.message || '兑换失败')
    } finally {
      setRedeemLoading(false)
    }
  }

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>工作台</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.username}</span>
            <Badge tone="accent">{displayPayModeLabel}{isOneTime ? ' · 单次' : ''}</Badge>
            {user?.expiresAt && (
              <span className={styles.expiresAt}>
                到期: {new Date(user.expiresAt).toLocaleDateString('zh-CN')}
              </span>
            )}
          </div>
        </header>

        <section className={styles.energySection}>
          {isSubscriptionExpired && (
            <div className={styles.expiredBanner}>
              您的订阅已到期，请续费以继续使用
            </div>
          )}
          <Card className={styles.energyCard}>
            <h2 className={styles.sectionTitle}>算力能量槽</h2>

            {isOneTime ? (
              <>
                {/* ── One-time session display ── */}
                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>算力余额</span>
                    <span className={styles.barPercent}>{onetimePercent.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack} style={{ '--bar-color': getBarColor(onetimeRatio) } as React.CSSProperties}>
                    <div className={styles.barFill} style={{ width: `${onetimePercent}%` }} />
                  </div>
                  <div className={styles.barTooltip}>
                    <span>剩余: {formatNumber(onetimeRemaining)} / {formatNumber(onetimeTotal)}</span>
                    <span className={styles.resetHint}>已消耗: {formatNumber(onetimeUsed)}</span>
                  </div>
                </div>

                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>剩余时间</span>
                  </div>
                  <div className={styles.barTooltip}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
                      {getSessionTimeLeft()}
                    </span>
                    {data.expiresAt && (
                      <span className={styles.resetHint}>
                        到期: {new Date(data.expiresAt).toLocaleString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── Subscription display ── */}
                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>周额度</span>
                    <span className={styles.barPercent}>{weeklyPercent.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack} style={{ '--bar-color': getBarColor(weeklyRatio) } as React.CSSProperties}>
                    <div className={styles.barFill} style={{ width: `${weeklyPercent}%` }} />
                  </div>
                  <div className={styles.barTooltip}>
                    <span>剩余: {formatNumber(weeklyRemainingPoints)} / {formatNumber(data.weeklyQuota)}</span>
                    <span className={styles.resetHint}>距下周刷新还有 {getTimeUntil(data.nextWeeklyReset)}</span>
                  </div>
                </div>

                <div className={styles.barGroup}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>月度总额度</span>
                    <span className={styles.barPercent}>{monthlyPercent.toFixed(1)}%</span>
                  </div>
                  <div className={styles.barTrack} style={{ '--bar-color': getBarColor(monthlyRatio) } as React.CSSProperties}>
                    <div className={`${styles.barFill} ${styles.barFillMonthly}`} style={{ width: `${monthlyPercent}%` }} />
                  </div>
                  <div className={styles.barTooltip}>
                    <span>剩余: {formatNumber(monthlyRemainingPoints)} / {formatNumber(data.monthlyLimit)}</span>
                    <span className={styles.resetHint}>距月度刷新还有 {getTimeUntil(data.nextMonthlyReset)}</span>
                  </div>
                </div>
              </>
            )}
          </Card>
        </section>

        {/* 赠送套餐 */}
        {(data.pendingGiftDays > 0 || data.giftActive) && (
          <section className={styles.giftSection}>
            <Card className={styles.giftCard}>
              <div className={styles.giftHeader}>
                <h2 className={styles.sectionTitle}>赠送套餐</h2>
              </div>
              {data.giftActive && data.giftExpiresAt ? (
                <div className={styles.giftActiveInfo}>
                  <Badge className={styles.giftBadgeActive}>进行中</Badge>
                  <p className={styles.giftDesc}>
                    赠送 {PAY_MODE_LABELS[data.pendingGiftPayMode] || '进阶版'} 正在生效中
                  </p>
                  <div className={styles.giftExpiry}>
                    到期时间：{new Date(data.giftExpiresAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </div>
                </div>
              ) : data.pendingGiftDays > 0 ? (
                <div className={styles.giftPendingInfo}>
                  <Badge className={styles.giftBadgePending}>待激活</Badge>
                  <p className={styles.giftDesc}>
                    您有 <strong>{data.pendingGiftDays} 天</strong> {PAY_MODE_LABELS[data.pendingGiftPayMode] || '进阶版'} 赠送套餐可以激活
                  </p>
                  <p className={styles.giftHint}>激活后立即开始计时，请选择合适时机使用</p>
                  {data.payMode === 1 && (
                    <p className={styles.giftHint}>原先普通版套餐会正常延后，如果遇到问题请及时联系客服。</p>
                  )}
                  <button
                    className={styles.giftActivateBtn}
                    disabled={giftActivating}
                    onClick={handleActivateGift}
                  >
                    {giftActivating ? '激活中...' : '立即激活'}
                  </button>
                  {giftMessage && <p className={styles.giftMsg}>{giftMessage}</p>}
                </div>
              ) : null}
            </Card>
          </section>
        )}

        {/* 兑换礼品码 */}
        <section className={styles.redeemSection}>
          <Card className={styles.redeemCard}>
            <h2 className={styles.sectionTitle}>兑换礼品码</h2>
            <p className={styles.redeemDesc}>输入礼品激活码，获取赠送套餐</p>
            <div className={styles.redeemGroup}>
              <input
                className={styles.redeemInput}
                type="text"
                placeholder="请输入礼品码 (GIFT-XXXX-XXXX)"
                value={redeemKey}
                onChange={e => setRedeemKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRedeemKey()}
              />
              <button
                className={styles.redeemBtn}
                disabled={redeemLoading || !redeemKey.trim()}
                onClick={handleRedeemKey}
              >
                {redeemLoading ? '兑换中...' : '兑换'}
              </button>
            </div>
            {redeemMessage && <p className={styles.redeemMsg}>{redeemMessage}</p>}
          </Card>
        </section>

        <section className={styles.actionsSection}>
          <Button variant="primary" className={styles.actionPrimaryBtn} onClick={() => navigate('/pricing')}>
            升级套餐
          </Button>
          <Button variant="secondary" className={styles.actionSecondaryBtn} onClick={() => navigate('/lucencia')}>
            下载桌面客户端
          </Button>
        </section>

        {user?.inviteCode && (
          <section className={styles.inviteSection}>
            <Card className={styles.inviteCard}>
              <h2 className={styles.sectionTitle}>邀请好友</h2>
              <p className={styles.inviteDesc}>分享您的邀请码。被邀请账号完成注册并在桌面客户端首次登录、上报设备指纹且通过风控后，双方才会获得赠送套餐奖励。</p>
              <div className={styles.inviteCodeGroup}>
                <div>
                  <div className={styles.inviteCodeLabel}>我的邀请码</div>
                  <div className={styles.inviteCodeText}>{user.inviteCode}</div>
                </div>
                <button
                  className={styles.copyBtn}
                  onClick={() => openQrModal(user.inviteCode)}
                >
                  复制 & 二维码
                </button>
              </div>
              <div className={styles.inviteRules}>
                <div className={styles.inviteRuleTitle}>邀请奖励说明</div>
                <ul>
                  <li>奖励不会在注册时立即发放，需被邀请人登录桌面客户端并完成设备校验后自动结算。</li>
                  <li>邀请人与被邀请人不能使用同一台设备或异常共享登录环境，否则双方邀请赠送权益会被撤回。</li>
                  <li>系统会持续检查邀请链路；批量小号、同设备、同 IP 等薅羊毛行为会导致被邀请账号冻结，严重时邀请人也会被冻结。</li>
                </ul>
              </div>
            </Card>
          </section>
        )}
      </Container>
      <HomeFooter />

      {/* 兑换成功 Modal */}
      {showRedeemSuccess && (
        <div className={styles.modalOverlay} onClick={() => { setShowRedeemSuccess(false); window.location.reload() }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>🎉</div>
            <h3 className={styles.modalTitle}>兑换成功</h3>
            <p className={styles.modalMessage}>{redeemSuccessMsg}</p>
            <button
              className={styles.modalConfirmBtn}
              onClick={() => { setShowRedeemSuccess(false); window.location.reload() }}
            >
              确认
            </button>
          </div>
        </div>
      )}
      {/* QR Code Modal */}
      {showQrModal && (
        <div className={styles.modalOverlay} onClick={() => setShowQrModal(false)}>
          <div className={styles.qrModalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.qrTitle}>扫码注册 · 自动填入邀请码</h3>
            <p className={styles.qrSubtitle}>邀请码已复制到剪贴板</p>
            <div className={styles.qrCanvas} ref={qrRef} />
            <div className={styles.qrActions}>
              <button className={styles.qrSaveBtn} onClick={saveQrImage}>保存图片</button>
              <button className={styles.qrCloseBtn} onClick={() => setShowQrModal(false)}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

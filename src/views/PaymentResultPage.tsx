import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { api } from '../lib/api'
import styles from './paymentResultPage.module.css'

type OrderStatus = 'loading' | 'paid' | 'pending' | 'timeout' | 'error'

const planNameMap: Record<string, string> = {
  normal: '普通版月包',
  advanced: '进阶版月包',
  premium: '高级版月包',
  'onetime-normal': '普通版单次',
  'onetime-advanced': '进阶版单次',
  'onetime-premium': '高级版单次',
}

export function PaymentResultPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // Alipay redirects with out_trade_no; our own return route uses orderNo
  const orderNo = searchParams.get('orderNo') || searchParams.get('out_trade_no') || ''
  const [status, setStatus] = useState<OrderStatus>('loading')
  const [planName, setPlanName] = useState('')
  const [amount, setAmount] = useState('')
  const [order, setOrder] = useState<{ billing_type?: string } | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!orderNo) {
      setStatus('error')
      return
    }

    let attempts = 0
    const maxAttempts = 60

    const poll = async () => {
      try {
        const data = await api.getPaymentStatus(orderNo)
        const order = data.order
        setPlanName(planNameMap[order.plan_id] || order.plan_id)
        setAmount(`¥${order.amount}`)
        setOrder(order)

        if (order.status === 'paid') {
          setStatus('paid')
          if (pollRef.current) clearInterval(pollRef.current)
        } else {
          setStatus('pending')
          attempts++
          if (attempts >= maxAttempts && pollRef.current) {
            clearInterval(pollRef.current)
            setStatus('timeout')
          }
        }
      } catch {
        if (attempts === 0) {
          setStatus('error')
          if (pollRef.current) clearInterval(pollRef.current)
        }
        attempts++
      }
    }

    poll()
    pollRef.current = setInterval(poll, 3000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [orderNo])

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <div className={styles.resultCard}>
          {status === 'loading' && (
            <div className={styles.statusBlock}>
              <div className={styles.spinner} />
              <h2 className={styles.statusTitle}>查询支付结果</h2>
            </div>
          )}

          {status === 'pending' && (
            <div className={styles.statusBlock}>
              <div className={styles.pendingIcon}>⏳</div>
              <h2 className={styles.statusTitle}>等待支付确认</h2>
              <p className={styles.statusDesc}>
                已完成支付？系统正在与支付宝同步，请稍候...
              </p>
              <span className={styles.orderNo}>{orderNo}</span>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  先去控制台看看
                </Button>
              </div>
            </div>
          )}

          {status === 'paid' && (
            <div className={styles.statusBlock}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.statusTitle}>支付成功</h2>
              <p className={styles.planInfo}>
                {planName} · {amount}
              </p>
              <p className={styles.statusDesc}>
                {order?.billing_type === 'one_time'
                  ? '套餐购买成功！请在客户端中激活会话后开始使用 🎉'
                  : '套餐已自动开通，祝你使用愉快 🎉'}
              </p>
              <div className={styles.actions}>
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  进入控制台
                </Button>
                <Button variant="secondary" onClick={() => navigate('/pricing')}>
                  返回定价页
                </Button>
              </div>
            </div>
          )}

          {status === 'timeout' && (
            <div className={styles.statusBlock}>
              <div className={styles.pendingIcon}>⏰</div>
              <h2 className={styles.statusTitle}>支付确认超时</h2>
              <p className={styles.statusDesc}>
                如果您已完成支付，请刷新页面重试或联系客服
              </p>
              <span className={styles.orderNo}>{orderNo}</span>
              <div className={styles.actions}>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  刷新页面
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  进入控制台
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className={styles.statusBlock}>
              <div className={styles.errorIcon}>✗</div>
              <h2 className={styles.statusTitle}>查询失败</h2>
              <p className={styles.statusDesc}>
                {orderNo ? `未找到订单 ${orderNo}，请确认已登录` : '缺少订单号参数'}
              </p>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => navigate('/pricing')}>
                  返回定价页
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
      <HomeFooter />
    </div>
  )
}

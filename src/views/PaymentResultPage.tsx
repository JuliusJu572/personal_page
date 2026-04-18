import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { HomeNavbar } from '../ui/HomeNavbar'
import { HomeFooter } from '../ui/HomeFooter'
import { api } from '../lib/api'
import styles from './paymentResultPage.module.css'

type OrderStatus = 'loading' | 'paid' | 'pending' | 'error'

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
  // Alipay redirects with out_trade_no; our own flow uses orderNo
  const orderNo = searchParams.get('orderNo') || searchParams.get('out_trade_no') || ''
  const [status, setStatus] = useState<OrderStatus>('loading')
  const [planName, setPlanName] = useState('')
  const [amount, setAmount] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!orderNo) {
      setStatus('error')
      return
    }

    let attempts = 0
    const maxAttempts = 30 // poll for ~60 seconds

    const poll = async () => {
      try {
        const data = await api.getPaymentStatus(orderNo)
        const order = data.order
        setPlanName(planNameMap[order.plan_id] || order.plan_id)
        setAmount(`¥${order.amount}`)

        if (order.status === 'paid') {
          setStatus('paid')
          if (pollRef.current) clearInterval(pollRef.current)
        } else {
          setStatus('pending')
          attempts++
          if (attempts >= maxAttempts && pollRef.current) {
            clearInterval(pollRef.current)
          }
        }
      } catch {
        setStatus('error')
        if (pollRef.current) clearInterval(pollRef.current)
      }
    }

    poll()
    pollRef.current = setInterval(poll, 2000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [orderNo])

  return (
    <div className={styles.pageShell}>
      <HomeNavbar />
      <Container className={styles.page}>
        <Card className={styles.resultCard}>
          {status === 'loading' && (
            <div className={styles.statusBlock}>
              <div className={styles.spinner} />
              <h2 className={styles.statusTitle}>查询支付结果...</h2>
            </div>
          )}

          {status === 'pending' && (
            <div className={styles.statusBlock}>
              <div className={styles.spinner} />
              <h2 className={styles.statusTitle}>等待支付确认中...</h2>
              <p className={styles.statusDesc}>
                订单号：{orderNo}
              </p>
              <p className={styles.statusDesc}>
                如果您已完成支付，请稍候片刻，系统正在确认...
              </p>
            </div>
          )}

          {status === 'paid' && (
            <div className={styles.statusBlock}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.statusTitle}>支付成功！</h2>
              <p className={styles.statusDesc}>
                {planName} · {amount}
              </p>
              <p className={styles.statusDesc}>
                套餐已自动开通，祝你使用愉快 🎉
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

          {status === 'error' && (
            <div className={styles.statusBlock}>
              <div className={styles.errorIcon}>✗</div>
              <h2 className={styles.statusTitle}>查询失败</h2>
              <p className={styles.statusDesc}>
                {orderNo ? `未找到订单 ${orderNo}，请检查是否已登录。` : '缺少订单号参数。'}
              </p>
              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => navigate('/pricing')}>
                  返回定价页
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Container>
      <HomeFooter />
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import styles from './notFoundPage.module.css'

export function NotFoundPage() {
  return (
    <Container>
      <div className={styles.wrap}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.desc}>页面不存在或已被移动。</p>
        <Link to="/">
          <Button>返回主页</Button>
        </Link>
      </div>
    </Container>
  )
}


import type { ReactNode } from 'react'
import styles from './container.module.css'

export function Container(props: { children: ReactNode; className?: string }) {
  return <div className={[styles.container, props.className].filter(Boolean).join(' ')}>{props.children}</div>
}


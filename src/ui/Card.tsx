import type { HTMLAttributes, ReactNode } from 'react'
import styles from './card.module.css'

export function Card(props: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const { className, ...rest } = props
  return <div {...rest} className={[styles.card, className].filter(Boolean).join(' ')} />
}


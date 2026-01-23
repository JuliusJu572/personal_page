import type { HTMLAttributes, ReactNode } from 'react'
import styles from './badge.module.css'

type Tone = 'neutral' | 'accent' | 'success' | 'warn'

export function Badge(props: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; children: ReactNode }) {
  const { tone = 'neutral', className, ...rest } = props
  return <span {...rest} className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')} />
}


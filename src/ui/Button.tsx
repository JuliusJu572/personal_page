import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    children: ReactNode
  },
) {
  const { variant = 'primary', className, ...rest } = props
  return (
    <button
      {...rest}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
    />
  )
}


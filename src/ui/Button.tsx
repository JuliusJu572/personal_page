import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: styles.small,
  md: '',
  lg: styles.large,
}

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: Size
    children: ReactNode
  },
) {
  const { variant = 'primary', size = 'md', className, ...rest } = props
  return (
    <button
      {...rest}
      className={[styles.button, styles[variant], sizeClass[size], className].filter(Boolean).join(' ')}
    />
  )
}


import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import styles from './card.module.css'

type CardVariant = 'default' | 'thin' | 'thick'

export function Card(
  props: Omit<HTMLMotionProps<'div'>, 'variant'> & {
    children: ReactNode
    variant?: CardVariant
  },
) {
  const { className, children, variant = 'default', ...rest } = props

  const variantClass = variant !== 'default' ? styles[variant] : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...rest}
      className={[styles.card, variantClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </motion.div>
  )
}


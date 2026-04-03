import styles from './lucenciaLogoText.module.css'

const CHARS = 'LUCENCIA'.split('')

const SPARK_POSITIONS = [
  { x: 8, y: 30, del: 0.1, dur: 2.0 },
  { x: 18, y: 55, del: 1.3, dur: 2.8 },
  { x: 26, y: 22, del: 0.6, dur: 2.4 },
  { x: 35, y: 48, del: 1.9, dur: 3.1 },
  { x: 44, y: 28, del: 0.3, dur: 2.2 },
  { x: 52, y: 58, del: 1.6, dur: 2.7 },
  { x: 60, y: 20, del: 0.9, dur: 2.5 },
  { x: 68, y: 45, del: 2.1, dur: 3.0 },
  { x: 76, y: 32, del: 0.5, dur: 2.3 },
  { x: 84, y: 52, del: 1.4, dur: 2.9 },
  { x: 92, y: 25, del: 1.0, dur: 2.6 },
  { x: 14, y: 40, del: 0.8, dur: 3.2 },
  { x: 48, y: 38, del: 1.7, dur: 2.1 },
  { x: 72, y: 60, del: 0.2, dur: 2.8 },
  { x: 88, y: 42, del: 1.1, dur: 2.5 },
]

export function LucenciaLogoText() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.charGlows}>
        {CHARS.map((ch, i) => (
          <span
            key={i}
            className={styles.charGlow}
            style={{
              '--charIdx': i,
              '--charDel': `${i * 0.12}s`,
            } as React.CSSProperties}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className={styles.glowCenter} />

      <div className={styles.sparkContainer}>
        {SPARK_POSITIONS.map((s, i) => (
          <div
            key={i}
            className={[styles.spark, i % 3 === 0 ? styles.sparkLarge : undefined].filter(Boolean).join(' ')}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--del': `${s.del}s`,
              '--dur': `${s.dur}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className={styles.scanline} />
      <div className={styles.noiseOverlay} />
    </div>
  )
}

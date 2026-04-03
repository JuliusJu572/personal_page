import styles from './lucenciaLogoText.module.css'

const SPARK_POSITIONS = [
  { x: 18, y: 35, del: 0.2, dur: 2.5 },
  { x: 32, y: 28, del: 1.1, dur: 3.0 },
  { x: 45, y: 42, del: 0.7, dur: 2.8 },
  { x: 52, y: 55, del: 1.8, dur: 2.2 },
  { x: 65, y: 33, del: 0.4, dur: 3.2 },
  { x: 75, y: 48, del: 1.5, dur: 2.6 },
  { x: 82, y: 38, del: 0.9, dur: 2.9 },
  { x: 38, y: 60, del: 2.1, dur: 2.4 },
  { x: 58, y: 25, del: 1.3, dur: 3.1 },
  { x: 28, y: 52, del: 0.5, dur: 2.7 },
  { x: 68, y: 58, del: 1.9, dur: 2.3 },
  { x: 48, y: 30, del: 0.3, dur: 3.3 },
]

const BEAMS = [
  { offset: '-4px', duration: '3s', delay: '0s' },
  { offset: '2px', duration: '3.5s', delay: '0.8s' },
  { offset: '-1px', duration: '4s', delay: '1.6s' },
  { offset: '5px', duration: '3.2s', delay: '2.4s' },
  { offset: '-3px', duration: '3.8s', delay: '0.4s' },
]

export function LucenciaLogoText() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.svgLayer}>
        <svg
          className={styles.textSvg}
          viewBox="0 0 600 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="300"
            y="62"
            textAnchor="middle"
            className={styles.mainText}
          >
            LUCENCIA
          </text>
        </svg>
      </div>

      <div className={styles.glowCenter} />

      <div className={styles.beamContainer}>
        {BEAMS.map((b, i) => (
          <div
            key={i}
            className={[styles.beam, i === 2 ? styles.beamWide : undefined].filter(Boolean).join(' ')}
            style={{
              '--offset': b.offset,
              '--duration': b.duration,
              '--delay': b.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className={styles.sparkContainer}>
        {SPARK_POSITIONS.map((s, i) => (
          <div
            key={i}
            className={[styles.spark, i % 4 === 0 ? styles.sparkLarge : undefined].filter(Boolean).join(' ')}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--del': `${s.del}s`,
              '--dur': `${s.dur}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}

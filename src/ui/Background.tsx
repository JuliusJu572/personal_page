import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Background.module.css'

interface GlowOrb {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

const glowOrbs: GlowOrb[] = [
  { id: 1, x: 15, y: 20, size: 500, color: 'var(--mesh-color-1)', delay: 0, duration: 20 },
  { id: 2, x: 85, y: 15, size: 450, color: 'var(--mesh-color-2)', delay: 2, duration: 25 },
  { id: 3, x: 50, y: 70, size: 550, color: 'var(--mesh-color-3)', delay: 4, duration: 22 },
  { id: 4, x: 20, y: 75, size: 400, color: 'var(--mesh-color-4)', delay: 1, duration: 18 },
  { id: 5, x: 75, y: 60, size: 480, color: 'var(--mesh-color-5)', delay: 3, duration: 24 },
]

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create subtle noise texture
    const createNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 8
        data[i] = noise
        data[i + 1] = noise
        data[i + 2] = noise
        data[i + 3] = 15
      }

      ctx.putImageData(imageData, 0, 0)
    }

    createNoise()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className={styles.background}>
      {/* Mesh Gradient Layer */}
      <div className={styles.meshGradient}>
        {glowOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className={styles.glowOrb}
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Noise Texture Layer */}
      <canvas ref={canvasRef} className={styles.noiseCanvas} />

      {/* Vignette Overlay */}
      <div className={styles.vignette} />
    </div>
  )
}

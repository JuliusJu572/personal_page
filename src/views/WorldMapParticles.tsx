import { useEffect, useRef, useCallback } from 'react'
import styles from './worldMapParticles.module.css'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  baseAlpha: number
  phase: number
  speed: number
  size: number
  colorType: number
}

const WORLD_MAP_POINTS: Array<[number, number]> = [
  [25,28],[26,27],[27,27],[28,28],[29,28],[30,29],[31,29],[32,30],[33,30],
  [24,29],[23,30],[22,31],[21,32],[20,33],[19,34],[18,35],[17,36],[16,37],
  [15,38],[14,39],[13,40],[12,41],[11,42],[10,43],[9,44],[8,45],[7,46],
  [34,31],[35,32],[36,33],[37,34],[38,35],[39,36],[40,37],[41,38],[42,39],
  [43,40],[44,41],[45,42],[46,43],[47,44],[48,45],[49,46],[50,47],[51,48],
  [52,47],[53,46],[54,45],[55,44],[56,43],[57,42],[58,41],[59,40],[60,39],
  [61,38],[62,37],[63,36],[64,35],[65,34],[66,33],[67,32],[68,31],[69,30],
  [70,29],[71,28],[72,27],[73,26],[74,25],[75,24],
  [22,33],[23,34],[24,35],[25,36],[26,37],[27,38],[28,39],[29,40],[30,41],
  [31,42],[32,43],[33,44],[34,45],[35,46],[36,47],[37,48],[38,49],[39,50],
  [40,51],[41,52],[42,53],[43,54],[44,55],[45,56],[46,57],[47,58],[48,59],
  [49,60],[50,61],[51,62],[52,63],[53,64],[54,65],[55,66],[56,67],[57,68],
  [58,67],[59,66],[60,65],[61,64],[62,63],[63,62],[64,61],[65,60],
  [18,45],[19,46],[20,47],[21,48],[22,49],[23,50],[24,51],[25,52],[26,53],
  [27,54],[28,55],[29,56],[30,57],[31,58],[32,59],[33,60],[34,61],[35,62],
  [12,55],[13,56],[14,57],[15,58],[16,59],[17,60],[18,61],[19,62],[20,63],
  [45,30],[46,31],[47,32],[48,33],[49,34],[50,35],[51,36],[52,37],[53,38],
  [54,39],[55,40],[56,41],[57,42],[58,43],[59,44],[60,45],[61,46],[62,47],
  [35,50],[36,51],[37,52],[38,53],[39,54],[40,55],[41,56],[42,57],[43,58],
  [78,35],[79,34],[80,33],[81,32],[82,31],[83,30],[84,29],[85,28],[86,27],
  [87,28],[88,29],[89,30],[90,31],[91,32],[92,33],[93,34],[94,35],
  [80,38],[81,39],[82,40],[83,41],[84,42],[85,43],[86,44],[87,45],[88,46],
  [82,48],[83,49],[84,50],[85,51],[86,52],[87,53],[88,54],
  [5,35],[6,36],[7,37],[8,38],[9,39],[10,40],[11,41],
  [3,38],[4,39],[5,40],[6,41],[7,42],[8,43],
  [75,50],[76,51],[77,52],[78,53],[79,54],[80,55],[81,56],[82,57],[83,58],
  [85,60],[86,61],[87,62],[88,63],[89,64],[90,65],
]

const COLORS = [
  'rgba(0,114,227,',
  'rgba(90,200,250,',
  'rgba(100,180,255,',
  'rgba(0,150,255,',
  'rgba(255,255,255,',
]

function generateParticles(width: number, height: number, density: number = 1): Particle[] {
  const particles: Particle[] = []
  const scaleX = width / 100
  const scaleY = height / 100

  for (const [px, py] of WORLD_MAP_POINTS) {
    const baseCount = Math.max(1, Math.floor(3 * density))
    for (let i = 0; i < baseCount; i++) {
      const offsetX = (Math.random() - 0.5) * 4 * density
      const offsetY = (Math.random() - 0.5) * 4 * density
      particles.push({
        x: px * scaleX + offsetX,
        y: py * scaleY + offsetY,
        baseX: px * scaleX + offsetX,
        baseY: py * scaleY + offsetY,
        baseAlpha: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        size: 0.8 + Math.random() * 1.8,
        colorType: Math.random() < 0.08 ? 4 : Math.floor(Math.random() * 4),
      })
    }
  }

  for (let i = 0; i < Math.floor(80 * density); i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      baseAlpha: 0.05 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8,
      size: 0.5 + Math.random() * 1,
      colorType: Math.floor(Math.random() * 3),
    })
  }

  return particles
}

export function WorldMapParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const visibleRef = useRef(true)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !visibleRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width * dpr
    const h = rect.height * dpr

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      ctx.scale(dpr, dpr)

      const isMobile = window.innerWidth < 768
      particlesRef.current = generateParticles(rect.width, rect.height, isMobile ? 0.5 : 1)
    }

    ctx.clearRect(0, 0, rect.width, rect.height)

    const time = Date.now() * 0.001
    const particles = particlesRef.current

    for (const p of particles) {
      const floatX = Math.sin(time * p.speed + p.phase) * 1.5
      const floatY = Math.cos(time * p.speed * 0.7 + p.phase) * 1.5
      p.x = p.baseX + floatX
      p.y = p.baseY + floatY

      let alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(time * p.speed * 1.3 + p.phase))

      if (p.colorType === 4 && Math.sin(time * 2 + p.phase * 3) > 0.7) {
        alpha = Math.min(1, alpha * 2.5)
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = COLORS[p.colorType] + alpha.toFixed(3) + ')'
      ctx.fill()
    }

    ctx.strokeStyle = 'rgba(0,114,227,0.03)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < particles.length; i += 3) {
      const p1 = particles[i]
      for (let j = i + 1; j < Math.min(i + 6, particles.length); j += 2) {
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = dx * dx + dy * dy
        if (dist < 900 && dist > 25) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    visibleRef.current = true
    animFrameRef.current = requestAnimationFrame(draw)

    const onVisibility = () => { visibleRef.current = !document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [draw])

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}

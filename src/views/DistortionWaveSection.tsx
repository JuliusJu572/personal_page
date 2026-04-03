import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import styles from './distortionWaveSection.module.css'

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.05
    mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.05

    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.05 + mouseRef.current.y * 0.15
    meshRef.current.rotation.y = Math.cos(t * 0.2) * 0.03 + mouseRef.current.x * 0.15

    targetRef.current.x = state.mouse.x
    targetRef.current.y = state.mouse.y
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[25, 5, 128, 128]} />
      <MeshDistortMaterial
        color="#0052cc"
        speed={1.5}
        distort={0.28}
        radius={1}
        transparent
        opacity={0.5}
        wireframe={false}
      />
    </mesh>
  )
}

function MouseTracker() {
  const { viewport } = useThree()
  useFrame(({ pointer }) => {
    ;(window as any).__mouseX = pointer.x * viewport.width
    ;(window as any).__mouseY = pointer.y * viewport.height
  })
  return null
}

export function DistortionWaveSection() {
  const overlayStyle = useMemo(() => ({ '--mx': '0px', '--my': '0px' } as Record<string, string>), [])

  return (
    <section className={styles.section}>
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
          onPointerMove={(e) => {
            overlayStyle['--mx'] = `${(e.clientX / window.innerWidth - 0.5) * 30}px`
            overlayStyle['--my'] = `${(e.clientY / window.innerHeight - 0.5) * 15}px`
          }}
        >
          <ambientLight intensity={0.4} />
          <MouseTracker />
          <WaveMesh />
        </Canvas>
      </div>
      <div className={styles.overlayText} style={overlayStyle}>LUCENCIA</div>
    </section>
  )
}

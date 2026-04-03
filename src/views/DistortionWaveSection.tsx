import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import styles from './distortionWaveSection.module.css'

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.05
    meshRef.current.rotation.y = Math.cos(t * 0.2) * 0.03

    const mat = meshRef.current.material
    if (mat) {
      mouseRef.current.x += ((state.mouse.x - mouseRef.current.x) * 0.05)
      mouseRef.current.y += ((state.mouse.y - mouseRef.current.y) * 0.05)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 4, 128, 128]} />
      <MeshDistortMaterial
        color="#0052cc"
        speed={1.2}
        distort={0.22}
        radius={1}
        transparent
        opacity={0.45}
        wireframe={false}
      />
    </mesh>
  )
}

export function DistortionWaveSection() {
  return (
    <section className={styles.section}>
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <WaveMesh />
        </Canvas>
      </div>
      <div className={styles.overlayText}>LUCENCIA</div>
    </section>
  )
}


import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function ArduinoUno() {
  return (
    <group position={[0, 0.12, 0]}>
      {/* Green PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.13, 3.2]} />
        <meshStandardMaterial color="#08794f" roughness={0.55} />
      </mesh>

      {/* USB connector */}
      <mesh position={[-2.48, 0.18, 0.45]}>
        <boxGeometry args={[0.65, 0.32, 0.65]} />
        <meshStandardMaterial color="#aeb7c2" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* DC power jack */}
      <mesh position={[-2.45, 0.22, -0.65]}>
        <boxGeometry args={[0.55, 0.38, 0.65]} />
        <meshStandardMaterial color="#171b20" roughness={0.7} />
      </mesh>

      {/* Main ATmega328P chip */}
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[1.25, 0.25, 0.9]} />
        <meshStandardMaterial color="#17191c" roughness={0.4} />
      </mesh>

      {/* Secondary chip */}
      <mesh position={[1.35, 0.2, 0.35]}>
        <boxGeometry args={[0.65, 0.18, 0.5]} />
        <meshStandardMaterial color="#20252b" />
      </mesh>

      {/* Digital pin headers */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={`d-${i}`} position={[-1.55 + i * 0.235, 0.19, -1.35]}>
          <boxGeometry args={[0.09, 0.22, 0.09]} />
          <meshStandardMaterial color="#d5d9dc" metalness={0.8} />
        </mesh>
      ))}

      {/* Power and analog headers */}
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={`p-${i}`} position={[-1.4 + i * 0.235, 0.19, 1.35]}>
          <boxGeometry args={[0.09, 0.22, 0.09]} />
          <meshStandardMaterial color="#d5d9dc" metalness={0.8} />
        </mesh>
      ))}

      {/* Mounting holes */}
      {[
        [-2.1, -1.25], [2.1, -1.25],
        [-2.1, 1.25], [2.1, 1.25]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
          <meshStandardMaterial color="#202b2b" />
        </mesh>
      ))}
    </group>
  )
}

function Breadboard3D() {
  return (
    <group position={[0, 0, 3.1]}>
      <mesh receiveShadow>
        <boxGeometry args={[5.8, 0.22, 2.5]} />
        <meshStandardMaterial color="#e8ebed" roughness={0.65} />
      </mesh>

      {/* Terminal holes */}
      {Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 25 }, (_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-2.65 + col * 0.22, 0.12, -0.85 + row * 0.19]}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.025, 12]} />
            <meshStandardMaterial color="#303943" />
          </mesh>
        ))
      )}

      {/* Center channel */}
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[5.4, 0.015, 0.13]} />
        <meshStandardMaterial color="#aab1b7" />
      </mesh>
    </group>
  )
}

export default function Simulation3DScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '520px' }}>
      <Canvas
        shadows
        camera={{ position: [7, 7, 8], fov: 42 }}
      >
        <color attach="background" args={['#0b111b']} />

        <ambientLight intensity={1.1} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={2}
          castShadow
        />

        <ArduinoUno />
        <Breadboard3D />

        <gridHelper
          args={[16, 32, '#26394c', '#182738']}
          position={[0, -0.2, 0]}
        />

        <OrbitControls
          makeDefault
          enableDamping
          minDistance={5}
          maxDistance={18}
          target={[0, 0, 1]}
        />
      </Canvas>
    </div>
  )
}

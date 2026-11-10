
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

// ==========================================
// COMMON 3D PARTS
// ==========================================

const metal = '#b9c2cc'
const dark = '#202832'
const pcbGreen = '#087b52'

function Pin({ position, rotation = [0, 0, 0], length = 0.45 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.025, 0.025, length, 16]} />
      <meshStandardMaterial
        color={metal}
        metalness={0.85}
        roughness={0.25}
      />
    </mesh>
  )
}

function Box({ position = [0, 0, 0], size = [1, 1, 1], color = dark }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  )
}

function Cylinder({ position = [0, 0, 0], radius = 0.2, height = 0.5, color = metal }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius, radius, height, 40]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.3} />
    </mesh>
  )
}

// ==========================================
// 1. PASSIVE COMPONENTS
// ==========================================

function Resistor() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <Cylinder radius={0.19} height={0.9} color="#d6ad79" />

      {[-0.3, -0.1, 0.1, 0.3].map((p, i) => (
        <Cylinder
          key={i}
          position={[0, p, 0]}
          radius={0.198}
          height={0.055}
          color={['#8b4513', '#171717', '#c0392b', '#d4af37'][i]}
        />
      ))}

      <Pin position={[0, -0.8, 0]} length={0.7} />
      <Pin position={[0, 0.8, 0]} length={0.7} />
    </group>
  )
}

function Capacitor({ type = 'electrolytic' }) {
  if (type === 'ceramic') {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#d9a94c" />
        </mesh>
        <Pin position={[-0.1, -0.48, 0]} />
        <Pin position={[0.1, -0.48, 0]} />
      </group>
    )
  }

  if (type === 'smd') {
    return (
      <group>
        <Box size={[0.65, 0.18, 0.35]} color="#b5a16b" />
        <Box position={[-0.34, 0, 0]} size={[0.08, 0.2, 0.36]} color={metal} />
        <Box position={[0.34, 0, 0]} size={[0.08, 0.2, 0.36]} color={metal} />
      </group>
    )
  }

  return (
    <group>
      <Cylinder radius={0.3} height={0.8} color="#243e60" />
      <Cylinder position={[0, 0.41, 0]} radius={0.3} height={0.04} color={metal} />
      <Box position={[0, 0.05, 0.305]} size={[0.12, 0.65, 0.015]} color="#d8dce0" />
      <Pin position={[-0.12, -0.68, 0]} />
      <Pin position={[0.12, -0.68, 0]} />
    </group>
  )
}

function Inductor() {
  return (
    <group>
      <Cylinder radius={0.18} height={0.85} color="#493a2d" />
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, -0.34 + i * 0.095, 0]}>
          <torusGeometry args={[0.21, 0.035, 12, 32]} />
          <meshStandardMaterial color="#c87532" metalness={0.8} />
        </mesh>
      ))}
      <Pin position={[0, -0.75, 0]} />
      <Pin position={[0, 0.75, 0]} />
    </group>
  )
}

function Transformer() {
  return (
    <group>
      <Box size={[0.95, 0.7, 0.8]} color="#252c35" />
      <Box position={[0, 0.37, 0]} size={[1.05, 0.08, 0.9]} color="#b77936" />
      <Box position={[0, 0.43, 0]} size={[0.3, 0.12, 0.35]} color="#d2a45c" />

      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <Pin key={i} position={[x, -0.6, 0.2]} />
      ))}
    </group>
  )
}

function Crystal() {
  return (
    <group>
      <Box size={[0.65, 0.24, 0.32]} color="#b9c1c8" />
      <Box position={[0, 0.13, 0]} size={[0.58, 0.035, 0.28]} color="#e0e4e8" />
      <Pin position={[-0.18, -0.42, 0]} />
      <Pin position={[0.18, -0.42, 0]} />
    </group>
  )
}

// ==========================================
// 2. SEMICONDUCTOR DEVICES
// ==========================================

function AxialDiode({ led = false, zener = false }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <Cylinder radius={0.15} height={0.55} color={led ? '#d83232' : '#22272d'} />
      <Cylinder position={[0, 0.22, 0]} radius={0.155} height={0.055} color={zener ? '#d4af37' : metal} />

      {led && (
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.17, 32, 32]} />
          <meshStandardMaterial
            color="#ff3030"
            emissive="#9e1010"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      <Pin position={[0, -0.62, 0]} length={0.7} />
      <Pin position={[0, 0.62, 0]} length={0.7} />
    </group>
  )
}

function TO220({ color = '#20252b', pins = 3 }) {
  return (
    <group>
      <Box position={[0, 0.05, 0]} size={[0.55, 0.7, 0.18]} color={color} />
      <Box position={[0, 0.49, 0]} size={[0.48, 0.35, 0.08]} color="#aeb6bf" />

      <mesh position={[0, 0.52, 0.05]}>
        <cylinderGeometry args={[0.085, 0.085, 0.1, 32]} />
        <meshStandardMaterial color="#29313b" />
      </mesh>

      {Array.from({ length: pins }).map((_, i) => (
        <Pin
          key={i}
          position={[(i - (pins - 1) / 2) * 0.19, -0.48, 0]}
          length={0.5}
        />
      ))}
    </group>
  )
}

function TO92() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#17191d" />
      </mesh>
      <Box position={[0, -0.12, 0.18]} size={[0.38, 0.3, 0.08]} color="#17191d" />
      {[-0.15, 0, 0.15].map((x, i) => (
        <Pin key={i} position={[x, -0.48, 0]} />
      ))}
    </group>
  )
}

function PowerDiode() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <Cylinder radius={0.25} height={0.65} color="#252b32" />
      <Cylinder position={[0, 0.28, 0]} radius={0.255} height={0.06} color={metal} />
      <Pin position={[0, -0.65, 0]} length={0.7} />
      <Pin position={[0, 0.65, 0]} length={0.7} />
    </group>
  )
}

// ==========================================
// 3. ANALOG AND DIGITAL ICs
// ==========================================

function DIP({ pinCount = 8, color = '#171b21' }) {
  const perSide = pinCount / 2

  return (
    <group>
      <Box size={[Math.max(0.7, perSide * 0.17), 0.23, 0.62]} color={color} />

      <mesh position={[-0.22, 0.125, -0.18]}>
        <torusGeometry args={[0.045, 0.018, 8, 24]} />
        <meshStandardMaterial color="#d5d9df" />
      </mesh>

      {Array.from({ length: perSide }).map((_, i) => {
        const x = (i - (perSide - 1) / 2) * 0.17

        return (
          <group key={i}>
            <Pin position={[x, -0.27, -0.4]} length={0.28} />
            <Pin position={[x, -0.27, 0.4]} length={0.28} />
          </group>
        )
      })}
    </group>
  )
}

function SMDIC() {
  return (
    <group>
      <Box size={[0.75, 0.13, 0.48]} color="#171b21" />
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i}>
          <Box position={[-0.43, -0.015, -0.18 + i * 0.05]} size={[0.18, 0.07, 0.025]} color={metal} />
          <Box position={[0.43, -0.015, -0.18 + i * 0.05]} size={[0.18, 0.07, 0.025]} color={metal} />
        </group>
      ))}
    </group>
  )
}

// ==========================================
// 4. SENSORS
// ==========================================

function Ultrasonic() {
  return (
    <group>
      <Box size={[1.1, 0.1, 0.75]} color="#087b52" />

      {[-0.28, 0.28].map((x, i) => (
        <group key={i} position={[x, 0.18, 0]}>
          <Cylinder radius={0.19} height={0.22} color="#aeb9c4" />
          <Cylinder position={[0, 0.13, 0]} radius={0.14} height={0.035} color="#263746" />
        </group>
      ))}

      {[-0.36, -0.12, 0.12, 0.36].map((x, i) => (
        <Pin key={i} position={[x, -0.34, 0.3]} />
      ))}
    </group>
  )
}

function PIRSensor() {
  return (
    <group>
      <Box size={[0.8, 0.12, 0.65]} color="#087b52" />
      <mesh position={[0, 0.27, 0]}>
        <sphereGeometry args={[0.27, 32, 24]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.25} />
      </mesh>
      <Pin position={[-0.2, -0.32, 0.2]} />
      <Pin position={[0, -0.32, 0.2]} />
      <Pin position={[0.2, -0.32, 0.2]} />
    </group>
  )
}

function TemperatureSensor() {
  return (
    <group>
      <Cylinder radius={0.19} height={0.55} color="#333a43" />
      <Cylinder position={[0, 0.3, 0]} radius={0.19} height={0.08} color={metal} />
      <Pin position={[-0.1, -0.5, 0]} />
      <Pin position={[0.1, -0.5, 0]} />
    </group>
  )
}

function GenericSensor() {
  return (
    <group>
      <Box size={[0.9, 0.1, 0.65]} color={pcbGreen} />
      <Box position={[0, 0.13, 0]} size={[0.35, 0.17, 0.3]} color="#20252b" />
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <Pin key={i} position={[x, -0.3, 0.28]} />
      ))}
    </group>
  )
}

// ==========================================
// 5. ELECTROMECHANICAL COMPONENTS
// ==========================================

function Relay() {
  return (
    <group>
      <Box size={[0.95, 0.58, 0.75]} color="#263747" />
      <Box position={[0, 0.31, 0]} size={[0.85, 0.04, 0.65]} color="#52677b" />

      {[-0.3, 0, 0.3].map((x, i) => (
        <Pin key={i} position={[x, -0.52, 0.2]} />
      ))}
      {[-0.2, 0.2].map((x, i) => (
        <Pin key={i} position={[x, -0.52, -0.2]} />
      ))}
    </group>
  )
}

function Motor() {
  return (
    <group>
      <Cylinder radius={0.32} height={0.85} color="#aeb7c0" />
      <Cylinder position={[0, 0.52, 0]} radius={0.055} height={0.55} color={metal} />
      <Pin position={[-0.18, -0.52, 0]} />
      <Pin position={[0.18, -0.52, 0]} />
    </group>
  )
}

function Buzzer() {
  return (
    <group>
      <Cylinder radius={0.32} height={0.3} color="#22272e" />
      <Cylinder position={[0, 0.16, 0]} radius={0.27} height={0.025} color="#101820" />
      <Pin position={[-0.12, -0.42, 0]} />
      <Pin position={[0.12, -0.42, 0]} />
    </group>
  )
}

// ==========================================
// 6. DISPLAYS
// ==========================================

function LCD() {
  return (
    <group>
      <Box size={[1.3, 0.7, 0.12]} color="#263747" />
      <Box position={[0, 0.02, 0.075]} size={[1.05, 0.4, 0.025]} color="#477d69" />
      <Box position={[0, 0.02, 0.095]} size={[0.85, 0.27, 0.01]} color="#183d34" />

      {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
        <Pin key={i} position={[x, -0.48, 0]} />
      ))}
    </group>
  )
}

function SevenSegment() {
  return (
    <group>
      <Box size={[0.7, 0.85, 0.16]} color="#252a31" />
      <Box position={[0, 0, 0.09]} size={[0.48, 0.62, 0.02]} color="#351719" />

      {[
        [0, 0.23, 0.11, 0.3, 0.035],
        [0, 0, 0.11, 0.035, 0.25],
        [0, -0.23, 0.11, 0.3, 0.035],
        [-0.17, 0.12, 0.11, 0.035, 0.22],
        [0.17, 0.12, 0.11, 0.035, 0.22],
        [-0.17, -0.12, 0.11, 0.035, 0.22],
        [0.17, -0.12, 0.11, 0.035, 0.22]
      ].map((p, i) => (
        <Box key={i} position={p.slice(0, 3)} size={p.slice(3)} color="#e23a32" />
      ))}
    </group>
  )
}

// ==========================================
// 7. EMBEDDED BOARDS
// ==========================================

function ArduinoUno() {
  return (
    <group>
      <Box size={[1.8, 0.09, 1.25]} color="#087b52" />

      <Box position={[-0.55, 0.1, 0]} size={[0.35, 0.17, 0.55]} color="#171b21" />
      <Box position={[0.1, 0.1, 0]} size={[0.55, 0.18, 0.55]} color="#20252b" />
      <Box position={[0.68, 0.1, 0]} size={[0.35, 0.17, 0.45]} color="#171b21" />

      <Box position={[-0.78, 0.08, -0.5]} size={[0.3, 0.16, 0.25]} color={metal} />
      <Box position={[0.75, 0.08, 0.5]} size={[0.3, 0.16, 0.25]} color="#20252b" />

      {Array.from({ length: 14 }).map((_, i) => (
        <Cylinder
          key={i}
          position={[-0.65 + i * 0.1, 0.09, 0.56]}
          radius={0.025}
          height={0.04}
          color="#d6b34b"
        />
      ))}
    </group>
  )
}

function ESP32Board() {
  return (
    <group>
      <Box size={[1.55, 0.08, 0.8]} color="#087b52" />
      <Box position={[0, 0.12, 0]} size={[0.6, 0.15, 0.5]} color="#20252b" />
      <Box position={[0, 0.12, -0.27]} size={[0.5, 0.13, 0.08]} color={metal} />
      <Box position={[-0.55, 0.09, 0]} size={[0.2, 0.14, 0.28]} color="#b7c0ca" />

      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i}>
          <Cylinder position={[-0.65 + i * 0.09, 0.08, 0.34]} radius={0.025} height={0.04} color="#d6b34b" />
          <Cylinder position={[-0.65 + i * 0.09, 0.08, -0.34]} radius={0.025} height={0.04} color="#d6b34b" />
        </group>
      ))}
    </group>
  )
}

function STM32Board() {
  return (
    <group>
      <Box size={[1.75, 0.08, 1]} color="#087b52" />
      <Box position={[0, 0.11, 0]} size={[0.55, 0.15, 0.5]} color="#171b21" />
      <Box position={[-0.55, 0.1, 0]} size={[0.25, 0.15, 0.4]} color="#b5bdc5" />
      <Box position={[0.65, 0.1, 0]} size={[0.25, 0.15, 0.4]} color="#20252b" />

      {Array.from({ length: 12 }).map((_, i) => (
        <group key={i}>
          <Cylinder position={[-0.55 + i * 0.1, 0.08, 0.43]} radius={0.025} height={0.04} color="#d6b34b" />
          <Cylinder position={[-0.55 + i * 0.1, 0.08, -0.43]} radius={0.025} height={0.04} color="#d6b34b" />
        </group>
      ))}
    </group>
  )
}

function RaspberryPi() {
  return (
    <group>
      <Box size={[1.7, 0.08, 1.25]} color="#087b52" />
      <Box position={[0, 0.12, 0]} size={[0.6, 0.15, 0.55]} color="#20252b" />
      <Box position={[-0.65, 0.1, 0.25]} size={[0.25, 0.15, 0.35]} color={metal} />
      <Box position={[0.65, 0.1, 0.25]} size={[0.25, 0.15, 0.35]} color={metal} />
      <Box position={[0.65, 0.1, -0.25]} size={[0.25, 0.15, 0.35]} color={metal} />
    </group>
  )
}

function GenericBoard() {
  return (
    <group>
      <Box size={[1.3, 0.08, 0.85]} color={pcbGreen} />
      <Box position={[0, 0.1, 0]} size={[0.45, 0.15, 0.4]} color="#20252b" />
      <Box position={[-0.48, 0.09, 0]} size={[0.22, 0.12, 0.25]} color={metal} />

      {Array.from({ length: 8 }).map((_, i) => (
        <Cylinder
          key={i}
          position={[-0.5 + i * 0.14, 0.08, 0.36]}
          radius={0.025}
          height={0.035}
          color="#d6b34b"
        />
      ))}
    </group>
  )
}

// ==========================================
// 8. CONNECTORS AND PROTECTION
// ==========================================

function Connector() {
  return (
    <group>
      <Box size={[0.85, 0.4, 0.48]} color="#303b48" />
      {[-0.25, 0, 0.25].map((x, i) => (
        <Cylinder key={i} position={[x, 0, 0.25]} radius={0.07} height={0.12} color="#c8a34a" />
      ))}
    </group>
  )
}

function Fuse() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <Cylinder radius={0.15} height={0.75} color="#d8dce0" />
      <Pin position={[0, -0.65, 0]} />
      <Pin position={[0, 0.65, 0]} />
    </group>
  )
}

// ==========================================
// 9. MEASUREMENT INSTRUMENTS
// ==========================================

function Instrument() {
  return (
    <group>
      <Box size={[1, 0.8, 0.3]} color="#303b48" />
      <Box position={[0, 0.1, 0.17]} size={[0.65, 0.3, 0.03]} color="#163b48" />

      <Cylinder position={[-0.25, -0.23, 0.18]} radius={0.07} height={0.06} color="#d5d9df" />
      <Cylinder position={[0.25, -0.23, 0.18]} radius={0.07} height={0.06} color="#d5d9df" />
    </group>
  )
}

// ==========================================
// 10. COMMUNICATION COMPONENTS
// ==========================================

function Antenna() {
  return (
    <group>
      <Cylinder position={[0, -0.25, 0]} radius={0.2} height={0.2} color="#263747" />
      <Cylinder position={[0, 0.35, 0]} radius={0.035} height={1.1} color= {metal} />
      <Cylinder position={[0, 0.9, 0]} radius={0.055} height={0.1} color="#303b48" />
    </group>
  )
}

function RFModule() {
  return (
    <group>
      <Box size={[1.1, 0.08, 0.65]} color={pcbGreen} />
      <Box position={[0, 0.12, 0]} size={[0.4, 0.17, 0.35]} color="#20252b" />
      <Antenna />
    </group>
  )
}

// ==========================================
// COMPONENT MODEL SELECTOR
// ==========================================

function chooseModel(name = '') {
  const n = name.toLowerCase()

  // Passive components
  if (n.includes('resistor')) return <Resistor />

  if (n.includes('capacitor')) {
    if (n.includes('ceramic')) return <Capacitor type="ceramic" />
    if (n.includes('smd')) return <Capacitor type="smd" />
    return <Capacitor />
  }

  if (n.includes('crystal oscillator')) return <Crystal />
  if (n.includes('transformer')) return <Transformer />
  if (n.includes('inductor') || n.includes('ferrite bead')) return <Inductor />

  // Semiconductor devices
  if (n.includes('led')) return <AxialDiode led />
  if (n.includes('zener')) return <AxialDiode zener />
  if (n.includes('diode') || n.includes('rectifier') || n.includes('tvs')) return <PowerDiode />

  if (n.includes('mosfet') || n.includes('igbt')) return <TO220 />
  if (n.includes('jfet')) return <TO92 />
  if (n.includes('bjt') || n.includes('transistor')) return <TO92 />
  if (n.includes('thyristor') || n.includes('triac')) return <TO220 />

  // Analog ICs
  if (n.includes('amplifier') || n.includes('op-amp') ||
      n.includes('comparator') || n.includes('555') ||
      n.includes('timer') || n.includes('analog switch') ||
      n.includes('voltage regulator')) {
    return <DIP pinCount={8} />
  }

  // Digital ICs
  if (n.includes('logic gate') || n.includes('flip-flop') ||
      n.includes('counter') || n.includes('multiplexer') ||
      n.includes('decoder') || n.includes('shift register')) {
    return <DIP pinCount={14} />
  }

  if (n.includes('microprocessor') || n.includes('memory')) {
    return <SMDIC />
  }

  // Sensors
  if (n.includes('ultrasonic')) return <Ultrasonic />
  if (n.includes('pir') || n.includes('motion')) return <PIRSensor />
  if (n.includes('temperature')) return <TemperatureSensor />
  if (n.includes('sensor') || n.includes('transducer')) return <GenericSensor />

  // Electromechanical
  if (n.includes('relay')) return <Relay />
  if (n.includes('buzzer')) return <Buzzer />
  if (n.includes('motor') || n.includes('fan') || n.includes('solenoid')) return <Motor />

  // Displays
  if (n.includes('seven segment')) return <SevenSegment />
  if (n.includes('lcd') || n.includes('oled') || n.includes('display')) return <LCD />

  // Embedded boards
  if (n.includes('arduino uno')) return <ArduinoUno />
  if (n.includes('esp32')) return <ESP32Board />
  if (n.includes('stm32') || n.includes('nucleo')) return <STM32Board />
  if (n.includes('raspberry')) return <RaspberryPi />
  if (n.includes('arduino') || n.includes('development board')) return <ArduinoUno />
  if (n.includes('interface module')) return <GenericBoard />

  // Communication modules
  if (n.includes('antenna')) return <Antenna />
  if (n.includes('wifi') || n.includes('wi-fi') ||
      n.includes('bluetooth') || n.includes('gps') ||
      n.includes('gsm') || n.includes('lora') ||
      n.includes('rf module') || n.includes('transceiver')) {
    return <RFModule />
  }

  // Power electronics
  if (n.includes('converter') || n.includes('inverter') ||
      n.includes('power module') || n.includes('battery management')) {
    return <GenericBoard />
  }

  // Connectors and protection
  if (n.includes('fuse')) return <Fuse />
  if (n.includes('connector') || n.includes('terminal block') ||
      n.includes('circuit breaker') || n.includes('varistor') ||
      n.includes('esd protection')) {
    return <Connector />
  }

  // Measurement instruments
  if (n.includes('multimeter') || n.includes('oscilloscope') ||
      n.includes('generator') || n.includes('power supply') ||
      n.includes('lcr meter') || n.includes('logic analyzer')) {
    return <Instrument />
  }

  return <GenericBoard />
}

// ==========================================
// 3D VIEWER + CAMERA CONTROLS
// ==========================================

export default function ComponentViewer({ componentName = 'Resistor' }) {
  const controlsRef = useRef(null)

  const resetView = () => {
    controlsRef.current?.reset()
  }

  const openFullscreen = () => {
    const viewer = document.getElementById('yantrava-3d-viewer')

    if (viewer?.requestFullscreen) {
      viewer.requestFullscreen()
    }
  }

  return (
    <div
      className="viewer"
      id="yantrava-3d-viewer"
      onDoubleClick={resetView}
    >
      <div className="viewer-toolbar">
        <button type="button" onClick={resetView}>
          Reset View
        </button>

        <button type="button" onClick={openFullscreen}>
          Fullscreen
        </button>
      </div>

      <Canvas
        camera={{
          position: [3, 2.5, 3.5],
          fov: 42
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#edf1f5']} />

        <Stage
          environment="city"
          intensity={0.8}
          adjustCamera={1.3}
        >
          {chooseModel(componentName)}
        </Stage>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableRotate
          enableZoom
          enablePan
          enableDamping
          dampingFactor={0.08}
          minDistance={1.5}
          maxDistance={10}
          rotateSpeed={0.8}
          zoomSpeed={0.9}
        />
      </Canvas>
    </div>
  )
}

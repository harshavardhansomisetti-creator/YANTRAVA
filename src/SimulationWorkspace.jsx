import { useMemo, useState } from 'react'
import './SimulationWorkspace.css'
import Simulation3DScene from './Simulation3DScene'

const boardDetails = {
  'arduino-uno': {
    name: 'Arduino Uno R3',
    chip: 'ATmega328P',
    voltage: '5V',
    pins: '14 Digital / 6 Analog',
    language: 'Arduino C++',
    defaultCode: `void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);

  digitalWrite(13, LOW);
  delay(1000);
}`
  },
  esp32: {
    name: 'ESP32 DevKit V1',
    chip: 'ESP32',
    voltage: '3.3V',
    pins: 'GPIO / ADC / PWM',
    language: 'Arduino C++',
    defaultCode: `void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(2, !digitalRead(2));
  delay(1000);
}`
  },
  stm32: {
    name: 'STM32 NUCLEO-F446RE',
    chip: 'STM32F446RE',
    voltage: '3.3V',
    pins: 'GPIO / ADC / PWM',
    language: 'Embedded C',
    defaultCode: `#include "main.h"

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    HAL_Delay(1000);
  }
}`
  }
}

const componentLibrary = [
  { id: 'led-red', name: 'Red LED', type: 'LED', value: 'Red', pins: 2, color: '#e34b4b' },
  { id: 'led-green', name: 'Green LED', type: 'LED', value: 'Green', pins: 2, color: '#26b978' },
  { id: 'resistor', name: 'Resistor', type: 'Resistor', value: '220 Ω', pins: 2, color: '#d9b77c' },
  { id: 'button', name: 'Push Button', type: 'Button', value: 'Normally open', pins: 4, color: '#334155' },
  { id: 'pot', name: 'Potentiometer', type: 'Potentiometer', value: '10 kΩ', pins: 3, color: '#cbd5e1' },
  { id: 'buzzer', name: 'Buzzer', type: 'Buzzer', value: '5V', pins: 2, color: '#252a31' },
  { id: 'ldr', name: 'LDR', type: 'LDR', value: 'Photoresistor', pins: 2, color: '#d6c08b' },
  { id: 'ultrasonic', name: 'Ultrasonic Sensor', type: 'HC-SR04', value: '5V', pins: 4, color: '#3b82a5' },
  { id: 'servo', name: 'Servo Motor', type: 'Servo', value: 'SG90', pins: 3, color: '#2563eb' },
  { id: 'lcd', name: 'LCD 16×2', type: 'LCD', value: 'I2C / 16×2', pins: 4, color: '#647b57' }
]

function BoardIllustration({ boardId, details }) {
  const isArduino = boardId === 'arduino-uno'
  const isEsp = boardId === 'esp32'

  return (
    <svg className="hardware-board-svg" viewBox="0 0 660 340" role="img" aria-label={`${details.name} board illustration`}>
      <defs>
        <linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isArduino ? '#238b63' : isEsp ? '#245d78' : '#315c9a'} />
          <stop offset="1" stopColor={isArduino ? '#07553d' : isEsp ? '#123b55' : '#17396d'} />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e5e7eb" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <filter id="boardShadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#000" floodOpacity=".35" />
        </filter>
      </defs>

      {isArduino ? (
        <g filter="url(#boardShadow)">
          <path d="M100 48 H510 L548 83 V258 L520 290 H100 L72 260 V83 Z" fill="url(#pcb)" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="103" cy="79" r="11" fill="#d6d3d1" stroke="#64748b" strokeWidth="4" />
          <circle cx="514" cy="79" r="11" fill="#d6d3d1" stroke="#64748b" strokeWidth="4" />
          <circle cx="103" cy="258" r="11" fill="#d6d3d1" stroke="#64748b" strokeWidth="4" />
          <circle cx="514" cy="258" r="11" fill="#d6d3d1" stroke="#64748b" strokeWidth="4" />

          <rect x="25" y="128" width="70" height="78" rx="7" fill="url(#metal)" stroke="#334155" strokeWidth="3" />
          <rect x="12" y="146" width="20" height="42" rx="3" fill="#475569" />
          <rect x="98" y="142" width="22" height="48" rx="3" fill="#cbd5e1" />
          <rect x="119" y="135" width="38" height="62" rx="5" fill="#e5e7eb" stroke="#475569" />
          <text x="137" y="170" textAnchor="middle" fontSize="8" fill="#334155">USB</text>

          <rect x="202" y="114" width="112" height="82" rx="5" fill="#15191d" stroke="#64748b" strokeWidth="2" />
          <path d="M215 105 V114 M230 105 V114 M245 105 V114 M260 105 V114 M275 105 V114 M290 105 V114" stroke="#cbd5e1" strokeWidth="3" />
          <path d="M215 196 V205 M230 196 V205 M245 196 V205 M260 196 V205 M275 196 V205 M290 196 V205" stroke="#cbd5e1" strokeWidth="3" />
          <text x="258" y="151" textAnchor="middle" fill="#cbd5e1" fontSize="12">ATMEGA</text>
          <text x="258" y="168" textAnchor="middle" fill="#94a3b8" fontSize="9">328P</text>

          <rect x="370" y="112" width="70" height="48" rx="4" fill="#111827" stroke="#94a3b8" />
          <text x="405" y="140" textAnchor="middle" fill="#cbd5e1" fontSize="9">ATmega16U2</text>
          <rect x="342" y="190" width="45" height="22" rx="3" fill="#1f2937" />
          <text x="364" y="205" textAnchor="middle" fill="#94a3b8" fontSize="8">REG</text>

          <rect x="445" y="180" width="30" height="24" rx="3" fill="#d1d5db" />
          <rect x="480" y="180" width="30" height="24" rx="3" fill="#d1d5db" />
          <circle cx="465" cy="90" r="7" fill="#ef4444" stroke="#fecaca" />
          <circle cx="490" cy="90" r="7" fill="#22c55e" stroke="#bbf7d0" />

          <g fill="#d1d5db" stroke="#475569" strokeWidth="1">
            {Array.from({ length: 14 }, (_, i) => <rect key={`d${i}`} x={175 + i * 22} y="45" width="12" height="17" rx="2" />)}
            {Array.from({ length: 14 }, (_, i) => <rect key={`p${i}`} x={175 + i * 22} y="276" width="12" height="17" rx="2" />)}
          </g>
          <g fill="#e2e8f0" fontSize="8">
            <text x="180" y="39">DIGITAL I/O</text>
            <text x="180" y="316">POWER / ANALOG IN</text>
            <text x="145" y="235" fontSize="17" fontWeight="bold">Arduino</text>
            <text x="145" y="250" fontSize="10">UNO R3</text>
          </g>
          <g fill="#cbd5e1" fontSize="8">
            {['D0','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13'].map((p, i) => <text key={p} x={178 + i * 22} y="74" textAnchor="middle">{p}</text>)}
            {['IOREF','RESET','3V3','5V','GND','GND','VIN','A0','A1','A2','A3','A4','A5'].map((p, i) => <text key={p} x={180 + i * 23} y="270" textAnchor="middle">{p}</text>)}
          </g>
        </g>
      ) : (
        <g filter="url(#boardShadow)">
          <rect x="170" y="35" width="320" height="270" rx="18" fill="url(#pcb)" stroke="#9ca3af" strokeWidth="2" />
          <rect x="278" y="17" width="104" height="45" rx="5" fill="url(#metal)" stroke="#334155" strokeWidth="3" />
          <rect x="305" y="10" width="50" height="13" rx="3" fill="#475569" />
          <rect x="258" y="111" width="145" height="90" rx="6" fill="#15191d" stroke="#94a3b8" strokeWidth="2" />
          <text x="330" y="151" fill="#e2e8f0" fontSize="15" textAnchor="middle">{details.chip}</text>
          <text x="330" y="171" fill="#94a3b8" fontSize="10" textAnchor="middle">MICROCONTROLLER</text>
          {Array.from({ length: 15 }, (_, i) => (
            <g key={i}>
              <rect x="190" y={75 + i * 14} width="17" height="8" rx="2" fill="#d1d5db" />
              <rect x="453" y={75 + i * 14} width="17" height="8" rx="2" fill="#d1d5db" />
            </g>
          ))}
          <circle cx="438" cy="58" r="7" fill="#22c55e" />
          <text x="330" y="250" fill="#e2e8f0" fontSize="16" textAnchor="middle" fontWeight="bold">{isEsp ? 'ESP32 DEVKIT' : 'NUCLEO-F446RE'}</text>
          <text x="330" y="270" fill="#cbd5e1" fontSize="10" textAnchor="middle">{isEsp ? 'Wi-Fi / Bluetooth' : 'STMicroelectronics'}</text>
        </g>
      )}
    </svg>
  )
}

function Breadboard() {
  const rows = Array.from({ length: 10 }, (_, i) => i)
  const cols = Array.from({ length: 30 }, (_, i) => i)

  return (
    <div className="breadboard">
      <div className="breadboard-rail positive"><span>+</span></div>
      <div className="breadboard-rail negative"><span>−</span></div>
      <div className="breadboard-holes">
        {rows.map(row => (
          <div className="breadboard-row" key={row}>
            {cols.map(col => (
              <i key={col} className={(col === 14 || col === 15) ? 'center-gap' : ''} />
            ))}
          </div>
        ))}
      </div>
      <div className="breadboard-rail positive bottom"><span>+</span></div>
      <div className="breadboard-rail negative bottom"><span>−</span></div>
    </div>
  )
}

function ComponentGraphic({ item }) {
  if (item.type === 'LED') {
    return <div className={`part-led ${item.id === 'led-green' ? 'green' : ''}`}><i /><b /></div>
  }
  if (item.type === 'Resistor') {
    return <div className="part-resistor"><i /><b /><i /></div>
  }
  if (item.type === 'Button') {
    return <div className="part-button"><i /><b /></div>
  }
  if (item.type === 'Potentiometer') {
    return <div className="part-pot"><i /></div>
  }
  if (item.type === 'Buzzer') {
    return <div className="part-buzzer"><i /></div>
  }
  if (item.type === 'LDR') {
    return <div className="part-ldr"><i /><b /></div>
  }
  if (item.type === 'HC-SR04') {
    return <div className="part-ultrasonic"><i /><i /></div>
  }
  if (item.type === 'Servo') {
    return <div className="part-servo"><i /></div>
  }
  return <div className="part-lcd"><i>YANTRAVA</i></div>
}

function SimulationWorkspace({ board, onBack }) {
  const details = boardDetails[board?.id] || boardDetails['arduino-uno']
  const [code, setCode] = useState(details.defaultCode)
  const [placed, setPlaced] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [activeTab, setActiveTab] = useState('workspace')
  const [zoom, setZoom] = useState(100)
  const [search, setSearch] = useState('')
  const [consoleLines, setConsoleLines] = useState(['YANTRAVA hardware workspace ready.', 'Simulation engine is not connected yet.'])
  const [properties, setProperties] = useState({})

  const selected = placed.find(item => item.instanceId === selectedId)
  const filteredComponents = useMemo(
    () => componentLibrary.filter(item => item.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const addComponent = item => {
    const instance = {
      ...item,
      instanceId: `${item.id}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      x: 42 + Math.random() * 30,
      y: 36 + Math.random() * 30
    }
    setPlaced(previous => [...previous, instance])
    setSelectedId(instance.instanceId)
  }

  const handleDrop = event => {
    event.preventDefault()
    const raw = event.dataTransfer.getData('application/yantrava-component')
    if (!raw) return
    const item = componentLibrary.find(component => component.id === raw)
    if (item) addComponent(item)
  }

  const movePart = (event, item) => {
    const area = event.currentTarget.parentElement.getBoundingClientRect()
    const x = Math.min(94, Math.max(6, ((event.clientX - area.left) / area.width) * 100))
    const y = Math.min(88, Math.max(10, ((event.clientY - area.top) / area.height) * 100))
    setPlaced(previous => previous.map(part => part.instanceId === item.instanceId ? { ...part, x, y } : part))
  }

  const updateProperty = (key, value) => {
    setProperties(previous => ({ ...previous, [key]: value }))
    if (key === 'name') {
      setPlaced(previous => previous.map(part => part.instanceId === selectedId ? { ...part, customName: value } : part))
    }
    if (key === 'value') {
      setPlaced(previous => previous.map(part => part.instanceId === selectedId ? { ...part, value } : part))
    }
  }

  const deleteSelected = () => {
    setPlaced(previous => previous.filter(item => item.instanceId !== selectedId))
    setSelectedId(null)
  }

  const resetWorkspace = () => {
    setPlaced([])
    setSelectedId(null)
    setCode(details.defaultCode)
    setConsoleLines(['Workspace cleared.', 'Default code restored.'])
  }

  const changeZoom = amount => setZoom(value => Math.min(140, Math.max(70, value + amount)))

  return (
    <div className="simulation-workspace">
      <header className="sim-topbar">
        <div className="sim-topbar-left">
          <button className="sim-back-button" onClick={onBack}>← Boards</button>
          <div className="sim-brand-mark">Y</div>
          <div className="sim-title-block">
            <h2>{details.name}</h2>
            <span>{details.chip} <i /> {details.language}</span>
          </div>
        </div>
        <div className="sim-topbar-actions">
          <span className="sim-save-status"><i /> Local workspace</span>
          <button onClick={resetWorkspace}>Reset</button>
          <button className="sim-run-button" disabled title="Simulation engine integration is the next development stage">▶ Run</button>
          <button className="sim-stop-button" disabled>■ Stop</button>
        </div>
      </header>

      <div className="sim-workspace-toolbar">
        <div className="sim-toolbar-tabs">
          <button className={activeTab === 'workspace' ? 'active' : ''} onClick={() => setActiveTab('workspace')}>Circuit workspace</button>
          <button className={activeTab === 'code' ? 'active' : ''} onClick={() => setActiveTab('code')}>Code editor</button>
        </div>
        <div className="sim-canvas-tools">
          <span>DESIGN CANVAS</span>
          <button onClick={() => changeZoom(-10)}>−</button>
          <b>{zoom}%</b>
          <button onClick={() => changeZoom(10)}>+</button>
          <button onClick={() => setZoom(100)}>Fit</button>
        </div>
      </div>

      <div className="sim-workspace-layout">
        <aside className="sim-library-panel">
          <div className="sim-side-heading">
            <div><span>HARDWARE</span><h3>Components</h3></div>
            <span className="sim-count">{componentLibrary.length}</span>
          </div>
          <div className="sim-search-wrap">
            <span>⌕</span>
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search components..." />
          </div>
          <div className="sim-library-section-label">BASIC COMPONENTS</div>
          <div className="sim-library-list">
            {filteredComponents.map(item => (
              <button
                className="sim-library-item"
                key={item.id}
                draggable
                onDragStart={event => event.dataTransfer.setData('application/yantrava-component', item.id)}
                onClick={() => addComponent(item)}
              >
                <span className="sim-library-thumb"><ComponentGraphic item={item} /></span>
                <span className="sim-library-copy"><b>{item.name}</b><small>{item.value}</small></span>
                <span className="sim-add-symbol">+</span>
              </button>
            ))}
            {!filteredComponents.length && <p className="sim-no-results">No components found.</p>}
          </div>
          <div className="sim-library-hint">Drag a component onto the design canvas, or click + to add it.</div>
        </aside>

        <main className="sim-design-area">
          {activeTab === 'workspace' ? (
            <>
              <div className="sim-canvas-header">
                <div><b>Untitled circuit</b><span> / {details.name}</span></div>
                <div className="sim-canvas-coordinates">GRID · 10 PX</div>
              </div>
              <div
                className="sim-canvas-scroll"
                onDragOver={event => event.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="sim-canvas" style={{ transform: `scale(${zoom / 100})` }}>
                 <div className="sim-board-render">
  {board?.id === 'arduino-uno' ? (
    <Simulation3DScene />
  ) : (
    <BoardIllustration boardId={board?.id} details={details} />
  )}
</div>
                  <div className="sim-breadboard-label">SOLDERLESS BREADBOARD</div>
                  <Breadboard />
                  {placed.map(item => (
                    <div
                      key={item.instanceId}
                      className={`sim-placed-part ${selectedId === item.instanceId ? 'selected' : ''}`}
                      style={{ left: `${item.x}%`, top: `${item.y}%` }}
                      onPointerDown={event => {
                        if (event.button !== 0) return
                        event.currentTarget.setPointerCapture(event.pointerId)
                        setSelectedId(item.instanceId)
                      }}
                      onPointerMove={event => {
                        if (event.buttons === 1 && event.currentTarget.hasPointerCapture(event.pointerId)) movePart(event, item)
                      }}
                      onPointerUp={event => {
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
                      }}
                      onClick={() => setSelectedId(item.instanceId)}
                      title={`${item.name} · ${item.value}`}
                    >
                      <ComponentGraphic item={item} />
                      <span>{item.customName || item.name}</span>
                    </div>
                  ))}
                  {placed.length === 0 && (
                    <div className="sim-canvas-empty">
                      <span>＋</span>
                      <b>Start building your circuit</b>
                      <small>Drag components from the library onto this canvas.</small>
                    </div>
                  )}
                </div>
              </div>
              <div className="sim-canvas-footer">
                <span>{placed.length} component{placed.length === 1 ? '' : 's'} placed</span>
                <span>Drag components to reposition · Select to edit properties</span>
              </div>
            </>
          ) : (
            <section className="sim-editor-view">
              <div className="sim-editor-title"><div><span>FIRMWARE</span><h3>Main program</h3></div><span>{details.language}</span></div>
              <textarea value={code} onChange={event => setCode(event.target.value)} spellCheck="false" />
              <div className="sim-editor-note">Code editing is available. Compilation and board execution will be connected with the simulation engine.</div>
            </section>
          )}

          <section className="sim-console-panel">
            <div className="sim-console-heading"><div><b>Output console</b><span>Workspace messages</span></div><button onClick={() => setConsoleLines([])}>Clear</button></div>
            <div className="sim-console-output">
              {consoleLines.map((line, index) => <div key={index}><span>{String(index + 1).padStart(2, '0')}</span>{line}</div>)}
              {!consoleLines.length && <span className="sim-console-empty">Console is clear.</span>}
            </div>
          </section>
        </main>

        <aside className="sim-inspector-panel">
          <div className="sim-side-heading"><div><span>INSPECTOR</span><h3>Properties</h3></div></div>
          {selected ? (
            <div className="sim-inspector-content">
              <div className="sim-inspector-preview"><ComponentGraphic item={selected} /></div>
              <h4>{selected.name}</h4>
              <p>{selected.type} · {selected.pins} pins</p>
              <label>Component name
                <input value={properties.name ?? selected.customName ?? selected.name} onChange={event => updateProperty('name', event.target.value)} />
              </label>
              <label>Value / configuration
                <input value={properties.value ?? selected.value} onChange={event => updateProperty('value', event.target.value)} />
              </label>
              <div className="sim-inspector-row"><span>Component type</span><b>{selected.type}</b></div>
              <div className="sim-inspector-row"><span>Pin count</span><b>{selected.pins}</b></div>
              <button className="sim-delete-part" onClick={deleteSelected}>Delete component</button>
            </div>
          ) : (
            <div className="sim-inspector-empty">
              <span>⌖</span>
              <b>No component selected</b>
              <p>Select a component on the canvas to inspect its properties.</p>
            </div>
          )}
          <div className="sim-board-specs">
            <span>BOARD INFORMATION</span>
            <div><small>Controller</small><b>{details.chip}</b></div>
            <div><small>Operating voltage</small><b>{details.voltage}</b></div>
            <div><small>I/O pins</small><b>{details.pins}</b></div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default SimulationWorkspace
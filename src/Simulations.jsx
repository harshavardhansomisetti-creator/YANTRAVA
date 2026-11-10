
import './Simulations.css'

const boards = [
  {
    id: 'arduino-uno',
    name: 'Arduino Uno R3',
    type: 'MICROCONTROLLER BOARD',
    chip: 'ATmega328P',
    description: 'Learn the fundamentals of embedded systems, GPIO, sensors and basic electronics.',
    tags: ['GPIO', 'ADC', 'PWM', 'UART', 'I2C', 'SPI'],
    color: 'arduino',
  },
  {
    id: 'esp32',
    name: 'ESP32 DevKit',
    type: 'WIRELESS DEVELOPMENT BOARD',
    chip: 'ESP32',
    description: 'Explore Wi-Fi, Bluetooth, IoT applications and advanced microcontroller projects.',
    tags: ['Wi-Fi', 'Bluetooth', 'GPIO', 'ADC', 'PWM', 'I2C'],
    color: 'esp32',
  },
  {
    id: 'stm32',
    name: 'STM32 NUCLEO-F446RE',
    type: 'ARM CORTEX-M4 DEVELOPMENT BOARD',
    chip: 'STM32F446RE',
    description: 'Practice professional embedded development with ARM Cortex-M4 peripherals.',
    tags: ['GPIO', 'ADC', 'PWM', 'UART', 'SPI', 'I2C'],
    color: 'stm32',
  },
]

function Simulations({ onSelectBoard }) {
  return (
    <div className="simulations-page">
      <div className="simulations-heading">
        <span className="section-kicker">VIRTUAL ELECTRONICS LAB</span>
        <h1>Simulation Studio</h1>
        <p>
          Select your development board and start experimenting with
          circuits, components and embedded code.
        </p>
      </div>

      <div className="simulation-info">
        <span className="status-dot"></span>
        <span>3 development boards available</span>
      </div>

      <div className="simulation-board-grid">
        {boards.map((board) => (
          <article className="simulation-board-card" key={board.id}>
            <div className={`board-visual ${board.color}`}>
              <span className="board-chip">{board.chip}</span>
              <span className="board-label">YANTRAVA LAB</span>
              <div className="board-pins">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i}></span>
                ))}
              </div>
            </div>

            <div className="board-card-content">
              <span className="board-type">{board.type}</span>
              <h2>{board.name}</h2>
              <p>{board.description}</p>

              <div className="board-tags">
                {board.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <button
                className="board-select-btn"
                onClick={() => onSelectBoard(board)}
              >
                Select Board <span>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Simulations

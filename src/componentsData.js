
const componentCategories = [
  {
    id: "passive",
    name: "Passive Components",
    description: "Components that store, transfer or control electrical energy.",
    groups: ["Resistors", "Capacitors", "Inductors", "Transformers", "Ferrite Beads", "Crystal Oscillators"]
  },
  {
    id: "semiconductor",
    name: "Semiconductor Devices",
    description: "Electronic devices made using semiconductor materials.",
    groups: ["Diodes", "LEDs", "Zener Diodes", "BJTs", "MOSFETs", "JFETs", "IGBTs", "Thyristors", "Triacs"]
  },
  {
    id: "analog",
    name: "Analog ICs",
    description: "Integrated circuits used for analog signal processing.",
    groups: ["Operational Amplifiers", "Comparators", "555 Timers", "Voltage Regulators", "Audio Amplifiers", "Analog Switches"]
  },
  {
    id: "digital",
    name: "Digital ICs",
    description: "Integrated circuits used in digital logic and processing.",
    groups: ["Logic Gates", "Flip-Flops", "Counters", "Multiplexers", "Decoders", "Shift Registers", "Microprocessors", "Memory ICs"]
  },
  {
    id: "sensors",
    name: "Sensors & Transducers",
    description: "Devices that detect physical quantities and convert them into signals.",
    groups: ["Temperature Sensors", "Pressure Sensors", "Humidity Sensors", "IR Sensors", "Ultrasonic Sensors", "Motion Sensors", "Light Sensors", "Gas Sensors", "Current Sensors", "Voltage Sensors"]
  },
  {
    id: "electromechanical",
    name: "Electromechanical Components",
    description: "Components that combine electrical and mechanical operation.",
    groups: ["Relays", "Switches", "DC Motors", "Servo Motors", "Stepper Motors", "Solenoids", "Fans", "Buzzers"]
  },
  {
    id: "power",
    name: "Power Electronics",
    description: "Devices used to convert and control electrical power.",
    groups: ["Rectifiers", "DC-DC Converters", "Inverters", "AC-DC Converters", "Power Modules", "Battery Management Systems"]
  },
  {
    id: "communication",
    name: "Communication Components",
    description: "Devices used for wired and wireless communication.",
    groups: ["Antennas", "RF Modules", "Wi-Fi Modules", "Bluetooth Modules", "GPS Modules", "GSM Modules", "LoRa Modules", "Transceivers"]
  },
  {
    id: "display",
    name: "Displays & Indicators",
    description: "Components used to display information and status.",
    groups: ["LCD Displays", "OLED Displays", "Seven Segment Displays", "LED Displays", "Dot Matrix Displays", "Indicator LEDs"]
  },
  {
    id: "embedded",
    name: "Embedded Boards & Modules",
    description: "Programmable boards used in embedded systems and prototyping.",
    groups: ["Arduino Boards", "ESP32 Boards", "STM32 Boards", "Raspberry Pi Boards", "Development Boards", "Interface Modules"]
  },
  {
    id: "connectors",
    name: "Connectors & Protection",
    description: "Components used for connections and circuit protection.",
    groups: ["Connectors", "Terminal Blocks", "Fuses", "Circuit Breakers", "TVS Diodes", "Varistors", "ESD Protection Devices"]
  },
  {
    id: "instruments",
    name: "Measurement Instruments",
    description: "Equipment used to measure and analyze electrical signals.",
    groups: ["Digital Multimeters", "Oscilloscopes", "Function Generators", "DC Power Supplies", "LCR Meters", "Logic Analyzers"]
  }
]

// Component-specific information for commonly used parts.
// Exact ratings and pin numbers depend on the selected part number.
const componentProfiles = {
  "Resistors": {
    overview: "A passive two-terminal component that limits current and creates voltage drops.",
    workingPrinciple: "A resistive material opposes the flow of electric current and converts electrical energy into heat.",
    terminals: ["Terminal 1", "Terminal 2"],
    polarity: "Non-polarized. Either terminal can connect to either side.",
    specifications: ["Resistance (Ω)", "Power rating (W)", "Tolerance (%)", "Temperature coefficient"],
    applications: ["Current limiting", "Voltage dividers", "Pull-up and pull-down networks"],
    limitations: ["Power dissipation causes heating.", "Resistance changes with tolerance and temperature."]
  },
  "Capacitors": {
    overview: "A passive component that stores energy in an electric field.",
    workingPrinciple: "Two conductive plates separated by a dielectric store electric charge when a voltage is applied.",
    terminals: ["Terminal 1", "Terminal 2"],
    polarity: "Ceramic capacitors are usually non-polarized. Electrolytic capacitors are polarized.",
    specifications: ["Capacitance (F)", "Rated voltage (V)", "Tolerance (%)", "ESR", "Dielectric type"],
    applications: ["Filtering", "Decoupling", "Timing circuits", "Energy storage"],
    limitations: ["Voltage rating must not be exceeded.", "Electrolytic capacitors require correct polarity."]
  },
  "Inductors": {
    overview: "A passive component that stores energy in a magnetic field.",
    workingPrinciple: "Current flowing through a coil creates a magnetic field. The inductor opposes changes in current.",
    terminals: ["Terminal 1", "Terminal 2"],
    polarity: "Usually non-polarized; winding direction and marked dots matter in coupled coils.",
    specifications: ["Inductance (H)", "Rated current (A)", "DCR (Ω)", "Saturation current", "Q factor"],
    applications: ["Filters", "DC-DC converters", "Chokes", "Resonant circuits"],
    limitations: ["Core saturation can reduce inductance.", "Winding resistance causes losses."]
  },
  "Transformers": {
    overview: "A magnetic component that transfers AC energy between windings.",
    workingPrinciple: "An alternating current in the primary winding creates changing magnetic flux, inducing voltage in the secondary winding.",
    terminals: ["Primary winding terminals", "Secondary winding terminals"],
    polarity: "Winding phase and dot markings must be observed.",
    specifications: ["Turns ratio", "Rated voltage", "Rated power (VA)", "Frequency", "Isolation rating"],
    applications: ["Voltage conversion", "Isolation", "Impedance matching"],
    limitations: ["Ordinary transformers require changing magnetic flux.", "Real transformers have copper and core losses."]
  },
  "Diodes": {
    overview: "A semiconductor device that mainly allows current to flow in one direction.",
    workingPrinciple: "A PN junction conducts when forward biased and blocks current when reverse biased, within its ratings.",
    terminals: ["Anode (A)", "Cathode (K)"],
    polarity: "Polarized. The cathode is commonly marked by a band on axial diodes.",
    specifications: ["Forward voltage", "Maximum forward current", "Reverse voltage", "Reverse recovery time"],
    applications: ["Rectification", "Reverse-polarity protection", "Signal circuits"],
    limitations: ["Forward voltage causes power loss.", "Exceeding reverse-voltage limits can damage the device."]
  },
  "LEDs": {
    overview: "A light-emitting diode that produces light when forward biased.",
    workingPrinciple: "Electron-hole recombination in the semiconductor releases energy as light.",
    terminals: ["Anode (+)", "Cathode (−)"],
    polarity: "Polarized. Identify terminals from the datasheet; common through-hole LEDs have a longer anode lead and a flat cathode side.",
    specifications: ["Forward voltage", "Forward current", "Wavelength or colour", "Luminous intensity", "Viewing angle"],
    applications: ["Indicators", "Displays", "Lighting", "Optical communication"],
    limitations: ["Requires current limiting or a suitable driver.", "Maximum current and thermal ratings must be respected."]
  },
  "Zener Diodes": {
    overview: "A diode designed to operate in reverse breakdown within specified limits.",
    workingPrinciple: "When reverse voltage reaches its Zener region, the diode conducts and maintains an approximately controlled voltage.",
    terminals: ["Anode (A)", "Cathode (K)"],
    polarity: "Polarized.",
    specifications: ["Zener voltage", "Power rating", "Tolerance", "Dynamic resistance"],
    applications: ["Voltage references", "Simple voltage regulation", "Overvoltage protection"],
    limitations: ["Needs current limiting.", "Regulation is limited by power and current ratings."]
  },
  "BJTs": {
    overview: "A three-terminal semiconductor device used for switching and amplification.",
    workingPrinciple: "A small base current controls a larger collector current in the appropriate operating region.",
    terminals: ["Base (B)", "Collector (C)", "Emitter (E)"],
    polarity: "NPN and PNP types have different current directions and bias requirements.",
    specifications: ["Maximum collector current", "Voltage ratings", "Current gain (hFE)", "Power dissipation", "Switching time"],
    applications: ["Switching", "Signal amplification", "Driver circuits"],
    limitations: ["Pin order varies by package and part number.", "Requires correct base drive and thermal design."]
  },
  "MOSFETs": {
    overview: "A voltage-controlled field-effect transistor used for switching and amplification.",
    workingPrinciple: "Gate-to-source voltage controls the conductive channel between drain and source.",
    terminals: ["Gate (G)", "Drain (D)", "Source (S)"],
    polarity: "N-channel and P-channel devices have different drive and connection requirements.",
    specifications: ["Drain-source voltage", "Continuous drain current", "RDS(on)", "Gate charge", "Threshold voltage"],
    applications: ["Power switching", "Motor drivers", "DC-DC converters"],
    limitations: ["Gate voltage must stay within its rating.", "Threshold voltage alone does not guarantee low RDS(on)."]
  },
  "Operational Amplifiers": {
    overview: "An integrated circuit that amplifies the difference between two input voltages.",
    workingPrinciple: "The output responds to the differential input, usually with external feedback setting the circuit behaviour.",
    terminals: ["Non-inverting input (+)", "Inverting input (−)", "Output", "Power supply pins"],
    polarity: "Supply configuration and pin numbers depend on the IC model.",
    specifications: ["Gain-bandwidth product", "Input offset voltage", "Slew rate", "Input common-mode range", "Supply voltage"],
    applications: ["Amplifiers", "Filters", "Signal conditioning", "Active integrators"],
    limitations: ["Output swing and input range are limited by the supply and device design."]
  },
  "555 Timers": {
    overview: "A timer IC used to generate pulses and timing delays.",
    workingPrinciple: "Internal comparators, a latch and a discharge transistor control timing based on external resistor and capacitor networks.",
    terminals: ["GND", "Trigger", "Output", "Reset", "Control Voltage", "Threshold", "Discharge", "VCC"],
    polarity: "Pin numbers and functions should be checked against the exact 555 variant and package.",
    specifications: ["Supply voltage", "Output current", "Timing range", "Operating frequency"],
    applications: ["Astable oscillators", "Monostable timers", "Pulse generation"],
    limitations: ["Timing accuracy depends on external components and the specific IC."]
  },
  "Relays": {
    overview: "An electrically operated switch that controls contacts using a coil or another actuator.",
    workingPrinciple: "Energizing the coil creates a magnetic field that moves the armature and changes the contact state.",
    terminals: ["Coil terminals", "Common (COM)", "Normally Open (NO)", "Normally Closed (NC)"],
    polarity: "Coil polarity depends on relay type; contact terminals are generally not polarized.",
    specifications: ["Coil voltage", "Coil current", "Contact rating", "Contact configuration", "Operate time"],
    applications: ["Electrical isolation", "Load switching", "Control panels"],
    limitations: ["Contact ratings must not be exceeded.", "Coils may need a suitable driver and flyback protection."]
  },
  "Ultrasonic Sensors": {
    overview: "A sensor that estimates distance using high-frequency sound waves.",
    workingPrinciple: "It measures the time between transmitting an ultrasonic pulse and receiving its echo.",
    terminals: ["VCC", "GND", "Trigger", "Echo"],
    polarity: "Power connections are polarized. Signal pin names and voltage levels depend on the sensor model.",
    specifications: ["Operating voltage", "Measurement range", "Accuracy", "Beam angle", "Trigger timing"],
    applications: ["Distance measurement", "Obstacle detection", "Level sensing"],
    limitations: ["Soft or angled surfaces can affect echo detection.", "Temperature and environment can affect readings."]
  },
  "Temperature Sensors": {
    overview: "Sensors that measure temperature and provide an electrical output.",
    workingPrinciple: "Depending on the type, temperature changes resistance, voltage, current or a digital sensor output.",
    terminals: ["Power", "Ground", "Output or data pins"],
    polarity: "Depends on the sensor type and package.",
    specifications: ["Temperature range", "Accuracy", "Resolution", "Response time", "Output type"],
    applications: ["Temperature monitoring", "Thermal control", "Embedded systems"],
    limitations: ["Accuracy and response depend on mounting, calibration and environment."]
  },
  "LCD Displays": {
    overview: "A display module that uses liquid crystals to form characters or pixels.",
    workingPrinciple: "An electric field changes the orientation of liquid crystals to control light transmission.",
    terminals: ["Power pins", "Ground", "Control pins", "Data pins"],
    polarity: "Pin names and interface wiring depend on the display module and controller.",
    specifications: ["Display size", "Resolution", "Interface", "Supply voltage", "Backlight current"],
    applications: ["Embedded user interfaces", "Meters", "Appliances"],
    limitations: ["Viewing angle and contrast depend on the display.", "Backlight may require separate power."]
  },
  "ESP32 Boards": {
    overview: "Development boards based on ESP32-family microcontrollers, often with wireless connectivity.",
    workingPrinciple: "The microcontroller executes firmware and interacts with sensors, actuators and communication interfaces.",
    terminals: ["GPIO pins", "Power pins", "Ground pins", "Communication interface pins"],
    polarity: "Power pins are polarized. GPIO capabilities and safe voltage levels depend on the exact board.",
    specifications: ["MCU variant", "Logic voltage", "Flash memory", "GPIO count", "Wireless capabilities"],
    applications: ["IoT devices", "Wireless control", "Sensor networks"],
    limitations: ["Pin capabilities vary between ESP32 models.", "Check board documentation before connecting external signals."]
  },
  "Digital Multimeters": {
    overview: "An instrument used to measure electrical quantities such as voltage, current and resistance.",
    workingPrinciple: "Internal measurement circuits convert electrical signals into values shown on the display.",
    terminals: ["COM", "Voltage/Resistance input", "Current input"],
    polarity: "Probe polarity matters for DC measurements. Input sockets depend on the meter model.",
    specifications: ["Measurement ranges", "Accuracy", "Resolution", "Input impedance", "Safety category"],
    applications: ["Circuit testing", "Continuity checks", "Voltage and resistance measurement"],
    limitations: ["Use the correct input socket and measurement mode.", "Never exceed the instrument's rated limits."]
  }
}

// General category-level guidance for components without a dedicated profile.
const categoryGuidance = {
  passive: {
    workingPrinciple: "Its behaviour depends on the component's electrical properties and construction.",
    terminals: ["Terminal details depend on component type and package."],
    polarity: "Check the component markings and datasheet."
  },
  semiconductor: {
    workingPrinciple: "Its operation depends on semiconductor junctions or electric-field-controlled regions.",
    terminals: ["Pin names and order depend on the exact device and package."],
    polarity: "Check the device type, markings and datasheet."
  },
  analog: {
    workingPrinciple: "Processes continuous electrical signals using internal analog circuits.",
    terminals: ["Supply, input and output pins depend on the IC."],
    polarity: "Check the exact IC pinout and supply requirements."
  },
  digital: {
    workingPrinciple: "Processes binary logic signals using digital circuits.",
    terminals: ["Power, ground, input and output pins depend on the IC."],
    polarity: "Check logic voltage levels and the exact IC pinout."
  },
  sensors: {
    workingPrinciple: "Detects a physical quantity and converts it into an electrical or digital signal.",
    terminals: ["Power, ground and output/data pins depend on the sensor."],
    polarity: "Check the sensor module's voltage and interface requirements."
  },
  electromechanical: {
    workingPrinciple: "Uses electrical energy to create or control mechanical movement or switching.",
    terminals: ["Electrical and mechanical connections depend on the device."],
    polarity: "Check coil, motor or actuator markings and wiring documentation."
  },
  power: {
    workingPrinciple: "Converts, controls or protects electrical power.",
    terminals: ["Input, output and control terminals depend on the module."],
    polarity: "Observe input/output polarity and voltage ratings."
  },
  communication: {
    workingPrinciple: "Transmits or receives information through wired or wireless signals.",
    terminals: ["Power, ground, antenna and data pins depend on the module."],
    polarity: "Check supply voltage, interface levels and antenna requirements."
  },
  display: {
    workingPrinciple: "Converts electrical signals into visible information or status indications.",
    terminals: ["Power, control and data connections depend on the display."],
    polarity: "Check the module pinout and backlight requirements."
  },
  embedded: {
    workingPrinciple: "Executes firmware and interacts with connected electronic components.",
    terminals: ["GPIO, power, ground and interface pins vary by board."],
    polarity: "Check the board pinout and supported voltage levels."
  },
  connectors: {
    workingPrinciple: "Provides electrical connections or protects a circuit against specified fault conditions.",
    terminals: ["Contact layout and terminal numbering depend on the part."],
    polarity: "Check connector keying, pin numbering and protection-device orientation."
  },
  instruments: {
    workingPrinciple: "Measures or generates electrical signals using internal measurement or signal-generation circuits.",
    terminals: ["Input, output and reference connections depend on the instrument."],
    polarity: "Follow the instrument manual and terminal ratings."
  }
}

const componentProfilesByName = {
  "Resistors": "Resistors",
  "Capacitors": "Capacitors",
  "Inductors": "Inductors",
  "Transformers": "Transformers",
  "Diodes": "Diodes",
  "LEDs": "LEDs",
  "Zener Diodes": "Zener Diodes",
  "BJTs": "BJTs",
  "MOSFETs": "MOSFETs",
  "Operational Amplifiers": "Operational Amplifiers",
  "555 Timers": "555 Timers",
  "Relays": "Relays",
  "Ultrasonic Sensors": "Ultrasonic Sensors",
  "Temperature Sensors": "Temperature Sensors",
  "LCD Displays": "LCD Displays",
  "ESP32 Boards": "ESP32 Boards",
  "Digital Multimeters": "Digital Multimeters"
}

export function getComponentDetails(componentName, categoryId) {
  const profileName = componentProfilesByName[componentName]
  const profile = profileName ? componentProfiles[profileName] : null
  const guidance = categoryGuidance[categoryId] || {}

  return {
    name: componentName,
    overview: profile?.overview || `${componentName} are used in electronic systems for specific electrical, sensing, control or measurement functions.`,
    workingPrinciple: profile?.workingPrinciple || guidance.workingPrinciple || "The working principle depends on the exact component type and model.",
    terminals: profile?.terminals || guidance.terminals || ["Refer to the component datasheet."],
    polarity: profile?.polarity || guidance.polarity || "Check the exact component datasheet.",
    specifications: profile?.specifications || ["Operating voltage or range", "Current or power rating", "Accuracy or tolerance", "Package and interface"],
    applications: profile?.applications || ["Electronic systems", "Embedded projects", "Circuit development"],
    limitations: profile?.limitations || ["Performance depends on the selected model and operating conditions.", "Verify ratings before using the component."],
    referenceNote: "For exact pin numbers, electrical ratings and package dimensions, select a specific part number and verify its manufacturer's datasheet."
  }
}

export default componentCategories

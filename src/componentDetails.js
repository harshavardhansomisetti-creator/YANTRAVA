
const componentDetails = [
  {
    id: "resistor",
    name: "Resistor",
    category: "Passive Components",
    image: "/components/resistor.jpg",
    model: "/models/resistor.glb",
    description: "A resistor limits the flow of electric current.",
    history: "The practical development of resistors evolved during the 19th century.",
    working: "It produces a voltage drop when current flows through its resistance.",
    formula: "V = I × R",
    unit: "Ohm (Ω)",
    applications: ["LED circuits", "Voltage dividers", "Current limiting"],
    terminals: ["Terminal 1", "Terminal 2"]
  },
  {
    id: "capacitor",
    name: "Capacitor",
    category: "Passive Components",
    image: "/components/capacitor.jpg",
    model: "/models/capacitor.glb",
    description: "A capacitor stores electrical energy in an electric field.",
    history: "The Leyden jar was an early capacitor developed in the 18th century.",
    working: "It stores charge between two conductive plates separated by a dielectric.",
    formula: "Q = C × V",
    unit: "Farad (F)",
    applications: ["Filtering", "Timing circuits", "Energy storage"],
    terminals: ["Positive", "Negative"]
  },
  {
    id: "diode",
    name: "Diode",
    category: "Semiconductor Devices",
    image: "/components/diode.jpg",
    model: "/models/diode.glb",
    description: "A diode allows current mainly in one direction.",
    history: "Semiconductor diode technology developed from early crystal detectors.",
    working: "A PN junction conducts in forward bias and blocks current in reverse bias within its ratings.",
    formula: "I = Is (e^(Vd/nVt) - 1)",
    unit: "Ampere (A)",
    applications: ["Rectifiers", "Protection circuits", "Signal detection"],
    terminals: ["Anode", "Cathode"]
  }
]

export default componentDetails

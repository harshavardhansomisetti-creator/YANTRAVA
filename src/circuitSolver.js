
const findPin = (part, pinId) => {
  const pins = {
    "DC Supply": ["positive", "negative"],
    Resistor: ["p1", "p2"],
    LED: ["anode", "cathode"]
  }

  return pins[part.type]?.includes(pinId)
}

export function solveSeriesCircuit(parts, wires, values) {
  const supplies = parts.filter(p => p.type === "DC Supply")
  const resistors = parts.filter(p => p.type === "Resistor")
  const leds = parts.filter(p => p.type === "LED")

  if (
    supplies.length !== 1 ||
    resistors.length !== 1 ||
    leds.length !== 1 ||
    parts.length !== 3
  ) {
    return {
      valid: false,
      message: "Use one DC Supply, one Resistor and one LED."
    }
  }

  const supply = supplies[0]
  const resistor = resistors[0]
  const led = leds[0]

  const parent = new Map()

  const key = (partId, pinId) => `${partId}:${pinId}`

  const find = x => {
    if (!parent.has(x)) parent.set(x, x)

    if (parent.get(x) !== x) {
      parent.set(x, find(parent.get(x)))
    }

    return parent.get(x)
  }

  const union = (a, b) => {
    const rootA = find(a)
    const rootB = find(b)

    if (rootA !== rootB) parent.set(rootA, rootB)
  }

  // Register all component terminals
  parts.forEach(part => {
    const pinIds = {
      "DC Supply": ["positive", "negative"],
      Resistor: ["p1", "p2"],
      LED: ["anode", "cathode"]
    }[part.type] || []

    pinIds.forEach(pin => find(key(part.id, pin)))
  })

  // Validate and combine wire connections
  for (const wire of wires) {
    const from = parts.find(p => p.id === wire.from.partId)
    const to = parts.find(p => p.id === wire.to.partId)

    if (
      !from || !to ||
      !findPin(from, wire.from.pinId) ||
      !findPin(to, wire.to.pinId)
    ) {
      return {
        valid: false,
        message: "Invalid wire connection detected."
      }
    }

    union(
      key(wire.from.partId, wire.from.pinId),
      key(wire.to.partId, wire.to.pinId)
    )
  }

  const sameNet = (partA, pinA, partB, pinB) =>
    find(key(partA.id, pinA)) === find(key(partB.id, pinB))

  // Expected path:
  // Supply (+) -> Resistor -> LED -> Supply (-)
  const forwardPath =
    sameNet(supply, "positive", resistor, "p1") &&
    sameNet(resistor, "p2", led, "anode") &&
    sameNet(led, "cathode", supply, "negative")

  const reverseResistorPath =
    sameNet(supply, "positive", resistor, "p2") &&
    sameNet(resistor, "p1", led, "anode") &&
    sameNet(led, "cathode", supply, "negative")

  if (!forwardPath && !reverseResistorPath) {
    return {
      valid: false,
      message: "Incomplete or incorrect circuit. Connect Supply (+) → Resistor → LED → Supply (−)."
    }
  }

  const voltage = Number(values.voltage)
  const resistance = Number(values.resistance)
  const ledDrop = Number(values.ledDrop)

  if (
    !Number.isFinite(voltage) ||
    !Number.isFinite(resistance) ||
    !Number.isFinite(ledDrop) ||
    voltage < 0 ||
    resistance <= 0 ||
    ledDrop < 0
  ) {
    return {
      valid: false,
      message: "Check the supply voltage, resistance and LED voltage values."
    }
  }

  const currentAmps = voltage > ledDrop
    ? (voltage - ledDrop) / resistance
    : 0

  const resistorVoltage = currentAmps * resistance
  const resistorPower = currentAmps ** 2 * resistance

  return {
    valid: true,
    message: currentAmps > 0
      ? "Valid series circuit. Current is flowing."
      : "Circuit is valid, but supply voltage is insufficient to turn on the LED.",
    voltage,
    resistance,
    ledDrop,
    current: currentAmps * 1000,
    resistorVoltage,
    ledVoltage: currentAmps > 0 ? ledDrop : Math.min(voltage, ledDrop),
    resistorPower: resistorPower,
    ledPower: currentAmps * ledDrop
  }
}

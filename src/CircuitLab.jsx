import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  BaseEdge,
  EdgeLabelRenderer,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {
  Activity,
  Cable,
  ChevronDown,
  CircuitBoard,
  FolderOpen,
  Gauge,
  Play,
  Pause,
  Square,
  RotateCw,
  Save,
  Search,
  Trash2,
  Undo2,
  Redo2,
  X,
  Zap,
  Waves,
  Terminal,
  Plus,
  MousePointer2,
  Settings,
} from 'lucide-react';

import './CircuitLab.css';


/* =========================================================
   COMPONENT LIBRARY
========================================================= */

const GROUPS = [
  {
    title: 'Basic Components',
    items: [
      { type: 'resistor', name: 'Resistor', value: '1 kΩ', description: 'Limits current and divides voltage.' },
      { type: 'capacitor', name: 'Capacitor', value: '100 µF', description: 'Stores energy in an electric field.' },
      { type: 'inductor', name: 'Inductor', value: '10 mH', description: 'Stores energy in a magnetic field.' },
      { type: 'potentiometer', name: 'Potentiometer', value: '10 kΩ', description: 'Adjustable resistance.' },
      { type: 'switch', name: 'Switch', value: 'Open', description: 'Opens or closes a circuit path.' },
      { type: 'fuse', name: 'Fuse', value: '1 A', description: 'Protective overcurrent element.' },
    ],
  },
  {
    title: 'Semiconductors',
    items: [
      { type: 'diode', name: 'Diode', value: '1N4007', description: 'Allows current primarily in one direction.' },
      { type: 'led', name: 'LED', value: 'Red LED', description: 'Emits light when forward biased.' },
      { type: 'npn', name: 'NPN Transistor', value: 'BC547', description: 'BJT used for switching and amplification.' },
      { type: 'pnp', name: 'PNP Transistor', value: 'BC557', description: 'Complementary BJT device.' },
      { type: 'mosfet', name: 'MOSFET', value: 'IRFZ44N', description: 'Voltage-controlled field-effect transistor.' },
      { type: 'opamp', name: 'Op-Amp', value: 'LM741', description: 'Differential voltage amplifier.' },
      { type: 'timer', name: '555 Timer', value: 'NE555', description: 'Timer and oscillator IC.' },
    ],
  },
  {
    title: 'Sources & Ground',
    items: [
      { type: 'dc', name: 'DC Source', value: '12 V', description: 'Ideal DC voltage source.' },
      { type: 'ac', name: 'AC Source', value: '230 V / 50 Hz', description: 'AC source symbol; not solved by this basic estimator.' },
      { type: 'ground', name: 'Ground', value: '0 V', description: 'Reference node for circuit voltage.' },
    ],
  },
  {
    title: 'Instruments',
    items: [
      { type: 'multimeter', name: 'Multimeter', value: 'DMM', description: 'Measurement instrument placeholder.' },
      { type: 'scope', name: 'Oscilloscope', value: '2 Channel', description: 'Waveform display placeholder.' },
    ],
  },
];


/* =========================================================
   INITIAL CIRCUIT
========================================================= */

const initialNodes = [
  {
    id: 'source-1',
    type: 'circuitNode',
    position: { x: 90, y: 160 },
    data: {
      type: 'dc',
      label: 'V1',
      value: '12 V',
      name: 'DC Source',
    },
  },
  {
    id: 'resistor-1',
    type: 'circuitNode',
    position: { x: 390, y: 160 },
    data: {
      type: 'resistor',
      label: 'R1',
      value: '1 kΩ',
      name: 'Resistor',
    },
  },
  {
    id: 'ground-1',
    type: 'circuitNode',
    position: { x: 690, y: 160 },
    data: {
      type: 'ground',
      label: 'GND',
      value: '0 V',
      name: 'Ground',
    },
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'source-1',
    target: 'resistor-1',
    sourceHandle: null,
    targetHandle: null,
    type: 'editableWire',
    data: { bendPoints: [] },
    animated: false,
    style: { stroke: '#48a9ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#48a9ff',
    },
  },
  {
    id: 'e2',
    source: 'resistor-1',
    target: 'ground-1',
    type: 'editableWire',
    data: { bendPoints: [] },
    animated: false,
    style: { stroke: '#48a9ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#48a9ff',
    },
  },
];


/* =========================================================
   COMPONENT SYMBOLS
========================================================= */

function SymbolGraphic({ type }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  return (
    <svg className="cl-symbol" viewBox="0 0 100 48" aria-hidden="true">

      {type === 'resistor' && (
        <g {...common}>
          <path d="M3 24H20L27 12 37 36 47 12 57 36 67 12 77 36 84 24H97" />
        </g>
      )}

      {type === 'capacitor' && (
        <g {...common}>
          <path d="M3 24H43M57 24H97M43 7V41M57 7V41" />
        </g>
      )}

      {type === 'inductor' && (
        <g {...common}>
          <path d="M3 24H14M14 24a9 9 0 0 1 18 0a9 9 0 0 1 18 0a9 9 0 0 1 18 0a9 9 0 0 1 18 0H97" />
        </g>
      )}

      {type === 'diode' && (
        <g {...common}>
          <path d="M3 24H31M69 24H97M31 9L65 24 31 39Z M68 8V40" />
        </g>
      )}

      {type === 'led' && (
        <g {...common}>
          <path d="M3 24H31M69 24H97M31 9L65 24 31 39Z M68 8V40M57 8L68 1M64 15L76 8" />
        </g>
      )}

      {(type === 'dc' || type === 'ac') && (
        <g {...common}>
          <path d="M3 24H35M65 24H97M50 5V43" />
          {type === 'dc'
            ? <path d="M35 15H65M42 33H58" />
            : <path d="M38 24C42 8 48 8 52 24S62 40 66 24" />}
        </g>
      )}

      {type === 'ground' && (
        <g {...common}>
          <path d="M50 3V20M28 20H72M35 28H65M42 36H58" />
        </g>
      )}

      {(type === 'npn' || type === 'pnp' || type === 'mosfet') && (
        <g {...common}>
          <path d="M50 5V43M22 24H42M58 12V36M58 24H80M42 15V33" />
          <path d={type === 'pnp'
            ? 'M52 32L42 26 50 23'
            : 'M42 33L52 27 44 24'} />
        </g>
      )}

      {type === 'opamp' && (
        <g {...common}>
          <path d="M25 5L78 24 25 43Z M3 16H25M3 32H25M78 24H97M15 12V20M11 16H19M15 28V36" />
        </g>
      )}

      {type === 'timer' && (
        <g {...common}>
          <rect x="28" y="5" width="44" height="38" rx="4" />
          <path d="M20 12H28M20 24H28M20 36H28M72 12H80M72 24H80M72 36H80" />
        </g>
      )}

      {type === 'switch' && (
        <g {...common}>
          <path d="M3 24H25M75 24H97M25 24L68 8" />
          <circle cx="25" cy="24" r="3" />
          <circle cx="75" cy="24" r="3" />
        </g>
      )}

      {type === 'fuse' && (
        <g {...common}>
          <path d="M3 24H20M80 24H97" />
          <rect x="20" y="14" width="60" height="20" rx="4" />
          <path d="M25 24H75" />
        </g>
      )}

      {type === 'potentiometer' && (
        <g {...common}>
          <path d="M3 24H20L27 12 37 36 47 12 57 36 67 12 77 36 84 24H97M55 3L45 15M45 15L43 7M45 15L53 13" />
        </g>
      )}

      {(type === 'multimeter' || type === 'scope') && (
        <g {...common}>
          <rect x="28" y="4" width="44" height="40" rx="5" />
          <path d="M35 15H65V30H35Z M39 25L46 20 52 27 60 18" />
        </g>
      )}

    </svg>
  );
}


/* =========================================================
   CIRCUIT NODE
========================================================= */

function CircuitNode({ data, selected }) {
  return (
    <div className={`cl-node ${selected ? 'selected' : ''}`}>

      <Handle
        type="target"
        position={Position.Left}
        className="cl-handle"
      />

      <div className="cl-node-symbol">
        <SymbolGraphic type={data.type} />
      </div>

      <div className="cl-node-label">
        {data.label}
      </div>

      <div className="cl-node-value">
        {data.value}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="cl-handle"
      />

    </div>
  );
}

const nodeTypes = {
  circuitNode: CircuitNode,
};


/* =========================================================
   EDITABLE WIRE EDGE
========================================================= */

function EditableWire({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
  selected,
}) {
  const { screenToFlowPosition } = useReactFlow();

  const bendPoints = data?.bendPoints || [];

  const points = [
    { x: sourceX, y: sourceY },
    ...bendPoints,
    { x: targetX, y: targetY },
  ];

  const path = points
    .map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    )
    .join(' ');


  // Find the nearest wire segment to insert a new bend point.
  const findNearestSegment = (point) => {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];

      const dx = b.x - a.x;
      const dy = b.y - a.y;

      const lengthSquared = dx * dx + dy * dy;

      let t = 0;

      if (lengthSquared > 0) {
        t = (
          (point.x - a.x) * dx +
          (point.y - a.y) * dy
        ) / lengthSquared;
      }

      t = Math.max(0, Math.min(1, t));

      const nearestX = a.x + t * dx;
      const nearestY = a.y + t * dy;

      const distance = Math.hypot(
        point.x - nearestX,
        point.y - nearestY
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  };


  // Add bend point on double-click.
  const handleDoubleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const insertIndex = findNearestSegment(position);

    const updated = [...bendPoints];

    updated.splice(insertIndex, 0, {
      x: position.x,
      y: position.y,
    });

    data?.onBendDragStart?.();
    data?.onBendPointsChange?.(id, updated);
  };


  // Drag existing bend point.
  const handleBendPointerDown = (event, index) => {
    event.preventDefault();
    event.stopPropagation();

    data?.onBendDragStart?.();

    const handlePointerMove = (moveEvent) => {
      const position = screenToFlowPosition({
        x: moveEvent.clientX,
        y: moveEvent.clientY,
      });

      const updated = [...bendPoints];

      updated[index] = {
        x: position.x,
        y: position.y,
      };

      data?.onBendPointsChange?.(id, updated);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };


  // Delete bend point with right-click.
  const handleBendContextMenu = (event, index) => {
    event.preventDefault();
    event.stopPropagation();

    data?.onBendDragStart?.();

    const updated = bendPoints.filter((_, i) => i !== index);

    data?.onBendPointsChange?.(id, updated);
  };


  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
        }}
      />

      {/* Wide transparent path for easier double-click selection */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
        pointerEvents="stroke"
        onDoubleClick={handleDoubleClick}
      />

      <EdgeLabelRenderer>

        {bendPoints.map((point, index) => (
          <div
            key={`${id}-bend-${index}`}
            className="cl-bend-point"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${point.x}px, ${point.y}px)`,
              pointerEvents: 'all',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#48a9ff',
              border: '2px solid #ffffff',
              boxShadow: '0 0 0 3px rgba(72,169,255,0.2)',
              cursor: 'grab',
              zIndex: 1000,
              touchAction: 'none',
            }}
            title="Drag to move · Right-click to remove"
            onPointerDown={(event) =>
              handleBendPointerDown(event, index)
            }
            onContextMenu={(event) =>
              handleBendContextMenu(event, index)
            }
          />
        ))}

      </EdgeLabelRenderer>
    </>
  );
}

const edgeTypes = {
  editableWire: EditableWire,
};


/* =========================================================
   VALUE HELPERS
========================================================= */

function resistanceOhms(value) {
  const text = String(value || '')
    .replace(/\s/g, '')
    .replace(/Ω/gi, '')
    .toLowerCase();

  const n = parseFloat(text);

  if (!Number.isFinite(n)) return null;

  if (text.includes('m')) return n * 1e6;
  if (text.includes('k')) return n * 1e3;

  return n;
}

function voltageValue(value) {
  const n = parseFloat(
    String(value || '').replace(/[^0-9.+-]/g, '')
  );

  return Number.isFinite(n) ? n : null;
}

function fmt(n, unit = '') {
  if (!Number.isFinite(n)) return '—';

  const abs = Math.abs(n);

  const scaled =
    abs >= 1e6
      ? `${(n / 1e6).toFixed(2)} M`
      : abs >= 1e3
        ? `${(n / 1e3).toFixed(2)} k`
        : n.toFixed(3);

  return `${scaled}${unit}`;
}


/* =========================================================
   MAIN CIRCUIT LAB
========================================================= */

export default function CircuitLab() {

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState(null);

  const [search, setSearch] = useState('');
  const [running, setRunning] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('Output');
  const [expandedPanel, setExpandedPanel] = useState(false);

  const [logs, setLogs] = useState([
    'YANTRAVA Circuit Lab ready.',
    'Connect components to build an educational circuit.',
  ]);

  const [measurements, setMeasurements] = useState(null);

  const [frequency, setFrequency] = useState(1);
  const [amplitude, setAmplitude] = useState(5);
  const [waveTime, setWaveTime] = useState(0);

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const [wireColor, setWireColor] = useState('#48a9ff');

  const idCounter = useRef(4);
  const fileInput = useRef(null);


  /* =====================================================
     LOGGING AND UNDO HISTORY
  ===================================================== */

  const log = useCallback((message) => {
    setLogs(prev => [
      ...prev.slice(-99),
      `${new Date().toLocaleTimeString()}  ${message}`,
    ]);
  }, []);

  const snapshot = useCallback(() => ({
    nodes: structuredClone(nodes),
    edges: structuredClone(edges),
  }), [nodes, edges]);

  const remember = useCallback(() => {
    setHistory(prev => [
      ...prev.slice(-29),
      snapshot(),
    ]);

    setFuture([]);
  }, [snapshot]);


  /* =====================================================
     BEND POINT UPDATE HANDLERS
  ===================================================== */

  const updateEdgeBends = useCallback((edgeId, bendPoints) => {
    setEdges(current =>
      current.map(edge =>
        edge.id === edgeId
          ? {
              ...edge,
              data: {
                ...edge.data,
                bendPoints,
              },
            }
          : edge
      )
    );
  }, [setEdges]);


  // These callbacks are supplied to custom edges only at render time.
  // They are not stored in project JSON.
  const renderedEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      type: 'editableWire',
      data: {
        ...edge.data,

        onBendDragStart: remember,

        onBendPointsChange: updateEdgeBends,
      },
    }));
  }, [edges, remember, updateEdgeBends]);


  /* =====================================================
     WIRE CONNECTION
  ===================================================== */

  const onConnect = useCallback((connection) => {
    remember();

    setEdges(current =>
      addEdge({
        ...connection,
        id: `wire-${Date.now()}`,
        type: 'editableWire',
        data: {
          bendPoints: [],
        },
        animated: running,
        style: {
          stroke: wireColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: wireColor,
        },
      }, current)
    );

    log('Wire connection added.');

  }, [
    remember,
    setEdges,
    running,
    wireColor,
    log,
  ]);


  /* =====================================================
     ADD COMPONENT
  ===================================================== */

  const addComponent = (component) => {
    remember();

    const id = `${component.type}-${idCounter.current++}`;

    const count = nodes.length;

    const node = {
      id,
      type: 'circuitNode',

      position: {
        x: 100 + (count % 3) * 210,
        y: 70 + Math.floor(count / 3) * 125,
      },

      data: {
        ...component,
        label: `${component.type.toUpperCase()}${idCounter.current - 1}`,
      },
    };

    setNodes(current => [...current, node]);

    setSelectedNode(id);

    log(`${component.name} added to canvas.`);
  };


  /* =====================================================
     UPDATE COMPONENT
  ===================================================== */

  const updateSelected = (key, value) => {
    remember();

    setNodes(current =>
      current.map(node =>
        node.id === selectedNode
          ? {
              ...node,
              data: {
                ...node.data,
                [key]: value,
              },
            }
          : node
      )
    );
  };


  /* =====================================================
     DELETE COMPONENT
  ===================================================== */

  const deleteSelected = () => {
    if (!selectedNode) return;

    remember();

    setNodes(current =>
      current.filter(node => node.id !== selectedNode)
    );

    setEdges(current =>
      current.filter(edge =>
        edge.source !== selectedNode &&
        edge.target !== selectedNode
      )
    );

    setSelectedNode(null);

    log('Selected component deleted.');
  };


  /* =====================================================
     ROTATE COMPONENT
  ===================================================== */

  const rotateSelected = () => {
    if (!selectedNode) return;

    remember();

    setNodes(current =>
      current.map(node =>
        node.id === selectedNode
          ? {
              ...node,
              data: {
                ...node.data,
                rotation: ((node.data.rotation || 0) + 90) % 360,
              },
            }
          : node
      )
    );
  };


  /* =====================================================
     UNDO
  ===================================================== */

  const undo = () => {
    if (!history.length) return;

    setFuture(prev => [
      ...prev,
      snapshot(),
    ]);

    const previous = history[history.length - 1];

    setNodes(previous.nodes);
    setEdges(previous.edges);

    setHistory(prev => prev.slice(0, -1));

    setSelectedNode(null);

    log('Undo completed.');
  };


  /* =====================================================
     REDO
  ===================================================== */

  const redo = () => {
    if (!future.length) return;

    setHistory(prev => [
      ...prev,
      snapshot(),
    ]);

    const next = future[future.length - 1];

    setNodes(next.nodes);
    setEdges(next.edges);

    setFuture(prev => prev.slice(0, -1));

    setSelectedNode(null);

    log('Redo completed.');
  };


  /* =====================================================
     CLEAR CIRCUIT
  ===================================================== */

  const clearCircuit = () => {
    remember();

    setNodes([]);
    setEdges([]);

    setSelectedNode(null);
    setMeasurements(null);

    log('Canvas cleared.');
  };


  /* =====================================================
     RUN / PAUSE / STOP
  ===================================================== */

  const run = () => {
    setRunning(true);

    setEdges(current =>
      current.map(edge => ({
        ...edge,
        animated: true,
      }))
    );

    log('Preview animation started. No electrical solver is connected.');
  };

  const pause = () => {
    setRunning(false);

    setEdges(current =>
      current.map(edge => ({
        ...edge,
        animated: false,
      }))
    );

    log('Preview paused.');
  };

  const stop = () => {
    setRunning(false);

    setEdges(current =>
      current.map(edge => ({
        ...edge,
        animated: false,
      }))
    );

    setWaveTime(0);

    log('Preview stopped.');
  };


  useEffect(() => {
    if (!running) return undefined;

    const timer = setInterval(() => {
      setWaveTime(time => time + 0.05);
    }, 50);

    return () => clearInterval(timer);

  }, [running]);


  /* =====================================================
     EDUCATIONAL DC ESTIMATOR
  ===================================================== */

  const calculate = () => {

    const source = nodes.find(node => node.data.type === 'dc');

    const resistors = nodes.filter(
      node => node.data.type === 'resistor'
    );

    if (!source || resistors.length !== 1 || edges.length < 2) {

      setMeasurements({
        supported: false,
        message:
          'This quick estimator supports only the starter example: one DC source, one resistor and a ground path. Other topologies need a real circuit solver.',
      });

      setActiveBottomTab('Measurements');

      return;
    }

    const volts = voltageValue(source.data.value);

    const ohms = resistanceOhms(resistors[0].data.value);

    if (volts === null || !ohms || ohms <= 0) {

      setMeasurements({
        supported: false,
        message:
          'Could not read the source voltage or resistance. Check the component values.',
      });

      setActiveBottomTab('Measurements');

      return;
    }

    const amps = volts / ohms;

    setMeasurements({
      supported: true,
      volts,
      ohms,
      amps,
      watts: volts * amps,
    });

    setActiveBottomTab('Measurements');

    log('Educational estimate calculated for the single-source / single-resistor example.');
  };


  /* =====================================================
     SAVE PROJECT
  ===================================================== */

  const saveProject = () => {

    const data = {
      app: 'YANTRAVA Circuit Lab',
      version: 1,
      nodes,
      edges,
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'yantrava-circuit.json';

    a.click();

    URL.revokeObjectURL(url);

    log('Project exported.');
  };


  /* =====================================================
     OPEN PROJECT
  ===================================================== */

  const openProject = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      try {

        const data = JSON.parse(reader.result);

        if (
          !Array.isArray(data.nodes) ||
          !Array.isArray(data.edges)
        ) {
          throw new Error('Invalid project format');
        }

        remember();

        setNodes(data.nodes);

        // Old projects without bendPoints remain supported.
        setEdges(
          data.edges.map(edge => ({
            ...edge,
            type: 'editableWire',
            data: {
              ...edge.data,
              bendPoints: edge.data?.bendPoints || [],
            },
          }))
        );

        setSelectedNode(null);

        log('Project imported successfully.');

      } catch (error) {

        log(`Could not open project: ${error.message}`);

      }

      event.target.value = '';
    };

    reader.readAsText(file);
  };


  /* =====================================================
     SEARCH AND DISPLAY DATA
  ===================================================== */

  const filteredGroups = useMemo(() => {

    return GROUPS
      .map(group => ({
        ...group,

        items: group.items.filter(item =>
          `${item.name} ${item.value} ${item.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
      }))
      .filter(group => group.items.length);

  }, [search]);


  const selected = nodes.find(
    node => node.id === selectedNode
  );


  const wavePoints = Array.from(
    { length: 100 },
    (_, i) => {

      const x = i / 99 * 300;

      const y =
        45 -
        Math.sin(
          (i / 99 * 2 * Math.PI * frequency) + waveTime
        ) * amplitude * 5;

      return `${x},${y}`;
    }
  ).join(' ');


  /* =====================================================
     MAIN UI
  ===================================================== */

  return (

    <div className="yan-circuit-lab">

      {/* HEADER */}

      <header className="cl-header">

        <div className="cl-brand">

          <div className="cl-brand-icon">
            <CircuitBoard size={21} />
          </div>

          <div>
            <h1>Circuit Lab</h1>
            <span>Electronics design workspace</span>
          </div>

        </div>


        <div className="cl-header-actions">

          <button className="cl-btn subtle" onClick={clearCircuit}>
            <Plus size={15} /> New
          </button>

          <button
            className="cl-btn subtle"
            onClick={() => fileInput.current?.click()}
          >
            <FolderOpen size={15} /> Open
          </button>

          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={openProject}
          />

          <button className="cl-btn subtle" onClick={saveProject}>
            <Save size={15} /> Save
          </button>

          <span className="cl-divider" />

          <button
            className="cl-icon-btn"
            title="Undo"
            onClick={undo}
            disabled={!history.length}
          >
            <Undo2 size={17} />
          </button>

          <button
            className="cl-icon-btn"
            title="Redo"
            onClick={redo}
            disabled={!future.length}
          >
            <Redo2 size={17} />
          </button>

          <span className="cl-divider" />

          <button className="cl-btn run" onClick={run}>
            <Play size={15} fill="currentColor" /> Run
          </button>

          <button className="cl-btn subtle" onClick={pause}>
            <Pause size={15} /> Pause
          </button>

          <button className="cl-icon-btn" title="Stop" onClick={stop}>
            <Square size={15} />
          </button>

        </div>

      </header>


      {/* TOOLBAR */}

      <div className="cl-toolbar">

        <div className="cl-tool-group">

          <span className="cl-tool-active">
            <MousePointer2 size={15} /> Select
          </span>

          <button onClick={rotateSelected} disabled={!selected}>
            <RotateCw size={15} /> Rotate
          </button>

          <button onClick={deleteSelected} disabled={!selected}>
            <Trash2 size={15} /> Delete
          </button>

        </div>


        <div className="cl-toolbar-right">

          <span className={`cl-status-dot ${running ? 'live' : ''}`} />

          {running ? 'Preview running' : 'Ready'}

          <button className="cl-clear" onClick={clearCircuit}>
            <X size={14} /> Clear canvas
          </button>

        </div>

      </div>


      {/* WORKSPACE */}

      <main className={`cl-workspace ${expandedPanel ? 'panel-expanded' : ''}`}>

        {/* COMPONENT LIBRARY */}

        <aside className="cl-library">

          <div className="cl-panel-heading">

            <div>
              <span className="cl-eyebrow">LIBRARY</span>
              <h2>Components</h2>
            </div>

            <span className="cl-count">
              {GROUPS.reduce((n, group) => n + group.items.length, 0)}
            </span>

          </div>


          <div className="cl-search">

            <Search size={15} />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search components..."
            />

            <kbd>/</kbd>

          </div>


          <div className="cl-library-list">

            {filteredGroups.map(group => (

              <section
                className="cl-component-group"
                key={group.title}
              >

                <h3>{group.title}</h3>

                <div className="cl-component-grid">

                  {group.items.map(item => (

                    <button
                      className="cl-component-card"
                      key={item.type}
                      onClick={() => addComponent(item)}
                      title={item.description}
                    >

                      <span className="cl-component-symbol">
                        <SymbolGraphic type={item.type} />
                      </span>

                      <span className="cl-component-name">
                        {item.name}
                      </span>

                      <span className="cl-component-value">
                        {item.value}
                      </span>

                      <span className="cl-add">
                        <Plus size={13} />
                      </span>

                    </button>

                  ))}

                </div>

              </section>

            ))}

          </div>


          <div className="cl-library-foot">
            <Zap size={14} />
            Drag-and-drop wiring workspace
          </div>

        </aside>


        {/* CIRCUIT CANVAS */}

        <section className="cl-center">

          <div className="cl-canvas-top">

            <div>
              <span className="cl-eyebrow">WORKSPACE</span>
              <strong>Untitled Circuit</strong>
            </div>

            <div className="cl-canvas-meta">

              <span>
                <Cable size={14} /> {edges.length} wires
              </span>

              <span>
                <CircuitBoard size={14} /> {nodes.length} components
              </span>

            </div>

          </div>


          <div className="cl-canvas">

            <ReactFlow
              nodes={nodes}
              edges={renderedEdges}

              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}

              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}

              onNodeClick={(_, node) =>
                setSelectedNode(node.id)
              }

              onPaneClick={() =>
                setSelectedNode(null)
              }

              fitView
              snapToGrid
              snapGrid={[15, 15]}

              defaultEdgeOptions={{
                type: 'editableWire',
                data: {
                  bendPoints: [],
                },
                style: {
                  stroke: wireColor,
                  strokeWidth: 2,
                },
              }}

            >

              <Background
                color="#27364a"
                gap={20}
                size={1}
              />

             

              <Controls showInteractive={false} />

            </ReactFlow>

          </div>


          <div className="cl-canvas-foot">

            <span>
              <span className="cl-key">⌘</span> + scroll to zoom
            </span>

            <span>
              Click a component to inspect · Connect handles to wire
              · Double-click a wire to add a bend point
            </span>

          </div>

        </section>


        {/* INSPECTOR */}

        <aside className="cl-inspector">

          <div className="cl-panel-heading">

            <div>
              <span className="cl-eyebrow">PROPERTIES</span>
              <h2>Inspector</h2>
            </div>

            <Settings size={17} />

          </div>


          {selected ? (

            <div className="cl-inspector-content">

              <div className="cl-selected-preview">

                <div className="cl-selected-symbol">
                  <SymbolGraphic type={selected.data.type} />
                </div>

                <div>
                  <strong>{selected.data.name}</strong>
                  <small>{selected.id}</small>
                </div>

              </div>


              <label className="cl-field">

                Reference designator

                <input
                  value={selected.data.label || ''}
                  onChange={e =>
                    updateSelected('label', e.target.value)
                  }
                />

              </label>


              <label className="cl-field">

                Component value

                <input
                  value={selected.data.value || ''}
                  onChange={e =>
                    updateSelected('value', e.target.value)
                  }
                />

              </label>


              <div className="cl-property-note">

                <Activity size={15} />

                <span>
                  {GROUPS
                    .flatMap(group => group.items)
                    .find(item => item.type === selected.data.type)
                    ?.description || 'Circuit component'}
                </span>

              </div>


              <div className="cl-field">

                <span>Wire color</span>

                <div className="cl-color-row">

                  <input
                    type="color"
                    value={wireColor}
                    onChange={e => setWireColor(e.target.value)}
                  />

                  <span>{wireColor.toUpperCase()}</span>

                </div>

              </div>


              <button
                className="cl-danger-btn"
                onClick={deleteSelected}
              >
                <Trash2 size={15} /> Delete component
              </button>

            </div>

          ) : (

            <div className="cl-empty-inspector">

              <div className="cl-empty-icon">
                <MousePointer2 size={22} />
              </div>

              <strong>No component selected</strong>

              <p>
                Select a component on the canvas to edit its
                properties and values.
              </p>

            </div>

          )}


          <div className="cl-inspector-bottom">

            <span>DESIGN CHECK</span>

            <div>
              <span className="cl-status-dot" />
              {nodes.length ? 'Components placed' : 'Empty canvas'}
            </div>

            <small>
              {edges.length} connections · {nodes.length} components
            </small>

          </div>

        </aside>

      </main>


      {/* BOTTOM PANEL */}

      <section className={`cl-bottom-panel ${expandedPanel ? 'expanded' : ''}`}>

        <div className="cl-bottom-header">

          <div className="cl-bottom-tabs">

            {[
              { name: 'Output', icon: Terminal },
              { name: 'Measurements', icon: Gauge },
              { name: 'Waveforms', icon: Waves },
            ].map(tab => (

              <button
                key={tab.name}
                className={activeBottomTab === tab.name ? 'active' : ''}
                onClick={() => setActiveBottomTab(tab.name)}
              >

                <tab.icon size={15} />

                {tab.name}

                {tab.name === 'Measurements' &&
                  measurements?.supported && <i />}

              </button>

            ))}

          </div>


          <div className="cl-bottom-actions">

            <button onClick={() => setExpandedPanel(v => !v)}>

              {expandedPanel ? 'Collapse panel' : 'Expand panel'}

              <ChevronDown
                size={15}
                className={expandedPanel ? 'turned' : ''}
              />

            </button>

          </div>

        </div>


        <div className="cl-bottom-content">

          {/* OUTPUT */}

          {activeBottomTab === 'Output' && (

            <div className="cl-console">

              {logs.map((line, i) => (

                <div
                  className="cl-log-line"
                  key={`${i}-${line}`}
                >

                  <span>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {line}

                </div>

              ))}

            </div>

          )}


          {/* MEASUREMENTS */}

          {activeBottomTab === 'Measurements' && (

            <div className="cl-measurements">

              <div className="cl-measure-intro">

                <div>
                  <strong>DC quick estimate</strong>

                  <p>
                    Limited educational calculation for one DC
                    source and one resistor.
                  </p>
                </div>

                <button
                  className="cl-btn run"
                  onClick={calculate}
                >
                  <Activity size={15} /> Calculate
                </button>

              </div>


              {measurements ? (

                measurements.supported ? (

                  <div className="cl-measure-grid">

                    {[
                      ['Voltage', fmt(measurements.volts, ' V')],
                      ['Resistance', fmt(measurements.ohms, ' Ω')],
                      ['Current', fmt(measurements.amps, ' A')],
                      ['Power', fmt(measurements.watts, ' W')],
                    ].map(([key, value]) => (

                      <div
                        className="cl-measure-card"
                        key={key}
                      >

                        <span>{key}</span>
                        <strong>{value}</strong>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="cl-warning">
                    {measurements.message}
                  </div>

                )

              ) : (

                <div className="cl-muted-message">
                  Press Calculate to estimate the starter example.
                </div>

              )}


              <p className="cl-disclaimer">

                Not a SPICE solver. It does not analyze arbitrary
                wiring, series/parallel networks, AC circuits or
                component operating points.

              </p>

            </div>

          )}


          {/* WAVEFORMS */}

          {activeBottomTab === 'Waveforms' && (

            <div className="cl-wave-panel">

              <div className="cl-wave-controls">

                <label>

                  Frequency

                  <b>{frequency.toFixed(1)} Hz</b>

                  <input
                    type="range"
                    min="0.2"
                    max="5"
                    step="0.1"
                    value={frequency}
                    onChange={e =>
                      setFrequency(Number(e.target.value))
                    }
                  />

                </label>


                <label>

                  Amplitude

                  <b>{amplitude.toFixed(1)} V</b>

                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={amplitude}
                    onChange={e =>
                      setAmplitude(Number(e.target.value))
                    }
                  />

                </label>

              </div>


              <div className="cl-wave-chart">

                <svg
                  viewBox="0 0 300 90"
                  preserveAspectRatio="none"
                >

                  <path
                    d="M0 45H300 M0 15H300 M0 75H300"
                    stroke="#29384c"
                    strokeDasharray="3 5"
                    fill="none"
                  />

                  <polyline
                    points={wavePoints}
                    fill="none"
                    stroke="#42b5ff"
                    strokeWidth="2"
                  />

                </svg>

              </div>


              <span className="cl-disclaimer">
                Illustrative sine wave only — not measured from
                the current circuit.
              </span>

            </div>

          )}

        </div>

      </section>


      {/* STATUS BAR */}

      <footer className="cl-statusbar">

        <span>
          <span className={`cl-status-dot ${running ? 'live' : ''}`} />
          {running ? 'Preview active' : 'Circuit Lab ready'}
        </span>

        <span>
          Educational circuit workspace · Solver not connected
        </span>

        <span>
          {nodes.length} components&nbsp; · &nbsp;{edges.length} wires
        </span>

      </footer>

    </div>
  );
}
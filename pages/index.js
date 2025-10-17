import Head from 'next/head';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const GRID_SIZE = 32;
const GRID_MIN = -Math.PI;
const GRID_MAX = Math.PI;

const generateGrid = (size, min, max) => {
  const step = (max - min) / (size - 1);
  return Array.from({ length: size }, (_, index) => min + index * step);
};

const GRID_VALUES = generateGrid(GRID_SIZE, GRID_MIN, GRID_MAX);

const surfaceDefinitions = [
  {
    id: 'function-a',
    symbol: 'f1',
    label: 'f1(x, y) = sin(x) * cos(y)',
    accent: '#6f9ce5',
    opacity: 0.95,
    colorscale: [
      [0, '#081020'],
      [0.35, '#0f1f42'],
      [0.7, '#1b3f89'],
      [1, '#6f9ce5'],
    ],
    evaluator: (x, y) => Math.sin(x) * Math.cos(y),
  },
  {
    id: 'function-b',
    symbol: 'f2',
    label: 'f2(x, y) = 0.25 * x^2 - 0.5 * y^2',
    accent: '#f5a97f',
    opacity: 0.68,
    colorscale: [
      [0, '#140b0f'],
      [0.4, '#2f1624'],
      [0.7, '#6d2a3f'],
      [1, '#f5a97f'],
    ],
    evaluator: (x, y) => 0.25 * x * x - 0.5 * y * y,
  },
];

const functionDefinitions = surfaceDefinitions.map((definition) => {
  const z = GRID_VALUES.map((y) =>
    GRID_VALUES.map((x) => Number(definition.evaluator(x, y).toFixed(4)))
  );

  return {
    id: definition.id,
    symbol: definition.symbol,
    label: definition.label,
    accent: definition.accent,
    plot: {
      type: 'surface',
      x: GRID_VALUES,
      y: GRID_VALUES,
      z,
      opacity: definition.opacity,
      colorscale: definition.colorscale,
      showscale: false,
    },
  };
});

const axisFont = {
  family: 'JetBrains Mono, monospace',
  size: 12,
  color: '#93a5cc',
};

const layout = {
  autosize: true,
  margin: { l: 0, r: 0, t: 0, b: 0 },
  paper_bgcolor: '#020309',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: {
    family: 'JetBrains Mono, monospace',
    color: '#edf3ff',
  },
  scene: {
    xaxis: {
      showspikes: false,
      showgrid: false,
      zeroline: false,
      title: { text: 'X', font: axisFont },
      tickfont: axisFont,
    },
    yaxis: {
      showspikes: false,
      showgrid: false,
      zeroline: false,
      title: { text: 'Y', font: axisFont },
      tickfont: axisFont,
    },
    zaxis: {
      showspikes: false,
      showgrid: false,
      zeroline: false,
      title: { text: 'Z', font: axisFont },
      tickfont: axisFont,
    },
    camera: { eye: { x: 1.6, y: 1.6, z: 1.1 } },
  },
};

export default function FullscreenPlot() {
  const [expandedFunctions, setExpandedFunctions] = useState({});

  const toggleFunction = (id) => {
    setExpandedFunctions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Head>
        <title>Mobius Viewport</title>
        <meta name="description" content="Full-screen Plotly surface preview." />
      </Head>
      <div className="fullscreen-plot">
        <Plot
          data={functionDefinitions.map(({ plot }) => plot)}
          layout={layout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
        <aside className="function-overlay" aria-label="Active function descriptions">
          {functionDefinitions.map(({ id, symbol, label, accent }) => {
            const isExpanded = Boolean(expandedFunctions[id]);
            const labelId = `${id}-label`;

            return (
              <div
                key={id}
                className={`function-chip${isExpanded ? ' is-expanded' : ''}`}
                style={{ '--accent-color': accent }}
              >
                {isExpanded && (
                  <div
                    id={labelId}
                    className="function-label"
                    role="status"
                  >
                    {label}
                  </div>
                )}
                <button
                  type="button"
                  className="function-circle"
                  aria-expanded={isExpanded}
                  aria-controls={isExpanded ? labelId : undefined}
                  aria-label={`${isExpanded ? 'Hide' : 'Show'} description for ${symbol}`}
                  title={`${isExpanded ? 'Hide' : 'Show'} ${label}`}
                  onClick={() => toggleFunction(id)}
                >
                  {symbol}
                </button>
              </div>
            );
          })}
        </aside>
      </div>
    </>
  );
}

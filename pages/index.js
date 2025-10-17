import Head from 'next/head';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import FunctionOverlay from '../components/FunctionOverlay';
import PromptOverlay from '../components/PromptOverlay';
import { createExplicitSurfaceDefinition } from '../lib/explicitSurfaces';
import { createParametricCurveDefinition } from '../lib/parametricSurfaces';
import { GRID_VALUES } from '../lib/grid';
import { EXPLICIT_SURFACE_STYLES, MAX_EXPLICIT_SURFACES } from '../lib/surfaceStyles';
import { createPlanarFunctionDefinition } from '../lib/planarFunctions';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const INITIAL_PARAMETRIC_FUNCTIONS = [
  createParametricCurveDefinition({
    id: 'parametric-p1',
    symbol: 'p1',
    xExpression: 'sin(t)',
    yExpression: 'cos(2 * t)',
    parameterRange: {
      start: -2 * Math.PI,
      end: 2 * Math.PI,
      steps: 250,
    },
    accent: '#F5E663',
  }),
];

const INITIAL_PLANAR_FUNCTIONS = [
  createPlanarFunctionDefinition({
    id: 'planar-g1',
    symbol: 'g1',
    expression: 'x^2',
    domain: {
      start: -4,
      end: 4,
    },
    samples: 220,
    accent: '#C77DFF',
  }),
];

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
  const [surfaceSlots, setSurfaceSlots] = useState(
    () => Array(MAX_EXPLICIT_SURFACES).fill(null)
  );
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [promptError, setPromptError] = useState(null);
  const nextReplacementIndexRef = useRef(0);
  const parametricFunctionsRef = useRef(INITIAL_PARAMETRIC_FUNCTIONS);
  const planarFunctionsRef = useRef(INITIAL_PLANAR_FUNCTIONS);

  const parametricFunctions = parametricFunctionsRef.current;
  const planarFunctions = planarFunctionsRef.current;
  const explicitFunctions = surfaceSlots.filter(Boolean);
  const activeFunctions = [...parametricFunctions, ...planarFunctions, ...explicitFunctions];

  const toggleFunction = (symbol) => {
    setExpandedFunctions((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  const handlePromptToggle = () => {
    setIsPromptOpen((prev) => !prev);
    setPromptError(null);
  };

  const handlePromptSubmit = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setPromptError('Enter an explicit function of x and y to visualize.');
      return;
    }

    try {
      setSurfaceSlots((previous) => {
        const updated = [...previous];
        let targetIndex = previous.findIndex((slot) => slot === null);

        if (targetIndex === -1) {
          targetIndex = nextReplacementIndexRef.current;
        }

        const style = EXPLICIT_SURFACE_STYLES[targetIndex];
        const surfaceDefinition = createExplicitSurfaceDefinition({
          id: `explicit-${style.symbol}`,
          symbol: style.symbol,
          expression: trimmed,
          gridValues: GRID_VALUES,
          accent: style.accent,
          opacity: style.opacity,
          colorscale: style.colorscale,
        });

        nextReplacementIndexRef.current = (targetIndex + 1) % MAX_EXPLICIT_SURFACES;

        updated[targetIndex] = {
          ...surfaceDefinition,
          styleIndex: targetIndex,
        };

        return updated;
      });

      setPromptValue('');
      setPromptError(null);
    } catch (error) {
      console.error('Failed to create explicit surface from prompt:', error);
      setPromptError(
        error?.message || 'Unable to visualize that expression. Please try again.'
      );
    }
  };

  const handlePromptClear = () => {
    setPromptValue('');
    setPromptError(null);
  };

  return (
    <>
      <Head>
        <title>Mobius Viewport</title>
        <meta name="description" content="Full-screen Plotly surface preview." />
      </Head>
      <div className="fullscreen-plot">
        <Plot
          data={activeFunctions.map(({ plot }) => plot)}
          layout={layout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
        <FunctionOverlay
          functions={activeFunctions}
          expanded={expandedFunctions}
          onToggle={toggleFunction}
        />
        <PromptOverlay
          isOpen={isPromptOpen}
          onToggle={handlePromptToggle}
          promptValue={promptValue}
          onPromptChange={setPromptValue}
          onSubmit={handlePromptSubmit}
          onClear={handlePromptClear}
          functions={activeFunctions}
          error={promptError}
        />
      </div>
    </>
  );
}
